/* Central configuration: edit offers, prices, unlock and referral rules here. */
window.APP_CONFIG = {
  "app": {
    "name": "HESI A2 Assessment Exam Practice",
    "subtitle": "Practice with purpose. Grow together.",
    "version": "1.1.0",
    "demoContentNotice": "Demo questions: these are illustrative practice items, not official HESI questions. Validate or replace them before commercial educational release."
  },
  "levels": {
    "level1": {
      "title": "Level 1 — Free Practice",
      "start": 1,
      "end": 20,
      "access": "free"
    },
    "level2": {
      "title": "Level 2 — Extended Practice",
      "start": 21,
      "end": 40,
      "access": "unlocked-at-70-percent-or-higher-on-level-1"
    }
  },
  "unlock": {
    "rule": "score-at-least-70-percent-on-level-1",
    "minimumPercent": 70,
    "description": "Level 2 unlocks after the user answers all 20 Level 1 questions and scores at least 70%. Below 70%, the results screen prompts a Level 1 retry. Sharing is optional and never treated as verified or mandatory.",
    "persistInLocalStorage": true
  },
  "referral": {
    "enabled": true,
    "parameter": "ref",
    "localTrackingOnly": true,
    "qualification": "not-verified-without-backend",
    "shareChallengeText": "A colleague invited you to try the HESI A2 practice quiz. Can you beat their score?"
  },
  "offers": [
    {
      "id": "reactive-app",
      "name": "HESI A2 Reactive App",
      "price": "See Gumroad page",
      "description": "Access the associated interactive practice app.",
      "url": "https://ebookservice.gumroad.com/l/sfctt",
      "display": true
    },
    {
      "id": "ebook",
      "name": "HESI A2 Study Ebook",
      "price": "See Gumroad page",
      "description": "A digital ebook for additional independent study.",
      "url": "https://ebookservice.gumroad.com/l/hbgshy",
      "display": true
    },
    {
      "id": "ebook-app",
      "name": "Ebook + Application",
      "price": "$14.98",
      "description": "Combine digital reading with interactive practice.",
      "url": "https://ebookservice.gumroad.com/l/qjzys",
      "display": true
    },
    {
      "id": "bundle",
      "name": "NCLEX & Exam Prep Bundle",
      "price": "$89.98",
      "description": "Explore the multi-product NCLEX & Exam Prep bundle. Check the Gumroad page for the exact current contents.",
      "url": "https://ebookservice.gumroad.com/l/fvszkwa",
      "display": true
    }
  ],
  "recommendations": {
    "minimumAnswersForSubjectAdvice": 1,
    "fallback": "Review the subject areas covered in your study materials, then take another practice session."
  },
  "analytics": {
    "enabled": false,
    "note": "No analytics provider is configured. Do not treat local button clicks as verified purchases or qualified referrals."
  }
};
