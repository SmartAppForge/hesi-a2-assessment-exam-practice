# Manual QA checklist — HESI A2 Assessment Exam Practice v1.1.0

Record each test as PASS/FAIL in a real browser after opening the app. Automated source and data checks are summarized in `TEST-RESULTS.md`; these browser tests have not yet been performed in this environment.

| ID | Test | Expected result | Status |
|---|---|---|---|
| T01 | Open `index.html` | Home screen and demo notice appear; no commercial offer cards on Home | Not run in browser |
| T02 | Start Level 1 | Q1 displayed, progress starts at 1/20; no offers during quiz | Not run in browser |
| T03 | Navigate next/previous | Question and saved selection are correct | Not run in browser |
| T04 | Submit with unanswered questions | First missing question is shown; Level 2 stays locked | Not run in browser |
| T05 | Complete Level 1 with 14/20 correct (70%) | Results show score; Level 2 unlocks; button says `Start Level 2 →` | Not run in browser |
| T06 | Complete Level 1 with 13/20 correct (65%) | Results explain the 70% threshold; button says `Retry Level 1 ↻`; Level 2 stays locked | Not run in browser |
| T07 | Click retry after a score below 70% | Level 1 restarts and answers can be submitted again | Not run in browser |
| T08 | After passing Level 1, start Level 2 | Q21 displayed; unlock persists in this browser | Not run in browser |
| T09 | Open `?level=2` in a clean browser | Level 2 remains locked until Level 1 threshold is met | Not run in browser |
| T10 | Complete Level 2 | Separate results and recommendations displayed | Not run in browser |
| T11 | Check results page | Colorful promo banner and four offer cards appear after results | Not run in browser |
| T12 | Check four cards | Practice App blue; Ebook green; Ebook + App Bundle orange ($14.98); NCLEX & Exam Prep Bundle purple ($89.98); arrows visible | Not run in browser |
| T13 | Test phone/tablet/desktop widths | Cards remain readable and adapt to screen size | Not run in browser |
| T14 | Share result | Native share or copy/fallback behavior works | Requires browser capability |
| T15 | Review answers | Correct answer and explanation shown per item | Not run in browser |
| T16 | Check offer destinations | Each card opens its configured Gumroad URL | Config URLs statically checked; click test not run |
| T17 | Missing/malformed question bank | Setup error is displayed | Requires fault-injection test |
