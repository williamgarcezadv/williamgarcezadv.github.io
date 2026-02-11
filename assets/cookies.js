(() => {
  "use strict";

  const KEY = "wvg_cookie_consent_v1";

  const $ = (sel) => document.querySelector(sel);

  const read = () => {
    try { return JSON.parse(localStorage.getItem(KEY) || ""); } catch { return null; }
  };

  const save = (v) => {
    try { localStorage.setItem(KEY, JSON.stringify(v)); } catch {}
  };

  const hasConsent = () => !!read();

  const apply = (prefs) => {
    // Aqui você liga/desliga scripts conforme as preferências.
    // Ex.: Analytics só se prefs.analytics === true
    // Por enquanto, apenas salva.
    save({
      ts: new Date().toISOString(),
      necessary: true,
      analytics: !!prefs.analytics,
      marketing: !!prefs.marketing,
    });
  };

  const show = (sel, on) => {
    const el = $(sel);
    if (!el) return;
    el.classList.toggle("ck-hidden", !on);
  };

  const init = () => {
    // Se já tem consentimento, não mostra nada.
    if (hasConsent()) return;

    show("#ckBanner", true);

    // Botões do banner
    $("#ckAcceptAll")?.addEventListener("click", () => {
      apply({ analytics: true, marketing: true });
      show("#ckBanner", false);
    });

    $("#ckReject")?.addEventListener("click", () => {
      apply({ analytics: false, marketing: false });
      show("#ckBanner", false);
    });

    $("#ckOpen")?.addEventListener("click", () => {
      show("#ckOverlay", true);
      show("#ckModal", true);
    });

    // Modal
    const closeModal = () => {
      show("#ckOverlay", false);
      show("#ckModal", false);
    };

    $("#ckOverlay")?.addEventListener("click", closeModal);
    $("#ckClose")?.addEventListener("click", closeModal);

    $("#ckSave")?.addEventListener("click", () => {
      const analytics = !!$("#ckAnalytics")?.checked;
      const marketing = !!$("#ckMarketing")?.checked;
      apply({ analytics, marketing });
      show("#ckBanner", false);
      closeModal();
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
