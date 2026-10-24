# Test results — HESI A2 Reactive App v1

## Automated checks performed in this environment

| Check | Result | Notes |
|---|---|---|
| JavaScript syntax (`app.js`) | PASS | `node --check` |
| JavaScript syntax (`config.js`) | PASS | `node --check` |
| JavaScript syntax (`questions.js`) | PASS | `node --check` |
| Question bank integrity | PASS | 40 unique IDs, 20 questions per level, four A–D choices, every answer key maps to an option |
| Supplied Gumroad URLs | PASS | All four exact supplied URLs found in central configuration |
| Simulated application flow | PASS | Home, pre-unlock Level 2 block, missing-answer prevention, Level 1 completion/unlock, Level 2 Q21–Q40, Level 2 results and offer links, review screen and return to results |

## Not verified in a real interactive browser

The automated flow test used a lightweight mocked DOM, not a full browser session. Responsive layout, actual native sharing/clipboard permissions, keyboard/screen-reader behavior, opening Gumroad pages, and GitHub Pages deployment still require manual browser checks. The headless browser did not complete in this execution environment, so no claim of full end-to-end browser testing is made.

## Important content and security limitations

- All questions are illustrative demo content, not official HESI questions.
- Level 2 unlock is client-side and stored in localStorage. It is not secure against a technical user.
- Referral IDs are local-only and do not verify a new user or completed quiz.
- Analytics and purchase confirmation are not configured.
