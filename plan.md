# Website Build Prompt: ANNE - Personal AI Assistant for Older Adults

## Product Overview

ANNE is a personal AI assistant designed for adults 65+ who want help managing their lives without being overwhelmed by technology. Anne communicates through two intentionally low-tech channels: printed weekly summaries delivered to their home printer, and phone calls/texts to a dedicated number. The positioning is "Who says assistants are only for working people?" - framing this as bringing the executive assistant experience to retirement.

Anne helps users by:
- Anticipating needs and surfacing decisions that need attention
- Handling administrative, financial, and tech tasks they don't want to do
- Buffering them from outside distractions and potential threats (fraud detection, subscription creep)
- Freeing them up to focus on what matters (family, hobbies, health, travel)

The service includes "multiplayer mode" - users can delegate specific tasks to trusted family members or financial professionals while maintaining control.

## Target Audience

Adults 65+ who:
- Have built lives worth managing (financial assets, social calendars, health routines)
- Find technology overwhelming or annoying rather than helpful
- Value their independence and don't want to burden family
- Remember when assistants and secretaries handled this kind of work

The website speaks directly to these older adults (not their adult children).

---

## Page Structure

### Section 1: Hero

- Full-width display of the provided retro secretary image
- Speech bubble already in image says "Who says assistants are only for working people?"
- Brand name "ANNE" in top right corner
- Below or overlaid: Brief tagline and primary CTA to join waitlist

### Section 2: Audio Demo

- Left side: Illustration or photo of a relaxed woman holding a coffee cup, talking happily on the phone (warm, comfortable, not clinical)
- Right side: Large, obvious audio player with clear "Play" button - should look like something you'd confidently tap
- Caption: Something like "Hear how Anne helps Judy plan her week"
- Audio file: Placeholder for now (user will upload later)
- Include secondary CTA: "Call or text Anne at 1-888-666-ANNE"

### Section 3: The Weekly Summary

- Left side or top: Animated GIF of a home printer printing pages in a sunny, nicely-lit home environment (needs to be created - warm natural lighting, not sterile office)
- Right side or below: Display of the 3-page weekly summary, styled as web content that looks like printed paper
- The paper content should include all elements from the provided PDF:
  - **Page 1:** Greeting, week dates, "Success last week" celebrations, "Your goals this week," and "Decisions needed" table with checkboxes
  - **Page 2:** Continuation of decisions (suspicious Zelle, doctor appointment), and the "Call Anne" contact info
  - **Page 3:** "Judy's to do" list and "Being handled for you (FYI)" list
- Include CTA: "Call or text Anne at 1-888-666-ANNE or [click here] to try it out"

### Section 4: Waitlist Signup

Appears when CTA is clicked, or as footer section:
- Simple form: Email address field
- Pre-checked checkbox: "I'm willing to chat with the team building Anne"
- Submit button
- Brief reassurance copy (no spam, just updates)

---

## Design Direction

### Retro-Modern Fusion

- **Hero section:** Embrace the retro pink aesthetic from the secretary image fully
- **Transition as you scroll:** Move toward cleaner, warmer modern feel
- **Color palette:** Dusty rose/pink (from hero), warm cream/off-white backgrounds, teal accent (pulled from typewriter in image), warm gray for text
- The "paper" elements serve as the bridge between retro and modern - literal paper aesthetic in a clean web layout

### Paper Styling for Weekly Summary

- Slightly off-white background (#FFFEF9 or similar)
- Subtle drop shadow to create "floating paper" effect
- Optional subtle paper texture
- Clean typography on the paper itself
- Pages should feel tangible and real

### Typography

- **Headers:** Warm serif with personality (e.g., Literata, Source Serif, or Lora)
- **Body:** Highly readable sans-serif (e.g., Source Sans, Open Sans)
- Minimum 18px base font size, larger for key content
- Generous line height (1.5-1.6)

---

## Accessibility Requirements (65+ Optimized)

- Minimum 18pt (24px) font size for body text, larger for headers
- High contrast ratios (WCAG AAA where possible)
- Large click/tap targets (minimum 44px, preferably larger)
- No autoplay on audio - user must initiate
- Clear visual hierarchy with generous whitespace
- Strong, visible focus states for keyboard navigation
- Reduced motion: Printer GIF should be subtle/gentle, or offer reduced-motion alternative
- Buttons should look like buttons (not flat/ambiguous)
- Clear, simple language throughout

---

## Technical Notes

- Static site is fine (no backend needed beyond form submission)
- Waitlist form: Collect to simple storage for now (could use Formspree, Netlify Forms, or similar)
- Audio player: Use native HTML5 audio with custom styling for large, clear controls
- Printer GIF: Will need to be created or sourced - should show a standard home inkjet printer in warm lighting, printing multiple pages
- No domain yet - will be hosted on temporary URL initially

---

## Assets Provided

1. **Hero image:** Retro secretary at desk with "Who says assistants are only for working people?" speech bubble
2. **PDF content:** 3-page weekly summary for "Judy" to be recreated as styled web content

## Assets Needed

1. **Audio file** of Anne phone conversation (to be provided later - build player with placeholder)
2. **Printer GIF** (needs to be created/sourced)
3. **Illustration or photo** of woman on phone with coffee (needs to be sourced)

---

## Voice and Tone

- Warm, friendly, confident
- Speaks to the reader as a capable adult, not a fragile elder
- Emphasizes freedom and relief, not fear or decline
- Light touch of retro charm without being kitschy
- Clear and direct - no jargon, no tech-speak
