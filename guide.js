"use strict";
(() => {
  // src/guide.ts
  var isMac = /Mac|iPhone|iPad/.test(navigator.userAgent);
  var KEYS = isMac ? { toggle: "\u2325\u21E7P", undo: "\u2318Z" } : { toggle: "Alt+Shift+P", undo: "Ctrl+Z" };
  for (const kbd of document.querySelectorAll("kbd[data-key]")) {
    kbd.textContent = KEYS[kbd.dataset.key] ?? kbd.textContent;
  }
  var guide = document.getElementById("guide");
  var removed = (el) => !!el?.closest("[data-pe-removed]");
  var checks = {
    open: () => document.documentElement.hasAttribute("data-pe-editing"),
    ads: () => [...document.querySelectorAll(".ad")].every(removed),
    // Removing the box or anything inside it counts.
    news: () => {
      const box = document.querySelector(".news");
      return removed(box) || !!box?.querySelector("[data-pe-removed]");
    },
    print: () => printed
  };
  var printed = false;
  function update() {
    if (!guide) return;
    const steps = [...guide.querySelectorAll("li[data-step]")];
    let current = false;
    for (const li of steps) {
      const done = checks[li.dataset.step]?.() ?? false;
      li.classList.toggle("done", done);
      li.classList.toggle("now", !done && !current);
      if (!done) current = true;
    }
    guide.classList.toggle("complete", !current);
  }
  new MutationObserver(update).observe(document.documentElement, {
    attributes: true,
    subtree: true,
    attributeFilter: ["data-pe-removed", "data-pe-editing"]
  });
  window.addEventListener("beforeprint", () => {
    printed = true;
    update();
  });
  update();
})();
