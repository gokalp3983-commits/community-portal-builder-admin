(()=>{
  if("scrollRestoration" in history){
    history.scrollRestoration="manual";
  }
  const scrollToTop=()=>window.scrollTo(0,0);
  scrollToTop();
  window.addEventListener("pageshow",()=>{
    scrollToTop();
    requestAnimationFrame(scrollToTop);
  },{once:true});
  window.addEventListener("load",()=>{
    scrollToTop();
    requestAnimationFrame(scrollToTop);
  },{once:true});
})();

(()=>{
  const body=document.body;
  if(!body)return;
  let mode="guided";
  try{
    mode=localStorage.getItem("ctb.ux-mode.v1")==="advanced"?"advanced":"guided";
  }catch(_err){
    mode="guided";
  }
  body.classList.toggle("advanced-mode",mode==="advanced");
  body.classList.toggle("guided-mode",mode!=="advanced");
})();

// Chapter 22C: isolated CPB header animation controller.
// Keep this in the early boot file so unrelated builder/runtime errors cannot disable the motto.
(()=>{
  const start=()=>{
    const motto=document.querySelector(".cpb-motto");
    if(!motto)return;
    const reduced=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(reduced)return;

    motto.classList.add("cpb-motto-animate");
    const replay=()=>{
      motto.classList.remove("cpb-motto-run");
      // Force a style flush so every letter animation and the light beam restart cleanly.
      void motto.offsetWidth;
      motto.classList.add("cpb-motto-run");
    };
    replay();
    window.setInterval(replay,10000);
  };

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();
})();

