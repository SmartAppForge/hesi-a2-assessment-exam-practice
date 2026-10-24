(() => {
  "use strict";
  const CONFIG = window.APP_CONFIG;
  const BANK = window.QUESTION_BANK;
  const STORAGE = { unlocked: "hesiA2Level2Unlocked", answers1: "hesiA2Answers1", answers2: "hesiA2Answers2", referral: "hesiA2ReferralId", referredBy: "hesiA2ReferredBy" };
  const app = document.getElementById("app");
  const toast = document.getElementById("toast");
  let screen = "home";
  let activeLevel = 1;
  let currentIndex = 0;
  let answers = {1:{},2:{}};
  let lastResults = {1:null,2:null};
  let reviewReturn = "results1";
  const params = new URLSearchParams(location.search);
  const isUnlocked = () => localStorage.getItem(STORAGE.unlocked) === "true";
  const qs = (level) => BANK.filter(q => q.level === level);
  const esc = (s) => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const safeUrl = (url) => { try { const u = new URL(url); return ["https:","http:"].includes(u.protocol) ? u.href : "#"; } catch { return "#"; } };
  function notify(message) {
    toast.textContent = message; toast.classList.add("show");
    clearTimeout(notify.timer); notify.timer = setTimeout(() => toast.classList.remove("show"), 2600);
  }
  function ensureReferral() {
    let id = localStorage.getItem(STORAGE.referral);
    if (!id) { id = "study-" + Math.random().toString(36).slice(2, 9); localStorage.setItem(STORAGE.referral,id); }
    return id;
  }
  function captureReferral() {
    const ref = params.get(CONFIG.referral.parameter);
    if (ref && ref !== ensureReferral()) localStorage.setItem(STORAGE.referredBy, ref.slice(0,100));
  }
  function referralUrl() {
    const u = new URL(location.href); u.searchParams.set(CONFIG.referral.parameter, ensureReferral()); u.hash = "";
    return u.href;
  }
  function shareText(level, result) {
    const title = level === 1 ? "HESI A2 Level 1 practice" : "HESI A2 Level 2 practice";
    return `I completed the ${title} and scored ${result.correct}/${result.total} (${result.percent}%). Learning is better when we grow together. Try the free practice quiz and share your result with a colleague: ${referralUrl()} #HESIA2 #StudyTogether`;
  }
  async function shareResult(level) {
    const result = lastResults[level];
    if (!result) return notify("Complete the practice quiz first to share a result.");
    const text = shareText(level,result);
    if (navigator.share) {
      try { await navigator.share({title:"HESI A2 practice result", text, url:referralUrl()}); notify("Thanks for spreading a positive learning challenge."); return; }
      catch (e) { if (e && e.name === "AbortError") return; }
    }
    try {
      await navigator.clipboard.writeText(text);
      notify("Share message copied. Paste it into your group or message.");
    } catch {
      renderShareFallback(text, level);
    }
  }
  function renderShareFallback(text, level) {
    const el = document.getElementById("share-fallback");
    if (el) { el.hidden = false; el.value = text; el.focus(); el.select(); }
    notify("Select and copy the share message below.");
  }
  function resultFor(level) {
    const list = qs(level), selected = answers[level] || {};
    let correct = 0, answered = 0;
    list.forEach(q => { if (selected[q.id]) { answered++; if (selected[q.id] === q.answer) correct++; } });
    const total = list.length;
    return {level,total,answered,correct,incorrect:answered-correct,unanswered:total-answered,percent:Math.round(correct/total*100)};
  }
  function storeAnswers(level) { localStorage.setItem(level===1?STORAGE.answers1:STORAGE.answers2,JSON.stringify(answers[level])); }
  function loadAnswers() {
    for (const level of [1,2]) {
      try { answers[level] = JSON.parse(localStorage.getItem(level===1?STORAGE.answers1:STORAGE.answers2) || "{}") || {}; }
      catch { answers[level] = {}; }
    }
  }
  function button(label, action, cls="primary", extra="") { return `<button type="button" class="${cls}" data-action="${action}" ${extra}>${label}</button>`; }
  function home() {
    screen = "home";
    app.innerHTML = `
      <section class="hero-card">
        <p class="eyebrow">PRACTICE WITH PURPOSE</p><h1>Build confidence, one question at a time.</h1>
        <p class="lead">Take a focused practice quiz, review your results, and invite a colleague to learn alongside you.</p>
        <div class="hero-stats"><div><strong>40</strong><span>demo questions</span></div><div><strong>2</strong><span>practice levels</span></div><div><strong>Free</strong><span>Level 1 access</span></div></div>
        <div class="notice"><strong>Demo content notice:</strong> These illustrative questions are not official HESI exam questions. Validate or replace them before commercial educational release.</div>
        ${button('Start free Level 1 <span aria-hidden="true">→</span>',"start-level1","primary full")}
        <p class="microcopy">20 questions · Four answer choices · Results and review</p>
        <p id="entry-note" class="inline-note" ${params.get("level")==="2"&&!isUnlocked()?"":"hidden"}>Level 2 is locked. Complete Level 1 first to unlock the extended practice set.</p>
        <div class="divider"></div>
        <div class="two-cards">
          <article class="info-card"><span class="step">01</span><h2>Level 1 — Start here</h2><p>Answer 20 questions and get a clear snapshot of your practice performance.</p><span class="tag">Free access</span></article>
          <article class="info-card"><span class="step">02</span><h2>Level 2 — Keep going</h2><p>Complete Level 1 to unlock 20 additional demonstration questions and subject-focused recommendations.</p><span class="tag tag-muted">${isUnlocked()?"Unlocked on this browser":"Unlock after Level 1"}</span><div class="button-row">${button(isUnlocked()?"Continue to Level 2":"How to unlock Level 2",isUnlocked()?"start-level2":"show-unlock","ghost")}</div></article>
        </div>
      </section>
      <footer class="footer">Independent educational resource. Not affiliated with or endorsed by Elsevier or HESI. No exam result is guaranteed.</footer>`;
  }
  function startQuiz(level) {
    if (level === 2 && !isUnlocked()) { showUnlock(); return; }
    activeLevel=level; currentIndex=0; screen="quiz"; renderQuestion();
  }
  function renderQuestion() {
    const list=qs(activeLevel), q=list[currentIndex];
    if (!q) { notify("Question set is unavailable. Check the question configuration."); home(); return; }
    const selected=answers[activeLevel][q.id]||"";
    const start=activeLevel===1?1:21, end=activeLevel===1?20:40, number=start+currentIndex;
    app.innerHTML=`<section class="content-card">
      <div class="screen-top"><span class="screen-kicker">${activeLevel===1?"Level 1 · Free practice":"Level 2 · Extended practice"}</span><span class="progress-label">Question ${currentIndex+1} of 20</span></div>
      <div class="progress" aria-label="Quiz progress"><span style="width:${(currentIndex+1)/list.length*100}%"></span></div>
      <p class="question-number">QUESTION Q${number} · ${esc(q.subject)}</p>
      <h1 class="question-title">${esc(q.question)}</h1>
      <div class="answers" role="group" aria-label="Answer choices">
        ${Object.entries(q.options).map(([letter,value])=>`<button type="button" class="answer-option ${selected===letter?"selected":""}" data-action="select-answer" data-answer="${letter}" aria-pressed="${selected===letter}"><span class="option-letter">${letter}</span><span>${esc(value)}</span></button>`).join("")}
      </div>
      <div class="quiz-nav">${button("← Previous","previous","ghost",currentIndex===0?"disabled":"")}${currentIndex<list.length-1?button("Next question →","next","primary"):button("Submit Level "+activeLevel,"submit-level","primary")}</div>
      <p class="microcopy">${Object.keys(answers[activeLevel]).filter(id=>list.some(q=>q.id===id)).length} of 20 answered · Your selections stay in this browser during this session.</p>
      <p class="small-muted">Practice content is illustrative and not an official HESI assessment.</p>
    </section>`;
  }
  function showUnlock() {
    screen="unlock";
    app.innerHTML=`<section class="content-card">
      <p class="eyebrow">LEVEL 2 ACCESS</p><h1>You've taken the first step. Keep the momentum going.</h1>
      <p class="lead">Level 2 adds 20 more demonstration questions. In this first version, access is unlocked after submitting Level 1. Sharing your result is optional — we encourage it because a supportive study community helps everyone keep learning.</p>
      <div class="notice"><strong>Access rule:</strong> Complete and submit all 20 Level 1 questions. No share-click is treated as proof of an invitation or referral.</div>
      ${button(isUnlocked()?"Start Level 2 →":"Start Level 1 to unlock","start-level1","primary full")}
      <div class="button-row">${button("Back to home","home","ghost")}</div>
    </section>`;
  }
  function submitLevel() {
    const list=qs(activeLevel), missing=list.filter(q=>!answers[activeLevel][q.id]);
    if (missing.length) {
      currentIndex=list.findIndex(q=>!answers[activeLevel][q.id]);
      renderQuestion();
      notify(`Please answer all questions. ${missing.length} remaining.`);
      return;
    }
    const result=resultFor(activeLevel); lastResults[activeLevel]=result;
    if (activeLevel===1) {
      localStorage.setItem(STORAGE.unlocked,"true");
      storeAnswers(1);
      renderResults(1);
    } else {
      storeAnswers(2);
      renderResults(2);
    }
  }
  function encouragement(p) {
    if(p>=85) return "Excellent effort! Keep strengthening your knowledge and share your study strategy with a colleague.";
    if(p>=65) return "Good progress. Review the questions you missed and build on what you already know.";
    if(p>=40) return "Every attempt gives you useful information. Review the explanations, revisit your study guide, and try again.";
    return "This is a starting point, not a verdict. Use the results to choose what to review next, then keep practicing.";
  }
  function subjectStats(level) {
    const by={};
    qs(level).forEach(q=>{if(!by[q.subject])by[q.subject]={n:0,c:0};by[q.subject].n++;if(answers[level][q.id]===q.answer)by[q.subject].c++;});
    return Object.entries(by).map(([name,v])=>({name,correct:v.c,total:v.n,pct:Math.round(v.c/v.n*100)})).sort((a,b)=>a.pct-b.pct);
  }
  function reviewMarkup(level) {
    return qs(level).map((q,i)=>{
      const given=answers[level][q.id], ok=given===q.answer;
      return `<article class="answer-review"><h3>Q${q.number}. ${esc(q.question)}</h3><p class="${ok?"correct-text":given?"wrong-text":"small-muted"}">${given?(ok?"Correct":"Your answer: "+given+" — Correct answer: "+q.answer):"Not answered — Correct answer: "+q.answer}</p><p><strong>Correct answer:</strong> ${q.answer}. ${esc(q.options[q.answer])}</p><p class="small-muted">${esc(q.explanation)}</p></article>`;
    }).join("");
  }
  function renderResults(level) {
    screen=level===1?"results1":"results2";
    const r=lastResults[level]||resultFor(level);
    const stats=subjectStats(level);
    const recommendation=stats.length?`Consider reviewing <strong>${esc(stats[0].name)}</strong> first (${stats[0].pct}% on this small practice set), then revisit your trusted study guide and try another session.`:CONFIG.recommendations.fallback;
    const next=level===1
      ? `<section class="copy-panel"><h2 class="section-title">Ready for the next challenge?</h2><p>You've completed the first 20 questions — that's progress worth celebrating. Level 2 is now unlocked on this browser. Continue learning, and invite a classmate to take the same quiz so you can encourage one another.</p>${button("Unlock confirmed — continue to Level 2 →","start-level2","primary full")}</section>`
      : `<section class="copy-panel"><h2 class="section-title">Keep your learning moving</h2><p>Your result is one data point, not a definition of your ability. Use it to choose a topic to review, practice again, and support a colleague who's preparing too.</p>${button("Explore study resources ↓","show-offers","primary full")}</section>`;
    app.innerHTML=`<section class="content-card">
      <p class="eyebrow">${level===1?"LEVEL 1 COMPLETE":"LEVEL 2 COMPLETE"}</p><h1>${level===1?"You showed up. That matters.":"You've kept going — celebrate that progress."}</h1>
      <p class="lead">${esc(encouragement(r.percent))}</p>
      <div class="result-score"><div class="score-ring" style="--score:${r.percent}%"><strong>${r.percent}%</strong></div><div><h2>${r.correct} out of ${r.total} correct</h2><p>${level===1?"Your Level 1 practice result":"Your Level 2 practice result"} · Demo questions only</p></div></div>
      <div class="metrics"><div class="metric"><strong>${r.correct}</strong><span>Correct</span></div><div class="metric"><strong>${r.incorrect}</strong><span>Incorrect</span></div><div class="metric"><strong>${r.answered}</strong><span>Answered</span></div><div class="metric"><strong>${r.unanswered}</strong><span>Unanswered</span></div></div>
      <section><h2 class="section-title">Turn your result into a positive challenge</h2><div class="copy-panel"><p><strong>Learning is better when we grow together.</strong> Share your result with a classmate or colleague and invite them to try the free practice quiz. Celebrate effort, exchange study tips, and help each other identify what to review next — no competition required.</p>
      <div class="button-row">${button("Share my result ↗","share-result","primary")}${button("Copy challenge message","share-result","ghost")}</div>
      <textarea id="share-fallback" class="share-fallback" rows="4" hidden aria-label="Share message to copy"></textarea>
      <p class="small-muted">Sharing is voluntary. This static version records referral information only in the browser; it cannot verify completed referrals.</p></div></section>
      <section><h2 class="section-title">Your next best study step</h2><p>${recommendation}</p><div class="subject-list">${stats.map(s=>`<div class="subject-row"><span>${esc(s.name)}</span><div class="subject-track"><span style="width:${s.pct}%"></span></div><strong>${s.pct}%</strong></div>`).join("")}</div></section>
      ${next}
      <div class="button-row">${button("Review answers","review-answers","ghost")}${button("Try this level again","retry-level","ghost")}${button("Home","home","ghost")}</div>
      ${level===2?offersMarkup(): ""}
      <p class="footer">Practice score only. This result does not predict or guarantee performance on an official exam.</p>
    </section>`;
  }
  function offersMarkup() {
    const offers=CONFIG.offers.filter(o=>o.display);
    return `<section id="offers"><h2 class="section-title">A practical next step for your study routine</h2><p class="lead">Use this free practice session to identify what to review. When you are ready, explore these digital study resources and check each product page for its current details.</p>
      <div class="offer-grid">${offers.map(o=>`<article class="offer-card ${o.id==="ebook-app"?"featured":""}"><span class="tag">${o.id==="ebook-app"?"Recommended combo":o.id==="bundle"?"Multi-product bundle":"Study resource"}</span><h3>${esc(o.name)}</h3><div class="price">${esc(o.price)}</div><p>${esc(o.description)}</p><a class="${o.id==="ebook-app"?"primary":"ghost"}" href="${esc(safeUrl(o.url))}" target="_blank" rel="noopener noreferrer">View on Gumroad →</a></article>`).join("")}</div>
      <p class="small-muted">Prices and contents should be checked on Gumroad before purchase. No discount or savings claim is made here.</p>
    </section>`;
  }
  function showOffers() {
    const node=document.getElementById("offers");
    if(node){node.scrollIntoView({behavior:"smooth",block:"start"});return;}
    app.insertAdjacentHTML("beforeend",`<section id="offers" class="content-card">${offersMarkup()}</section>`);
    document.getElementById("offers").scrollIntoView({behavior:"smooth",block:"start"});
  }
  function showReview() {
    const level=activeLevel;
    reviewReturn=level===1?"results1":"results2";
    screen="review";
    app.innerHTML=`<section class="content-card"><p class="eyebrow">ANSWER REVIEW</p><h1>Learn from every question.</h1><p class="lead">Review the correct answers and explanations. Focus on understanding the idea, not memorizing a letter.</p>${reviewMarkup(level)}<div class="button-row">${button("Back to results","back-results","primary")}${button("Try this level again","retry-level","ghost")}</div></section>`;
  }
  function retryLevel() {
    answers[activeLevel]={}; storeAnswers(activeLevel); lastResults[activeLevel]=null; currentIndex=0; startQuiz(activeLevel);
  }
  function onAction(e) {
    const btn=e.target.closest("[data-action]"); if(!btn)return;
    const action=btn.dataset.action;
    switch(action) {
      case "start-level1": startQuiz(1); break;
      case "start-level2": startQuiz(2); break;
      case "show-unlock": showUnlock(); break;
      case "home": home(); break;
      case "select-answer": {
        if(screen!=="quiz")return;
        const q=qs(activeLevel)[currentIndex]; answers[activeLevel][q.id]=btn.dataset.answer; storeAnswers(activeLevel); renderQuestion(); break;
      }
      case "previous": if(currentIndex>0){currentIndex--;renderQuestion();} break;
      case "next": if(currentIndex<qs(activeLevel).length-1){currentIndex++;renderQuestion();} break;
      case "submit-level": submitLevel(); break;
      case "share-result": shareResult(activeLevel); break;
      case "review-answers": showReview(); break;
      case "back-results": renderResults(activeLevel); break;
      case "retry-level": retryLevel(); break;
      case "show-offers": showOffers(); break;
    }
  }
  app.addEventListener("click",onAction);
  window.addEventListener("error",()=>notify("Something went wrong. Refresh the page and try again."));
  window.addEventListener("unhandledrejection",()=>notify("An operation could not be completed. Please try again."));
  function validateSetup() {
    if (!CONFIG || !Array.isArray(BANK) || BANK.length!==40) {
      app.innerHTML='<section class="content-card"><h1>Setup issue</h1><p>The question bank or configuration is missing or incomplete. Check that config.js, questions.js, and app.js are all uploaded.</p></section>'; return false;
    }
    const ids=new Set(BANK.map(q=>q.id));
    if(ids.size!==40 || qs(1).length!==20 || qs(2).length!==20 || BANK.some(q=>!q.question||!q.options||!q.answer||!q.options[q.answer])) {
      app.innerHTML='<section class="content-card"><h1>Question data issue</h1><p>The configured question bank failed a basic integrity check. Review question IDs, levels, options, and answer keys.</p></section>'; return false;
    }
    return true;
  }
  captureReferral(); loadAnswers(); ensureReferral();
  if(validateSetup()) home();
})();