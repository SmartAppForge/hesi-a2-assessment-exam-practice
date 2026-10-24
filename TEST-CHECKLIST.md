# Manual QA checklist — HESI A2 Reactive App v1

Record each test as PASS/FAIL in a real browser after opening the app.

| ID | Test | Expected result | Status |
|---|---|---|---|
| T01 | Open index.html | Home screen and demo notice appear | Not run in browser |
| T02 | Start Level 1 | Q1 displayed, progress starts at 1/20 | Not run in browser |
| T03 | Navigate next/previous | Question and saved selection are correct | Not run in browser |
| T04 | Submit with unanswered questions | First missing question is shown; Level 2 stays locked | Not run in browser |
| T05 | Answer all 20 and submit | Results show score and four answer metrics | Not run in browser |
| T06 | Share result | Native share or copy/fallback behavior works | Requires browser capability |
| T07 | Try Level 2 before Level 1 completion | Unlock screen shown; no Level 2 questions shown | Not run in browser |
| T08 | Complete Level 1 then start Level 2 | Q21 displayed; unlock persisted in this browser | Not run in browser |
| T09 | Open ?level=2 in a clean browser | Level 2 remains locked | Not run in browser |
| T10 | Complete Level 2 | Separate results and recommendations displayed | Not run in browser |
| T11 | Review answers | Correct answer and explanation shown per item | Not run in browser |
| T12 | Offer links | Each link points to configured supplied Gumroad URL | Link targets statically checked |
| T13 | Missing/malformed question bank | Setup error is displayed | Requires fault-injection test |
