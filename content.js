// Claude Hebrew RTL Fix - Content Script
// Only targets individual paragraphs/lines inside message bubbles.
// Uses unicode-bidi: plaintext per element — Hebrew lines go RTL,
// English/math lines go LTR, code blocks stay LTR. UI is untouched.

const STYLE_ID = "claude-rtl-style";
const PROCESSED_ATTR = "data-rtl-fixed";

function injectStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    p[${PROCESSED_ATTR}],
    li[${PROCESSED_ATTR}],
    h1[${PROCESSED_ATTR}],
    h2[${PROCESSED_ATTR}],
    h3[${PROCESSED_ATTR}],
    h4[${PROCESSED_ATTR}],
    td[${PROCESSED_ATTR}],
    th[${PROCESSED_ATTR}],
    blockquote[${PROCESSED_ATTR}] {
      direction: rtl !important;
      text-align: right !important;
      unicode-bidi: plaintext !important;
    }

    /* Code blocks always LTR */
    pre[${PROCESSED_ATTR}],
    code[${PROCESSED_ATTR}] {
      direction: ltr !important;
      text-align: left !important;
      unicode-bidi: normal !important;
    }
  `;
  document.head.appendChild(style);
}

function removeStyle() {
  const el = document.getElementById(STYLE_ID);
  if (el) el.remove();
}

const HEBREW_RE = /[\u0590-\u05FF]/;

function applyRTL(enabled) {
  if (enabled) {
    injectStyle();

    const root = document.getElementById("main-content");
    // Only tag leaf text elements (p, li, h1-h4, td, etc.) that:
    // 1. Are inside the message area (root)
    // 2. Contain Hebrew characters
    // This never touches divs, sections, nav, aside, etc. — so no layout shift.
    root.querySelectorAll(
      "p, li, h1, h2, h3, h4, td, th, blockquote, pre, code"
    ).forEach(el => {
      if (HEBREW_RE.test(el.innerText || "")) {
        el.setAttribute(PROCESSED_ATTR, "true");
      }
    });

  } else {
    document.querySelectorAll(`[${PROCESSED_ATTR}]`).forEach(el => {
      el.removeAttribute(PROCESSED_ATTR);
    });
    removeStyle();
  }
}

let observer = null;

function startObserver(enabled) {
  if (observer) observer.disconnect();

  // Throttle observer so it doesn't hammer applyRTL on every keystroke
  let pending = false;
  observer = new MutationObserver(() => {
    if (pending) return;
    pending = true;
    setTimeout(() => {
      applyRTL(enabled);
      pending = false;
    }, 300);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function init(enabled) {
  applyRTL(enabled);
  startObserver(enabled);
}

browser.storage.local.get("rtlEnabled").then((result) => {
  const enabled = result.rtlEnabled !== undefined ? result.rtlEnabled : true;
  init(enabled);
});

browser.runtime.onMessage.addListener((message) => {
  if (message.type === "SET_RTL") {
    if (observer) observer.disconnect();
    init(message.enabled);
  }
});