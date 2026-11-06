/* Interactive DOM-only smoke preview. Not connected to Home APIs. */
(function(){
  "use strict";
  const el=id=>document.getElementById(id);
  const pages=["home","chat","together","reading","room"];
  const pretty={home:"Home",chat:"Chat",together:"Together",reading:"Reading",room:"Room"};
  const glass=window.homeGlassPreview;
  glass.mount();
  const input=el("chatInput"), scroller=el("contentScroll");
  let stress=false,compare=false,smoked=false;
  const view=page=>{
    const id=pages.includes(page)?page:"chat";
    el("chatPage").hidden=id!=="chat";
    el("placeholderPage").hidden=id==="chat";
    el("composer").hidden=id!=="chat";
    el("pageHeading").firstChild.textContent=pretty[id]+" ";
    if(id!=="chat")el("placeholderTitle").textContent=pretty[id];
    for(const anchor of document.querySelectorAll(".bottom-dock a")){
      if(anchor.dataset.page===id)anchor.setAttribute("aria-current","page");
      else anchor.removeAttribute("aria-current");
    }
    scroller.scrollTop=0;
    glass.refresh();
  };
  function syncRoute(){view(location.hash.slice(1).toLowerCase()||"chat");}
  window.addEventListener("hashchange",syncRoute);
  syncRoute();
  function makeMessage(text,me){
    const item=document.createElement("article");
    item.className="message "+(me?"message-me":"message-other");
    const by=document.createElement("div");by.className="speaker";by.textContent=me?"我":"测试";
    const bubble=document.createElement("div");
    bubble.className="chat-bubble glass-surface";
    bubble.dataset.glass="";
    bubble.dataset.glassRadius="23";
    bubble.dataset.glassProfile="compact";
    bubble.textContent=text;
    item.append(by,bubble);
    return item;
  }
  function autosize(){
    input.style.height="48px";
    input.style.height=Math.min(126,Math.max(48,input.scrollHeight))+"px";
    el("send").disabled=!input.value.trim();
  }
  input.addEventListener("input",autosize);
  input.addEventListener("keydown",event=>{
    if(event.key==="Enter"&&!event.shiftKey&&!event.isComposing && matchMedia("(pointer:fine)").matches){
      event.preventDefault();
      el("composer").requestSubmit();
    }
  });
  el("composer").addEventListener("submit",event=>{
    event.preventDefault();
    const message=input.value.trim();
    if(!message)return;
    el("localMessages").append(makeMessage(message,true));
    input.value="";
    autosize();
    el("previewNotice").textContent="消息已添加到本地预览。没有发送到服务器，也没有保存。";
    scroller.scrollTop=scroller.scrollHeight;
    glass.refresh();
  });
  el("stressToggle").addEventListener("click",()=>{
    const target=el("stressMessages");
    stress=!stress;
    target.replaceChildren();
    if(stress){
      const fragment=document.createDocumentFragment();
      for(let index=1;index<=40;index++){
        fragment.append(makeMessage("Surface "+String(index).padStart(2,"0")+" · 滚动测试组件。",index%2===0));
      }
      target.append(fragment);
    }
    el("stressToggle").setAttribute("aria-pressed",String(stress));
    el("stressToggle").textContent=stress?"移除 40 个测试气泡":"增加 40 个测试气泡";
    glass.refresh();
    glass.diagnostics();
  });
  el("debugToggle").addEventListener("click",()=>{
    const panel=el("debugPanel");
    panel.hidden=!panel.hidden;
    el("debugToggle").setAttribute("aria-expanded",String(!panel.hidden));
    if(!panel.hidden)glass.diagnostics();
  });
  el("measure").addEventListener("click",()=>glass.diagnostics());
  el("compare").addEventListener("click",()=>{
    compare=!compare;
    glass.update({compare});
    el("compare").setAttribute("aria-pressed",String(compare));
    glass.diagnostics();
  });
  el("materialMode").addEventListener("click",()=>{
    smoked=!smoked;
    glass.update({material:smoked?"smoked":"clear"});
    el("materialMode").setAttribute("aria-pressed",String(smoked));
    el("materialMode").textContent=smoked?"CLEAR 对照":"SMOKED 对照";
    glass.diagnostics();
  });
  el("wallpaperFile").addEventListener("change",async event=>{
    const file=event.target.files?.[0];
    if(!file)return;
    try{await glass.setBackgroundFile(file);}
    catch(error){el("renderMetrics").textContent="图片载入失败："+error.message;}
    event.target.value="";
  });
  // Preserve the whole app shell, and resize only the focused Chat foreground.
  const scene=el("glass-scene"),vv=window.visualViewport;
  let frame=0,baseHeight=scene.clientHeight,previous="";
  function alignKeyboard(){
    frame=0;
    if(vv&&Math.abs(vv.scale-1)>.02)return;
    const focus=document.activeElement===input&& !el("composer").hidden;
    if(!focus && !scene.classList.contains("keyboard-open"))baseHeight=scene.clientHeight;
    const height=vv?.height||scene.clientHeight,top=vv?.offsetTop||0;
    const open=Boolean(vv&&focus&&(Math.max(baseHeight,scene.clientHeight)-height>120));
    const key=(open?"open:":"closed:")+height+":"+top;
    if(key===previous)return;
    previous=key;
    scene.classList.toggle("keyboard-open",open);
    if(open){
      scene.style.height=height+"px";
      scene.style.marginTop=top+"px";
    }else{
      scene.style.removeProperty("height");
      scene.style.removeProperty("margin-top");
      baseHeight=scene.clientHeight;
    }
    glass.refresh();
  }
  function requestAlign(){if(!frame)frame=requestAnimationFrame(alignKeyboard);}
  vv?.addEventListener("resize",requestAlign);
  vv?.addEventListener("scroll",requestAlign);
  window.addEventListener("resize",requestAlign);
  window.addEventListener("pageshow",requestAlign);
  document.addEventListener("focusin",requestAlign);
  document.addEventListener("focusout",requestAlign);
  requestAlign();
})();
