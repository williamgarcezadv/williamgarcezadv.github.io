(function(){
  const KEY = "wvg_cookie_prefs_v1";

  // ====== CONFIGURE AQUI ======
  const GA_MEASUREMENT_ID = "G-XXXXXXXXXX";          // <-- troque pelo seu GA4
  const META_PIXEL_ID     = "123456789012345";      // <-- troque pelo seu Pixel
  // ============================

  const defaultPrefs = { essential:true, analytics:false, marketing:false, ts:null };

  function readPrefs(){
    try{
      const raw = localStorage.getItem(KEY);
      if(!raw) return null;
      const obj = JSON.parse(raw);
      if(typeof obj !== "object" || obj === null) return null;
      obj.essential = true;
      obj.analytics = !!obj.analytics;
      obj.marketing = !!obj.marketing;
      return obj;
    }catch(e){ return null; }
  }

  function savePrefs(p){
    const prefs = {
      essential: true,
      analytics: !!p.analytics,
      marketing: !!p.marketing,
      ts: new Date().toISOString()
    };
    localStorage.setItem(KEY, JSON.stringify(prefs));
    return prefs;
  }

  function setGlobal(prefs){ window.__cookiePrefs = prefs; }

  function emit(prefs){
    try{ window.dispatchEvent(new CustomEvent("cookie:consent", { detail: prefs })); }
    catch(e){}
  }

  function qs(sel, root=document){ return root.querySelector(sel); }
  function qsa(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

  // ====== INJEÇÃO SEGURA (SÓ UMA VEZ) ======
  let gaLoaded = false;
  let pixelLoaded = false;

  function loadGA(){
    if(gaLoaded) return;
    if(!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === "G-XXXXXXXXXX") return;

    gaLoaded = true;

    window.dataLayer = window.dataLayer || [];
    function gtag(){ window.dataLayer.push(arguments); }
    window.gtag = window.gtag || gtag;

    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_MEASUREMENT_ID);
    document.head.appendChild(s);

    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
  }

  function loadMetaPixel(){
    if(pixelLoaded) return;
    if(!META_PIXEL_ID || META_PIXEL_ID === "123456789012345") return;

    pixelLoaded = true;

    !(function(f,b,e,v,n,t,s){
      if(f.fbq) return; n=f.fbq=function(){ n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments) };
      if(!f._fbq) f._fbq=n; n.push=n; n.loaded=!0; n.version="2.0";
      n.queue=[]; t=b.createElement(e); t.async=!0; t.src=v;
      s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s)
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

    window.fbq("init", META_PIXEL_ID);
    window.fbq("track", "PageView");
  }

  function applyConsent(prefs){
    if(prefs.analytics) loadGA();
    if(prefs.marketing) loadMetaPixel();
  }

  // ====== UI ======
  const banner  = qs("#ckBanner");
  const modal   = qs("#ckModal");
  const overlay = qs("#ckOverlay");

  const btnAcceptAllBanner = qs("#ckAcceptAllBanner");
  const btnRejectAllBanner = qs("#ckRejectAllBanner");
  const btnManage          = qs("#ckManage");
  const btnSave            = qs("#ckSave");
  const btnClose           = qs("#ckClose");
  const btnAcceptAllModal  = qs("#ckAcceptAllModal");
  const btnRejectAllModal  = qs("#ckRejectAllModal");

  const chkAnalytics = qs("#ckAnalytics");
  const chkMarketing = qs("#ckMarketing");

  function openModal(){
    if(!modal || !overlay) return;
    const prefs = readPrefs() || defaultPrefs;
    if(chkAnalytics) chkAnalytics.checked = !!prefs.analytics;
    if(chkMarketing) chkMarketing.checked = !!prefs.marketing;

    overlay.classList.remove("ck-hidden");
    modal.classList.remove("ck-hidden");
  }

  function closeModal(){
    if(!modal || !overlay) return;
    overlay.classList.add("ck-hidden");
    modal.classList.add("ck-hidden");
  }

  function hideBanner(){ if(banner) banner.classList.add("ck-hidden"); }
  function showBanner(){ if(banner) banner.classList.remove("ck-hidden"); }

  // ====== INIT ======
  const existing = readPrefs();
  if(existing){
    setGlobal(existing);
    applyConsent(existing);
    emit(existing);
    hideBanner();
  }else{
    setGlobal(defaultPrefs);
    showBanner();
  }

  // ====== BANNER EVENTS ======
  if(btnAcceptAllBanner){
    btnAcceptAllBanner.addEventListener("click", ()=>{
      const prefs = savePrefs({analytics:true, marketing:true});
      setGlobal(prefs);
      applyConsent(prefs);
      emit(prefs);
      hideBanner();
      closeModal();
    });
  }

  if(btnRejectAllBanner){
    btnRejectAllBanner.addEventListener("click", ()=>{
      const prefs = savePrefs({analytics:false, marketing:false});
      setGlobal(prefs);
      applyConsent(prefs);
      emit(prefs);
      hideBanner();
      closeModal();
    });
  }

  if(btnManage){
    btnManage.addEventListener("click", (e)=>{
      e.preventDefault();
      openModal();
    });
  }

  // ====== MODAL EVENTS ======
  if(btnSave){
    btnSave.addEventListener("click", ()=>{
      const prefs = savePrefs({
        analytics: chkAnalytics ? chkAnalytics.checked : false,
        marketing: chkMarketing ? chkMarketing.checked : false
      });
      setGlobal(prefs);
      applyConsent(prefs);
      emit(prefs);
      hideBanner();
      closeModal();
    });
  }

  if(btnAcceptAllModal){
    btnAcceptAllModal.addEventListener("click", ()=>{
      const prefs = savePrefs({analytics:true, marketing:true});
      setGlobal(prefs);
      applyConsent(prefs);
      emit(prefs);
      hideBanner();
      closeModal();
    });
  }

  if(btnRejectAllModal){
    btnRejectAllModal.addEventListener("click", ()=>{
      const prefs = savePrefs({analytics:false, marketing:false});
      setGlobal(prefs);
      applyConsent(prefs);
      emit(prefs);
      hideBanner();
      closeModal();
    });
  }

  if(btnClose) btnClose.addEventListener("click", closeModal);
  if(overlay) overlay.addEventListener("click", closeModal);

  // Links "Configurações de cookies"
  qsa("[data-open-cookies]").forEach(a=>{
    a.addEventListener("click", (e)=>{
      e.preventDefault();
      openModal();
    });
  });

})();