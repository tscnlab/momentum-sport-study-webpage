"use strict";
(() => {
  const el = (id) => document.getElementById(id);
  const language = el("language"), session = el("session");
  const records = Array.from(document.querySelectorAll("#study-data span"), (node) => node.dataset);
  function update() {
    el("status").textContent = "";
    el("result").hidden = true;
    el("qr").hidden = true;
    el("qr-missing").hidden = false;
    el("qr-image").removeAttribute("src");
    el("study-id").value = "";
    const ready = language.value && session.value;
    el("hint").hidden = Boolean(ready);
    if (!ready) return;
    const study = records.find((item) => item.language === language.value && item.session === session.value);
    if (!study || !study.id.trim()) {
      el("status").textContent = "Study unavailable / Studie nicht verfügbar.";
      return;
    }
    el("result").hidden = false;
    el("study-id").value = study.id;
    const placeholder = study.placeholder !== "false" || study.id.startsWith("REPLACE_");
    el("placeholder").hidden = !placeholder;
    el("qr-missing").hidden = false;
    if (!placeholder && study.qr) {
      el("qr-image").src = study.qr;
      el("qr").hidden = false;
      el("qr-missing").hidden = true;
    }
  }
  el("qr-image").addEventListener("error", () => {
    el("qr").hidden = true;
    el("qr-missing").hidden = false;
  });
  language.addEventListener("change", update);
  session.addEventListener("change", update);
  el("copy").addEventListener("click", async () => {
    const value = el("study-id").value;
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      el("status").textContent = "Copied / Kopiert.";
    } catch {
      el("study-id").focus();
      el("study-id").select();
      el("status").textContent = "Select and copy the ID manually. / ID bitte manuell kopieren.";
    }
  });
  update();
})();
