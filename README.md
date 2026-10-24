# HESI A2 Assessment Exam Practice — v1.0.0

A dependency-free static web app for GitHub Pages. English interface; no build step required.

## Important content status
All 40 included questions are **illustrative demonstration questions** created to make the application flows testable. They are not official HESI questions, and the content should be reviewed by a qualified educator and replaced/approved before selling the app as a definitive educational resource.

## Files
- `index.html` — app shell and script loading order.
- `styles.css` — responsive UI and accessibility-minded styling.
- `app.js` — quiz flow, results, answer review, sharing, unlock rule, recommendations, offer rendering and basic integrity checks.
- `config.js` — central configuration for level rules, referral behavior, Gumroad offers/prices/URLs and analytics status.
- `questions.js` — question bank, with Q1–Q20 for Level 1 and Q21–Q40 for Level 2.

## Run locally
1. Keep all five files in the same folder.
2. Open `index.html` in a modern browser. No npm, Node.js, server, or external JavaScript library is required.
3. For browser share support, a secure context (HTTPS, such as GitHub Pages) is recommended. If Web Share or clipboard access is unavailable, the app displays a copyable share message where supported.

## Deploy to GitHub Pages
1. Upload all five files to the root of the repository.
2. In GitHub, open **Settings → Pages**.
3. Choose **Deploy from a branch**, select your branch (for example `main` or `master`) and folder `/ (root)`.
4. Save and wait for the Pages deployment to finish.
5. Open the published URL and test the journeys in the checklist below.

## Access rule
Level 2 unlocks after the user answers all 20 Level 1 questions and submits the level. The unlock is saved in this browser's `localStorage`. Sharing is encouraged but not required and is never falsely treated as proof of a referral.

## Important static-hosting limitations
- `localStorage` is browser/device-specific. Clearing browser data or switching device/browser can remove the unlock.
- This is a client-side rule, not secure authorization. A technical user can inspect JavaScript or alter browser storage. A backend/authentication service is required for robust access control.
- Referral links contain a locally generated `ref` identifier. The app can remember a referrer identifier in the recipient's browser, but without a backend/database it cannot reliably count referrals, verify that an invitee finished the quiz, prevent self-referrals, or award access based on a qualified referral.
- Analytics are disabled. No event data is sent to a server.
- Gumroad links are the exact URLs supplied by the project owner. Confirm the current prices and product contents on the product pages. The $14.98 and $89.98 values are configured display prices, not live price verification.
- The app does not receive purchase confirmation from Gumroad. An offer click is not an order.
- The app uses a Google Fonts import for DM Sans and Manrope; if external font loading is unavailable, it falls back to system fonts.

## Configuration
Edit `config.js`:
- `levels` — level names and question ranges.
- `unlock.rule` — currently `complete-level-1`.
- `referral.parameter` and `referral.localTrackingOnly`.
- `offers` — product names, displayed prices, descriptions and Gumroad URLs.
- `analytics.enabled` — currently `false`; a provider and privacy review are needed before enabling analytics.

Edit `questions.js` to replace the demo question bank. Keep unique IDs, 20 questions per level, four options (`A`–`D`), and an answer key that matches one option. Each item may include an explanation and subject.

## Test checklist
1. Home loads and shows demo-content notice.
2. Start Level 1; answer navigation works.
3. Submit with unanswered questions; app returns to first missing question and does not unlock Level 2.
4. Answer all 20 questions; submit; score, percentage, correct/incorrect/answered/unanswered metrics display.
5. Result share action uses Web Share API where available, otherwise attempts clipboard and provides a fallback.
6. Level 2 unlocks after Level 1 submission and remains unlocked on the same browser.
7. A fresh browser with `?level=2` cannot start Level 2 without completing Level 1.
8. Level 2 has Q21–Q40, a separate score and result page.
9. Review answers shows chosen/correct answers and explanations.
10. Level 2 result shows recommendations and the four configured Gumroad offers.
11. Broken/missing question configuration displays a setup error rather than a false success.
12. Direct source inspection confirms that this is client-side gating, not secure access control.

## Before production
- Replace/approve all demonstration questions and explanations.
- Confirm each Gumroad product's current contents and price.
- Add a backend if verified referrals, persistent cross-device access, secure gating, purchase confirmation or reliable analytics are required.
- Add a privacy notice if analytics or user-level tracking is introduced.
