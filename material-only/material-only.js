/*
 * 家 ^ ^ — material-only experiment on the ORIGINAL frozen V1 DOM.
 * No page, copy, typography, spacing, route, dock or component markup is rebuilt.
 * Public mirror is already sanitized: mock Memory and ephemeral data only.
 */
(function(){
  "use strict";
  const root=document.documentElement,scene=document.getElementById("app");
  const wallpaper=scene?.querySelector(".wallpaper");
  const kitAPI=window.GlassMaterialKit;
  if(!scene||!wallpaper||!kitAPI||kitAPI.version!=="0.5.0")return;
  let kit=null,sourceVersion=0,lastSourceKey="",pendingTargets=false,pendingWallpaper=false;
  const status={mode:"initializing",AA:"",last:""};
  const activeSelectors=[
    ".bubble",              // original Chat bubble dimensions/positions unchanged
    ".composer",            // original input pill
    ".dock",                // original five-tab Dock
    ".home-continue",       // if legacy UI renders this element
    ".room-note",           // original Room/Letters note surfaces
    ".room-call a"          // original call-return glass button
  ];
  const selector=activeSelectors.join(",");
  const info=document.createElement("div");
  info.id="glassDebugReadout";
  info.setAttribute("aria-live","polite");
  info.hidden=!new URLSearchParams(location.search).has("glassDebug");
  if(!info.hidden){
    info.innerHTML='<strong>V1 original layout · Glass 0.5</strong><span id="glassInfo">初始化中</span>';
    document.body.append(info);
  }
  const currentDebug=()=>kit?kit.getState():null;
  function diagnostics(){
    if(info.hidden)return;
    const st=currentDebug();
    const latest=kit?.getDiagnostics();
    const node=document.getElementById("glassInfo");
    if(node)node.textContent=(st?.state==="gpu"?"GPU · "+st.aaMode:"CSS original · "+(status.last||"fallback"))+
      " · surfaces "+(latest?.currentTargets??0)+
      " · draw "+(latest?.lastDrawn??0)+" / culled "+(latest?.lastCulled??0);
  }
  function markTargets(){
    pendingTargets=false;
    let count=0;
    for(const el of scene.querySelectorAll(selector)){
      if(el.dataset.glass!==undefined)continue;
      el.setAttribute("data-glass","");
      const isBubble=el.classList.contains("bubble");
      el.setAttribute("data-glass-profile",isBubble?"compact":el.classList.contains("room-note")?"panel":"control");
      count++;
    }
    if(count)kit?.refresh();
    diagnostics();
  }
  function scheduleTargets(){
    if(pendingTargets)return;
    pendingTargets=true;
    requestAnimationFrame(markTargets);
  }
  function makeCanvas(){
    // Same native wallpaper CSS stops, sampled in viewport coordinates.
    // The visible wallpaper/veil/light nodes remain 100% V1. This texture is
    // only the source for optical distortion inside marked glass surfaces.
    const w=Math.max(1,innerWidth),h=Math.max(1,innerHeight);
    const dpr=Math.min(1.5,Number(devicePixelRatio)||1);
    const c=document.createElement("canvas");
    c.width=Math.round(w*dpr);c.height=Math.round(h*dpr);
    const ctx=c.getContext("2d");
    const paper=getComputedStyle(wallpaper).backgroundImage;
    const points=[...paper.matchAll(/(#[0-9a-f]{6})\s+([0-9]+)%/gi)];
    const fallback=[["#cdd3d2",0],["#f6f7f4",22],["#cbd1d0",41],["#f5f5f1",63],["#cdd3d2",80],["#eff0ed",100]];
    const stops=points.length>=2?points.map(m=>[m[1],Number(m[2])]):fallback;
    const angle=110*Math.PI/180;
    const dx=Math.sin(angle),dy=-Math.cos(angle);
    const length=Math.abs(c.width*dx)+Math.abs(c.height*dy);
    const cx=c.width/2,cy=c.height/2;
    const gradient=ctx.createLinearGradient(cx-dx*length/2,cy-dy*length/2,
      cx+dx*length/2,cy+dy*length/2);
    stops.forEach(([color,stop])=>gradient.addColorStop(Math.max(0,Math.min(1,stop/100)),color));
    ctx.fillStyle=gradient;ctx.fillRect(0,0,c.width,c.height);

    // Approximate the old V1 veil and ambient light for lens sampling only.
    // We never replace or restyle the actual rendered background.
    const veil=Math.max(0,Math.min(.85,parseFloat(getComputedStyle(root).getPropertyValue("--veil"))||0));
    if(veil){ctx.fillStyle="rgba(248,249,247,"+veil+")";ctx.fillRect(0,0,c.width,c.height);}
    const light=ctx.createLinearGradient(0,0,c.width*.09,c.height);
    light.addColorStop(0,"rgba(255,255,255,.33)");
    light.addColorStop(.45,"rgba(255,255,255,0)");
    light.addColorStop(1,"rgba(244,245,243,.33)");
    ctx.fillStyle=light;ctx.fillRect(0,0,c.width,c.height);
    return c;
  }
  function wallpaperURL(){
    const computed=getComputedStyle(wallpaper).backgroundImage;
    const m=/^url\(\s*["']?(.+?)["']?\s*\)$/i.exec(computed);
    if(!m)return null;
    const url=m[1];
    return /^(data:image\/(?:png|jpe?g|webp|gif);base64,|blob:)/i.test(url)?url:null;
  }
  function syncSource(){
    pendingWallpaper=false;
    if(!kit)return;
    const url=wallpaperURL();
    const signature=url||[
      getComputedStyle(wallpaper).backgroundImage,
      getComputedStyle(root).getPropertyValue("--veil"),
      getComputedStyle(root).getPropertyValue("--brightness"),
      getComputedStyle(root).getPropertyValue("--blur"),
      innerWidth,innerHeight
    ].join("|");
    if(signature===lastSourceKey)return;
    lastSourceKey=signature;
    const version=++sourceVersion;
    if(url){
      const image=new Image();
      image.onload=()=>{
        if(version!==sourceVersion)return;
        try{kit.setSource(image,url);diagnostics();}catch(error){status.last=String(error);diagnostics();}
      };
      image.onerror=()=>{if(version===sourceVersion){status.last="original wallpaper image failed";diagnostics();}};
      image.src=url;
    }else{
      try{
        const canvas=makeCanvas();
        kit.setSource(canvas,canvas.toDataURL("image/jpeg",.86));
        diagnostics();
      }catch(error){status.last=String(error);diagnostics();}
    }
  }
  function scheduleSource(){
    if(pendingWallpaper)return;
    pendingWallpaper=true;
    requestAnimationFrame(syncSource);
  }
  // The invisible kit wallpaper is a coordinate/reference element only.
  // Old V1 .wallpaper/.veil/.light remain the actual visible background.
  const opticalBackdrop=document.createElement("div");
  opticalBackdrop.className="glass-kit-viewport-wallpaper glass-source-only";
  opticalBackdrop.setAttribute("aria-hidden","true");
  scene.before(opticalBackdrop);
  markTargets();
  try{
    const firstSource=makeCanvas();
    kit=kitAPI.mount({
      scene,backgroundElement:opticalBackdrop,
      source:firstSource,backgroundCssURL:firstSource.toDataURL("image/jpeg",.86),
      settings:{material:"clear",refraction:.66,thickness:.60,shine:.60,wobble:.12},
      onStatus(report){
        status.mode=report.state;status.AA=report.aaMode;
        status.last=report.details||"";
        scene.classList.toggle("glass-optical-ready",report.state==="gpu");
        diagnostics();
      }
    });
  }catch(error){
    status.last=String(error);
    scene.classList.remove("glass-optical-ready");
    diagnostics();
    return; // original V1 visual remains untouched in fallback
  }
  // Register newly created original-V1 conversation bubbles. Native V1
  // navigation/reconciliation remains the sole owner of the DOM and UI state.
  const nodeObserver=new MutationObserver(scheduleTargets);
  nodeObserver.observe(scene,{subtree:true,childList:true});
  const sourceObserver=new MutationObserver(scheduleSource);
  sourceObserver.observe(root,{attributes:true,attributeFilter:["style"]});
  sourceObserver.observe(scene,{attributes:true,attributeFilter:["class"]});
  sourceObserver.observe(wallpaper,{attributes:true,attributeFilter:["style","class"]});
  addEventListener("resize",scheduleSource,{passive:true});
  addEventListener("pageshow",()=>{scheduleTargets();scheduleSource();},{passive:true});
  if(!info.hidden){
    setInterval(diagnostics,1200);
  }
  diagnostics();
  window.homeMaterialOnly=Object.freeze({
    version:"v1-exact-layout/GlassKit-0.5",
    getState:()=>kit?.getState(),
    diagnostics:()=>kit?.requestDiagnostics()
  });
})();
