/**
 * ANNE Marketing Website
 * Main JavaScript
 */

// ============================================
// SESSION & CARD SELECTION
// ============================================

// Generate or retrieve session ID
function getSessionId() {
  let sessionId = localStorage.getItem('anne_session_id');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('anne_session_id', sessionId);
  }
  return sessionId;
}

const sessionId = getSessionId();
const MAX_SELECTIONS = 5;
const MIN_SELECTIONS = 3;

// Card selection logic
const hookCards = document.getElementById('hookCards');

// Randomize card order on page load to remove position bias
function shuffleCards() {
  if (!hookCards) return;

  const cards = Array.from(hookCards.children);

  // Fisher-Yates shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  // Re-append in shuffled order
  cards.forEach(card => hookCards.appendChild(card));
}

shuffleCards();
const seeHowButton = document.getElementById('seeHowButton');
const selectionCountEl = document.getElementById('selectionCount');

let selectedCards = new Set();

function updateSelectionUI() {
  const count = selectedCards.size;

  // Update count display
  if (selectionCountEl) {
    if (count === 0) {
      selectionCountEl.textContent = '0 selected';
    } else if (count < MIN_SELECTIONS) {
      selectionCountEl.textContent = `${count} selected — pick at least ${MIN_SELECTIONS}`;
    } else {
      selectionCountEl.textContent = `${count} selected`;
    }
  }

  // Update button state
  if (seeHowButton) {
    seeHowButton.disabled = count < MIN_SELECTIONS;
  }

  // Update card disabled states (when at max)
  const allCards = hookCards?.querySelectorAll('.hook-card') || [];
  allCards.forEach(card => {
    const cardId = card.dataset.cardId;
    if (count >= MAX_SELECTIONS && !selectedCards.has(cardId)) {
      card.classList.add('disabled');
    } else {
      card.classList.remove('disabled');
    }
  });
}

if (hookCards) {
  hookCards.addEventListener('click', (e) => {
    const card = e.target.closest('.hook-card');
    if (!card) return;

    const cardId = card.dataset.cardId;

    // If already selected, deselect
    if (selectedCards.has(cardId)) {
      selectedCards.delete(cardId);
      card.classList.remove('selected');
    }
    // If not at max, select
    else if (selectedCards.size < MAX_SELECTIONS) {
      selectedCards.add(cardId);
      card.classList.add('selected');
    }

    updateSelectionUI();
  });
}

// Handle "See How Anne Helps" button
let hasSubmittedSelections = false;

if (seeHowButton) {
  seeHowButton.addEventListener('click', () => {
    if (selectedCards.size < MIN_SELECTIONS) return;

    // Submit selections to Google Sheets (will update if row exists)
    const selectionsArray = Array.from(selectedCards);
    submitToGoogleSheets({
      session_id: sessionId,
      selections: selectionsArray.join(', '),
      email: '',
      willing_to_chat: '',
      help_with: '',
      form_type: 'card_selections'
    });

    hasSubmittedSelections = true;

    // Scroll to summary section
    const summarySection = document.getElementById('summary');
    if (summarySection) {
      summarySection.scrollIntoView({ behavior: 'smooth' });
    }

    // Update button to show it worked (but keep enabled for changes)
    seeHowButton.textContent = 'See How Anne Helps ↓';
  });
}

// Audio Player
const audioElement = document.getElementById('audioElement');
const playButton = document.getElementById('playButton');
const playIcon = playButton?.querySelector('.play-icon');
const pauseIcon = playButton?.querySelector('.pause-icon');
const audioProgress = document.getElementById('audioProgress');
const audioProgressBar = document.getElementById('audioProgressBar');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');

let isPlaying = false;

// Format time as M:SS
function formatTime(seconds) {
  if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Update play/pause button state
function updatePlayButton() {
  if (playIcon && pauseIcon) {
    playIcon.style.display = isPlaying ? 'none' : 'block';
    pauseIcon.style.display = isPlaying ? 'block' : 'none';
  }
  if (playButton) {
    playButton.setAttribute('aria-label', isPlaying ? 'Pause audio demo' : 'Play audio demo');
  }
}

// Play/Pause toggle
if (playButton && audioElement) {
  playButton.addEventListener('click', () => {
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play().catch(e => {
        console.log('Audio not available yet:', e.message);
      });
    }
  });

  audioElement.addEventListener('play', () => {
    isPlaying = true;
    updatePlayButton();
  });

  audioElement.addEventListener('pause', () => {
    isPlaying = false;
    updatePlayButton();
  });

  audioElement.addEventListener('ended', () => {
    isPlaying = false;
    updatePlayButton();
    if (audioProgressBar) audioProgressBar.style.width = '0%';
  });

  // Update progress bar
  audioElement.addEventListener('timeupdate', () => {
    if (audioElement.duration && audioProgressBar) {
      const progress = (audioElement.currentTime / audioElement.duration) * 100;
      audioProgressBar.style.width = `${progress}%`;
    }
    if (currentTimeEl) {
      currentTimeEl.textContent = formatTime(audioElement.currentTime);
    }
  });

  // Update duration when metadata loads
  audioElement.addEventListener('loadedmetadata', () => {
    if (durationEl) {
      durationEl.textContent = formatTime(audioElement.duration);
    }
  });

  // Click on progress bar to seek
  if (audioProgress) {
    audioProgress.addEventListener('click', (e) => {
      const rect = audioProgress.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const seekTime = (clickX / width) * audioElement.duration;
      if (!isNaN(seekTime) && isFinite(seekTime)) {
        audioElement.currentTime = seekTime;
      }
    });
  }
}

// Waitlist Form
const waitlistForm = document.getElementById('waitlistForm');
const formSuccess = document.getElementById('formSuccess');
const followupSubmit = document.getElementById('followupSubmit');
const followupQuestion = document.getElementById('followupQuestion');
const followupThanks = document.getElementById('followupThanks');

let submittedEmail = '';

const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbyFvwDPzLXUvDKughMIm7H3uQqEDum3SAwJvNnas3G9M3RHafAtb1JsXPaXiVXPoM28/exec';

// Helper function to submit data to Google Sheets
function submitToGoogleSheets(data) {
  // Create a form and submit it via iframe to avoid CORS issues
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = GOOGLE_SHEETS_URL;
  form.target = 'hidden-iframe';

  // Add data as hidden fields
  for (const key in data) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = data[key];
    form.appendChild(input);
  }

  // Create hidden iframe if it doesn't exist
  let iframe = document.getElementById('hidden-iframe');
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.name = 'hidden-iframe';
    iframe.id = 'hidden-iframe';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
  }

  document.body.appendChild(form);
  form.submit();
  form.remove();
}

if (waitlistForm) {
  waitlistForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(waitlistForm);
    const submitButton = waitlistForm.querySelector('button[type="submit"]');

    // Store email for follow-up submission
    submittedEmail = formData.get('email');

    // Disable button during submission
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Joining...';
    }

    try {
      submitToGoogleSheets({
        session_id: sessionId,
        selections: Array.from(selectedCards).join(', '),
        email: submittedEmail,
        willing_to_chat: '',
        help_with: '',
        form_type: 'waitlist_signup'
      });

      // Show success message with follow-up question
      waitlistForm.style.display = 'none';
      // Hide quick feedback section since they'll answer in the follow-up
      const quickFeedbackSection = document.getElementById('quickFeedback');
      if (quickFeedbackSection) {
        quickFeedbackSection.style.display = 'none';
      }
      if (formSuccess) {
        formSuccess.style.display = 'block';
      }

    } catch (error) {
      console.error('Form submission error:', error);
      alert('There was a problem joining the waitlist. Please try again.');

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Join the Waitlist';
      }
    }
  });
}

// Follow-up question submission
if (followupSubmit) {
  followupSubmit.addEventListener('click', async () => {
    const selectedOption = document.querySelector('input[name="willing_to_chat"]:checked');
    const helpWithTextarea = document.getElementById('helpWith');

    const willingToChat = selectedOption ? selectedOption.value : null;
    const helpWith = helpWithTextarea ? helpWithTextarea.value.trim() : '';

    // Require at least one response
    if (!willingToChat && !helpWith) {
      return;
    }

    followupSubmit.disabled = true;
    followupSubmit.textContent = 'Submitting...';

    try {
      submitToGoogleSheets({
        session_id: sessionId,
        selections: Array.from(selectedCards).join(', '),
        email: submittedEmail,
        willing_to_chat: willingToChat || '',
        help_with: helpWith,
        form_type: 'followup'
      });

      // Hide the question, show appropriate thanks message
      if (followupQuestion) {
        followupQuestion.style.display = 'none';
      }
      if (followupThanks) {
        followupThanks.textContent = willingToChat === 'yes'
          ? "Appreciate your willingness to chat!"
          : "That's fine, we appreciate your interest in Anne.";
        followupThanks.style.display = 'block';
      }

    } catch (error) {
      console.error('Follow-up submission error:', error);
      followupSubmit.disabled = false;
      followupSubmit.textContent = 'Submit';
    }
  });
}

// Quick Feedback submission (for users not ready to sign up)
const quickFeedbackSubmit = document.getElementById('quickFeedbackSubmit');
const quickFeedback = document.getElementById('quickFeedback');
const quickFeedbackThanks = document.getElementById('quickFeedbackThanks');

if (quickFeedbackSubmit) {
  quickFeedbackSubmit.addEventListener('click', async () => {
    const textarea = document.getElementById('quickHelpWith');
    const feedbackText = textarea ? textarea.value.trim() : '';

    if (!feedbackText) {
      return; // No feedback entered
    }

    quickFeedbackSubmit.disabled = true;
    quickFeedbackSubmit.textContent = 'Sending...';

    try {
      submitToGoogleSheets({
        session_id: sessionId,
        selections: Array.from(selectedCards).join(', '),
        email: '',
        willing_to_chat: '',
        help_with: feedbackText,
        form_type: 'quick_feedback'
      });

      // Hide textarea and button, show thanks
      textarea.style.display = 'none';
      quickFeedbackSubmit.style.display = 'none';
      document.querySelector('.quick-feedback-label').style.display = 'none';
      if (quickFeedbackThanks) {
        quickFeedbackThanks.style.display = 'block';
      }

    } catch (error) {
      console.error('Quick feedback error:', error);
      quickFeedbackSubmit.disabled = false;
      quickFeedbackSubmit.textContent = 'Share Feedback';
    }
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      // Update focus for accessibility
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  });
});

// Decision checkboxes - radio-like behavior (only one per row, can uncheck)
document.querySelectorAll('.decision-options').forEach(optionsCell => {
  const checkboxes = optionsCell.querySelectorAll('.decision-checkbox');

  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        // Uncheck all other checkboxes in this group
        checkboxes.forEach(cb => {
          if (cb !== e.target) {
            cb.checked = false;
          }
        });
      }
    });
  });
});

// Scroll Indicator - hide after user scrolls
const scrollIndicator = document.getElementById('scrollIndicator');

if (scrollIndicator) {
  let initialScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    // Only hide if user has scrolled down from initial position
    if (window.scrollY > initialScrollY + 100) {
      scrollIndicator.classList.add('hidden');
    }
  }, { passive: true });

  // Also allow clicking the indicator to scroll down to cards section with context
  scrollIndicator.addEventListener('click', () => {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      heroContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
      scrollIndicator.classList.add('hidden');
    }
  });
}

// Reduced motion check
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  // Disable smooth scrolling
  document.documentElement.style.scrollBehavior = 'auto';
}

// Log when page loads
console.log('ANNE Marketing Website loaded successfully');
