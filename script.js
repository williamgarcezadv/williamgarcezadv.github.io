(function(){
  const byId = (id)=>document.getElementById(id);
  const menuBtn = byId("menuBtn");
  const mobile = byId("mobileMenu");
  if(menuBtn && mobile){
    menuBtn.addEventListener("click", ()=>{
      const open = mobile.style.display === "block";
      mobile.style.display = open ? "none" : "block";
      menuBtn.setAttribute("aria-expanded", (!open).toString());
    });
  }

  function getQuery(){
    const p = new URLSearchParams(window.location.search);
    const keys = ["utm_source","utm_medium","utm_campaign","utm_content","utm_term"];
    const out = {};
    keys.forEach(k=>{ if(p.get(k)) out[k]=p.get(k); });
    if(p.get("src")) out["src"]=p.get("src");
    return out;
  }

  function encodeMsg(msg){ return encodeURIComponent(msg); }

  document.querySelectorAll("[data-wa]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const tag = btn.getAttribute("data-wa-tag");
      const msg = btn.getAttribute("data-wa-message");
      const q = getQuery();
      const parts = [];
      if(tag) parts.push(tag);
      if(msg) parts.push(msg);
      const qs = Object.keys(q).length ? ("\n\nOrigem: " + JSON.stringify(q)) : "";
      const finalMsg = (parts.join(" — ") || "Olá, gostaria de atendimento.") + qs;
      const url = `https://wa.me/${btn.getAttribute("data-wa")}?text=${encodeMsg(finalMsg)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    });
  });

  const form = document.querySelector("[data-wa-form]");
  if(form){
    form.addEventListener("submit", (e)=>{
      e.preventDefault();
      const name = form.querySelector("[name=name]")?.value?.trim() || "";
      const city = form.querySelector("[name=city]")?.value?.trim() || "";
      const topic = form.querySelector("[name=topic]")?.value?.trim() || "";
      const details = form.querySelector("[name=details]")?.value?.trim() || "";
      const q = getQuery();
      const msg = [
        topic ? (topic.toUpperCase() + " — ") : "",
        "Quero orientação inicial.",
        name ? ("\nNome: " + name) : "",
        city ? ("\nCidade: " + city) : "",
        details ? ("\nResumo: " + details) : "",
        Object.keys(q).length ? ("\n\nOrigem: " + JSON.stringify(q)) : ""
      ].join("");
      const wa = form.getAttribute("data-wa-form");
      const url = `https://wa.me/${wa}?text=${encodeMsg(msg)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }
})();
