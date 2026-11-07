/* Home UI v2: selective layout/interaction port, synthetic data only.
   No network calls, no private persistence, no backend or model connections. */
(function(){
  "use strict";
  const $=id=>document.getElementById(id);
  const root=$("glass-scene"),foreground=$("appContent"),scroll=$("contentScroll");
  const glass=window.homeGlassPreview;
  const pages=["home","chat","together","reading","room","memory","settings"];
  const friendly={home:"Home",chat:"Chat",together:"Together",reading:"Reading",room:"Room",memory:"Memory",settings:"Settings"};
  const articleTitles={"sample-one":"关于一些缓慢的下午","sample-two":"留一盏小灯","sample-three":"晴天的边缘"};
  const activityCopy={listen:"一起听一首歌。正式活动会使用独立的会话和适配器。",play:"一起玩点什么。这里暂时保留页面和互动入口。",watch:"挑一部想看的电影。现在只验证页面结构与玻璃层级。"};
  let lastPage="home",chatPosition=0,stress=false,avatarUrl=null,attachmentUrl=null,attachmentFile=null;
  let toastTimer=0,compare=false,smoked=false,frame=0,baseline=root.clientHeight,lastKeyboard="";
  const input=$("chatInput"),vv=window.visualViewport;
  function notify(text){
    const toast=$("toast");
    toast.textContent=text;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>toast.classList.remove("show"),2700);
  }
  function openDialog(id){
    const dialog=$(id);
    if(dialog && !dialog.open)dialog.showModal();
  }
  for(const button of document.querySelectorAll("[data-close-dialog]")){
    button.addEventListener("click",()=>button.closest("dialog")?.close());
  }
  for(const dialog of document.querySelectorAll("dialog")){
    dialog.addEventListener("click",event=>{
      if(event.target!==dialog)return;
      const r=dialog.getBoundingClientRect();
      if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();
    });
  }
  function formatDate(now){
    const month=new Intl.DateTimeFormat("en-US",{month:"short"}).format(now).toUpperCase();
    const day=new Intl.DateTimeFormat("en-US",{day:"2-digit"}).format(now);
    return month+" "+day;
  }
  function refreshHome(){
    const now=new Date();
    const t=new Intl.DateTimeFormat("en-GB",{hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(now);
    $("homeDate").textContent=formatDate(now);
    $("homeDate").dateTime=now.toISOString().slice(0,10);
    $("homeClock").textContent=t;
    $("homeClock").dateTime=now.toISOString();
    const hour=now.getHours();
    $("homeGreeting").textContent=hour<6||hour>=19?"今晚也在这里。":"回来了。";
    $("homeTodayDate").textContent=new Intl.DateTimeFormat("zh-CN",{month:"long",day:"numeric",weekday:"short"}).format(now);
    const last=[...document.querySelectorAll("#messages .message, #localMessages .message")].at(-1);
    const bubble=last?.querySelector(".bubble");
    if(bubble)$("homeRecentChat").textContent=bubble.textContent.trim().slice(0,95)||"一张刚分享的图片。";
  }
  function renderSubpages(path){
    const activity=path[0]==="together"&&["listen","play","watch"].includes(path[1])?path[1]:null;
    $("togetherOverview").hidden=Boolean(activity);
    $("togetherDetail").hidden=!activity;
    if(activity){
      $("activityTitle").textContent=activity[0].toUpperCase()+activity.slice(1);
      $("activityCopy").textContent=activityCopy[activity];
    }
    const detail=path[0]==="reading" && Object.hasOwn(articleTitles,path[1])?path[1]:null;
    $("readingOverview").hidden=Boolean(detail);
    $("readingDetail").hidden=!detail;
    if(detail)$("readingTitle").textContent=articleTitles[detail];
    const archive=path[0]==="room"&&path[1]==="archive";
    const documentPage=archive&&["world","prompt"].includes(path[2]);
    $("roomOverview").hidden=archive;
    $("roomArchive").hidden=!archive||documentPage;
    $("roomDocument").hidden=!documentPage;
    if(documentPage)$("roomDocumentTitle").textContent=path[2]==="world"?"World":"Prompt";
    const apiView=path[0]==="settings"&&path[1]==="api";
    $("settingsOverview").hidden=apiView;
    $("apiSettingsView").hidden=!apiView;
  }
  function route(){
    const path=decodeURIComponent(location.hash.slice(1)||"home").toLowerCase().split("/");
    const segment=path[0];
    const page=segment==="memory"||(segment==="room"&&path[1]==="archive"&&path[2]==="memory")?"memory":(pages.includes(segment)?segment:"home");
    if(lastPage==="chat")chatPosition=scroll.scrollTop;
    lastPage=page;
    root.dataset.page=page;
    for(const node of document.querySelectorAll(".page"))node.hidden=node.id!==page+"Page";
    const dock=page==="memory"||page==="settings"?"room":page;
    for(const link of document.querySelectorAll(".bottom-dock .tab")){
      if(link.dataset.page===dock)link.setAttribute("aria-current","page");
      else link.removeAttribute("aria-current");
    }
    renderSubpages(path);
    if(page==="home")refreshHome();
    scroll.scrollTop=page==="chat"?chatPosition:0;
    requestKeyboard();
    glass.refresh();
  }
  window.addEventListener("hashchange",route);
  $("backHome").addEventListener("click",()=>{location.hash="home";});
  $("homeSearchButton").addEventListener("click",()=>{openDialog("homeSearchDialog");renderSearch();});
  $("readingSearchButton").addEventListener("click",()=>{openDialog("homeSearchDialog");renderSearch();});
  $("appearance").addEventListener("click",()=>openDialog("appearanceDialog"));
  $("roomSettings").addEventListener("click",()=>{location.hash="settings";});
  $("settingsAppearance").addEventListener("click",()=>openDialog("appearanceDialog"));
  $("conversationOpen").addEventListener("click",()=>openDialog("conversationDialog"));
  $("resumeConversation").addEventListener("click",()=>{$("conversationDialog").close();location.hash="chat";});
  $("callOpen").addEventListener("click",()=>openDialog("callDialog"));
  $("fontSize").addEventListener("input",event=>{
    const size=Number(event.target.value);
    root.style.setProperty("--chat-font",size+"px");
    $("fontValue").textContent=size+"px";
    glass.refresh();
  });
  $("openDiagnostics").addEventListener("click",()=>{
    $("appearanceDialog").close();
    $("debugPanel").hidden=false;
    glass.diagnostics();
  });
  $("closeDiagnostics").addEventListener("click",()=>{$("debugPanel").hidden=true;});
  $("measure").addEventListener("click",()=>glass.diagnostics());
  $("compare").addEventListener("click",()=>{
    compare=!compare;
    glass.update({compare:compare});
    $("compare").setAttribute("aria-pressed",String(compare));
    glass.diagnostics();
  });
  $("materialMode").addEventListener("click",()=>{
    smoked=!smoked;
    glass.update({material:smoked?"smoked":"clear"});
    $("materialMode").setAttribute("aria-pressed",String(smoked));
    $("materialMode").textContent=smoked?"CLEAR 对照":"SMOKED 对照";
    glass.diagnostics();
  });
  $("wallpaperFile").addEventListener("change",async event=>{
    const file=event.target.files?.[0];
    if(!file)return;
    try{await glass.setBackgroundFile(file);notify("背景已替换，仅在此页面展示。");}
    catch(error){notify("背景载入失败："+error.message);}
    event.target.value="";
  });
  function renderSearch(){
    const q=$("homeSearchInput").value.trim().toLocaleLowerCase();
    const records=[
      {title:"最近聊天",text:$("homeRecentChat").textContent,hash:"#chat"},
      {title:"Memory",text:"私人记忆档案",hash:"#room/archive/memory"},
      {title:"Reading",text:"阅读角",hash:"#reading"},
      {title:"Together",text:"一起听、一起玩、一起看",hash:"#together"}
    ];
    for(const node of document.querySelectorAll("#messages .bubble, #localMessages .bubble")){
      records.push({title:"聊天片段",text:node.textContent.trim(),hash:"#chat"});
    }
    const results=$("homeSearchResults");
    results.replaceChildren();
    const filtered=records.filter(r=>!q||(r.title+" "+r.text).toLocaleLowerCase().includes(q)).slice(0,9);
    for(const item of filtered){
      const link=document.createElement("a");
      link.href=item.hash;
      link.textContent=item.title;
      const small=document.createElement("small");
      small.textContent=item.text.slice(0,80);
      link.append(small);
      link.addEventListener("click",()=>{$("homeSearchDialog").close();});
      results.append(link);
    }
    if(!filtered.length){
      const p=document.createElement("p");
      p.textContent="没有找到相关的本地预览内容。";
      results.append(p);
    }
  }
  $("homeSearchInput").addEventListener("input",renderSearch);
  $("memorySearch").addEventListener("input",()=>{
    $("memoryEmpty").textContent="公开预览中没有私人记忆可供搜索。";
  });
  for(const button of document.querySelectorAll("[data-memory-filter]")){
    button.addEventListener("click",()=>{
      for(const other of document.querySelectorAll("[data-memory-filter]"))
        other.setAttribute("aria-pressed",String(other===button));
      $("memoryEmpty").textContent="当前「"+button.textContent+"」没有可公开展示的记忆记录。";
    });
  }
  function resizeInput(){
    input.style.height="44px";
    input.style.height=Math.min(122,Math.max(44,input.scrollHeight))+"px";
    $("send").disabled=!input.value.trim()&&!attachmentFile;
  }
  input.addEventListener("input",resizeInput);
  input.addEventListener("keydown",event=>{
    if(event.key==="Enter"&&!event.shiftKey&&!event.isComposing&&matchMedia("(pointer:fine)").matches){
      event.preventDefault();
      $("composer").requestSubmit();
    }
  });
  function makeLocalBubble(text,fileUrl){
    const item=document.createElement("article");
    item.className="message user";
    const bubble=document.createElement("div");
    bubble.className="bubble glass-surface";
    bubble.setAttribute("data-glass","");
    bubble.dataset.glassProfile="control";
    bubble.dataset.glassRadius="20";
    if(text)bubble.textContent=text;
    if(fileUrl){
      const image=document.createElement("img");
      image.alt="本地测试图片";
      image.src=fileUrl;
      image.style.cssText="max-width:220px;max-height:240px;display:block;object-fit:contain;border-radius:12px;margin:4px 0";
      bubble.append(image);
    }
    item.append(bubble);
    const tools=document.createElement("div");
    tools.className="message-tools";
    const time=document.createElement("time");
    time.textContent=new Intl.DateTimeFormat("en-GB",{hour:"2-digit",minute:"2-digit"}).format(new Date());
    tools.append(time);
    item.append(tools);
    return item;
  }
  $("composer").addEventListener("submit",event=>{
    event.preventDefault();
    const text=input.value.trim();
    if(!text&&!attachmentFile)return;
    const url=attachmentUrl;
    $("localMessages").append(makeLocalBubble(text,url));
    attachmentUrl=null;attachmentFile=null;
    $("attachmentPreview").removeAttribute("src");
    $("attachmentDraft").hidden=true;
    input.value="";
    resizeInput();
    scroll.scrollTop=scroll.scrollHeight;
    glass.refresh();
    notify("已加到本地预览，没有发送或保存。");
  });
  $("add").addEventListener("click",()=>$("messageFile").click());
  $("messageFile").addEventListener("change",event=>{
    const file=event.target.files?.[0];
    if(!file)return;
    if(!file.type.startsWith("image/")){notify("请选择图片");return;}
    if(attachmentUrl)URL.revokeObjectURL(attachmentUrl);
    attachmentFile=file;
    attachmentUrl=URL.createObjectURL(file);
    $("attachmentPreview").src=attachmentUrl;
    $("attachmentDraft").hidden=false;
    event.target.value="";
    resizeInput();
    glass.refresh();
  });
  $("attachmentRemove").addEventListener("click",()=>{
    if(attachmentUrl)URL.revokeObjectURL(attachmentUrl);
    attachmentUrl=null;attachmentFile=null;
    $("attachmentPreview").removeAttribute("src");
    $("attachmentDraft").hidden=true;
    resizeInput();
    glass.refresh();
  });
  $("voice").addEventListener("click",()=>notify("语音功能入口已保留，此预览尚未接入服务。"));
  $("messages").addEventListener("click",async event=>{
    const button=event.target.closest(".copy");
    if(!button)return;
    const article=button.closest(".message");
    const text=[...article.querySelectorAll(".bubble")].map(x=>x.textContent).join("\n\n");
    try{await navigator.clipboard.writeText(text);notify("已复制");}
    catch{notify("可以长按选择文字复制");}
  });
  $("stressToggle").addEventListener("click",()=>{
    stress=!stress;
    const container=$("stressMessages");
    container.replaceChildren();
    if(stress){
      const fragment=document.createDocumentFragment();
      for(let i=1;i<=40;i++){
        const row=makeLocalBubble("Surface "+String(i).padStart(2,"0")+" · 滚动与玻璃采样测试。",null);
        if(i%2)row.classList.remove("user");
        fragment.append(row);
      }
      container.append(fragment);
    }
    $("stressToggle").textContent=stress?"移除 40 条测试":"增加 40 条滚动测试";
    $("stressToggle").setAttribute("aria-pressed",String(stress));
    glass.refresh();
    glass.diagnostics();
  });
  // Local avatar preview only. The browser object URL is not sent or persisted.
  $("avatarButton").addEventListener("click",()=>$("avatarFile").click());
  $("avatarFile").addEventListener("change",event=>{
    const file=event.target.files?.[0];
    if(!file||!file.type.startsWith("image/"))return;
    if(avatarUrl)URL.revokeObjectURL(avatarUrl);
    avatarUrl=URL.createObjectURL(file);
    $("avatarImage").src=avatarUrl;
    $("avatarImage").hidden=false;
    $("avatarLetter").hidden=true;
    event.target.value="";
  });
  // Viewport shell stays stable: only the native foreground follows the visual keyboard window.
  function updateKeyboard(){
    frame=0;
    if(vv&&Math.abs(vv.scale-1)>.02)return;
    const focused=root.dataset.page==="chat"&&document.activeElement===input;
    if(!focused&&!root.classList.contains("keyboard-open"))baseline=root.clientHeight;
    const height=vv?.height||root.clientHeight;
    const top=vv?.offsetTop||0;
    const open=Boolean(vv&&focused&&Math.max(baseline,root.clientHeight)-height>120);
    const geometry=(open?"open:":"closed:")+Math.round(height)+":"+Math.round(top);
    if(geometry===lastKeyboard)return;
    lastKeyboard=geometry;
    root.classList.toggle("keyboard-open",open);
    if(open){
      foreground.style.height=height+"px";
      foreground.style.transform="translateY("+top+"px)";
    }else{
      foreground.style.removeProperty("height");
      foreground.style.removeProperty("transform");
      baseline=root.clientHeight;
    }
    scroll.scrollTop=scroll.scrollHeight-scroll.clientHeight-scroll.scrollTop<36?scroll.scrollHeight:scroll.scrollTop;
    glass.refresh();
  }
  function requestKeyboard(){if(!frame)frame=requestAnimationFrame(updateKeyboard);}
  vv?.addEventListener("resize",requestKeyboard,{passive:true});
  vv?.addEventListener("scroll",requestKeyboard,{passive:true});
  window.addEventListener("resize",requestKeyboard,{passive:true});
  window.addEventListener("pageshow",requestKeyboard);
  document.addEventListener("focusin",requestKeyboard);
  document.addEventListener("focusout",requestKeyboard);
  // Prevent accidental standalone root scrolling without blocking inner scroll regions.
  if(document.documentElement.classList.contains("is-standalone")){
    const pin=()=>{if(!vv||Math.abs(vv.scale-1)<.02){if(window.scrollX||window.scrollY)window.scrollTo(0,0);}};
    window.addEventListener("scroll",pin,{passive:true});
    window.addEventListener("pageshow",pin);
  }
  window.addEventListener("pagehide",()=>{
    if(avatarUrl)URL.revokeObjectURL(avatarUrl);
    if(attachmentUrl)URL.revokeObjectURL(attachmentUrl);
    for(const image of document.querySelectorAll("#localMessages img")){
      if(image.src.startsWith("blob:"))URL.revokeObjectURL(image.src);
    }
  });

  // Public-only API settings prototype. Profile metadata stays in memory; no keys or requests.
  const apiProfiles=[];
  let defaultApiProfileId=null,editingApiProfileId=null,apiProfileSequence=0;
  const apiProtocolLabels={"openai-compatible":"OpenAI 兼容接口","anthropic-messages":"Anthropic Messages","custom":"自定义协议 / 网关"};
  function updateApiSummary(){
    const current=apiProfiles.find(profile=>profile.id===defaultApiProfileId);
    $("apiDefaultSummary").textContent=current?current.name+" · "+current.model:"尚未设置默认连接";
    $("apiDefaultState").textContent=current?"本页默认":"未配置";
    $("apiSettingsSummary").textContent=current?apiProfiles.length+" 条连接":"尚未配置";
  }
  function renderApiProfiles(){
    const list=$("apiProfiles");list.replaceChildren();
    if(!apiProfiles.length){
      const empty=document.createElement("div");empty.className="api-empty glass-surface";
      empty.dataset.glass="";empty.dataset.glassProfile="panel";empty.dataset.glassRadius="22";
      const eyebrow=document.createElement("span");eyebrow.className="eyebrow";eyebrow.textContent="YOUR CONNECTIONS";
      const title=document.createElement("h3");title.textContent="还没有 API 连接";
      const description=document.createElement("p");description.textContent="可以分别添加 Claude、OpenAI 兼容服务，或自己的自定义网关。不同连接可以独立选择模型。";
      empty.append(eyebrow,title,description);list.append(empty);
    }else{
      for(const profile of apiProfiles){
        const card=document.createElement("article");card.className="api-profile-card glass-surface"+(profile.id===defaultApiProfileId?" is-default":"");
        card.dataset.glass="";card.dataset.glassProfile="panel";card.dataset.glassRadius="22";
        const head=document.createElement("div");head.className="api-profile-head";
        const identity=document.createElement("div");
        const name=document.createElement("h3");name.textContent=profile.name;
        const protocol=document.createElement("span");protocol.className="api-protocol-label";protocol.textContent=apiProtocolLabels[profile.protocol]||apiProtocolLabels.custom;
        identity.append(name,protocol);
        const status=document.createElement("span");status.className="api-profile-status";status.textContent=profile.id===defaultApiProfileId?"默认 · 仅预览":"仅预览";
        head.append(identity,status);
        const model=document.createElement("p");model.className="api-profile-model";model.textContent=profile.model;
        const endpoint=document.createElement("p");endpoint.className="api-profile-endpoint";endpoint.textContent=profile.endpoint;
        const actions=document.createElement("div");actions.className="api-profile-actions";
        const defaultButton=document.createElement("button");defaultButton.type="button";defaultButton.textContent=profile.id===defaultApiProfileId?"当前默认":"设为默认";defaultButton.disabled=profile.id===defaultApiProfileId;
        defaultButton.addEventListener("click",()=>{defaultApiProfileId=profile.id;renderApiProfiles();notify("默认连接已更新，仅在当前预览生效。");});
        const editButton=document.createElement("button");editButton.type="button";editButton.textContent="编辑";editButton.addEventListener("click",()=>showApiProfileForm(profile));
        const removeButton=document.createElement("button");removeButton.type="button";removeButton.textContent="移除";
        removeButton.addEventListener("click",()=>{apiProfiles.splice(apiProfiles.findIndex(item=>item.id===profile.id),1);if(defaultApiProfileId===profile.id)defaultApiProfileId=apiProfiles[0]?.id||null;renderApiProfiles();notify("已从当前预览移除。");});
        actions.append(defaultButton,editButton,removeButton);card.append(head,model,endpoint,actions);list.append(card);
      }
    }
    updateApiSummary();glass.refresh();
  }
  function updateApiProtocolHint(){
    const protocol=$("apiProtocol").value;
    const hints={
      "openai-compatible":"适用于兼容 Chat Completions 格式的服务；正式版由服务端适配具体请求路径。",
      "anthropic-messages":"适用于 Claude 原生 Messages 接口；正式版由服务端处理版本头与认证格式。",
      "custom":"为其他服务预留；正式版需要对应的服务端协议适配器。"
    };
    $("apiProtocolHint").textContent=hints[protocol]||hints.custom;
  }
  function showApiProfileForm(profile){
    editingApiProfileId=profile?.id||null;
    $("apiProfileFormTitle").textContent=profile?"编辑 API 连接":"添加 API 连接";
    $("apiProfileName").value=profile?.name||"";
    $("apiProtocol").value=profile?.protocol||"openai-compatible";
    $("apiEndpoint").value=profile?.endpoint||"";
    $("apiModel").value=profile?.model||"";
    $("apiKey").value="";
    updateApiProtocolHint();$("apiProfileForm").hidden=false;
    $("apiProfileForm").scrollIntoView({behavior:"smooth",block:"start"});glass.refresh();
  }
  function closeApiProfileForm(){
    $("apiProfileForm").reset();$("apiProfileForm").hidden=true;$("apiKey").value="";
    editingApiProfileId=null;updateApiProtocolHint();glass.refresh();
  }
  $("addApiProfile").addEventListener("click",()=>showApiProfileForm(null));
  $("apiProfileCancel").addEventListener("click",closeApiProfileForm);
  $("apiProtocol").addEventListener("change",updateApiProtocolHint);
  $("apiProfileTest").addEventListener("click",()=>notify("公开预览不会发送网络请求；正式版连接测试将由私有服务端代理执行。"));
  $("apiProfileForm").addEventListener("submit",event=>{
    event.preventDefault();
    const profile={id:editingApiProfileId||"preview-"+(++apiProfileSequence),name:$("apiProfileName").value.trim(),protocol:$("apiProtocol").value,endpoint:$("apiEndpoint").value.trim().replace(/\/+$/,""),model:$("apiModel").value.trim()};
    if(editingApiProfileId){const index=apiProfiles.findIndex(item=>item.id===editingApiProfileId);if(index>=0)apiProfiles[index]=profile;}
    else{apiProfiles.push(profile);if(!defaultApiProfileId)defaultApiProfileId=profile.id;}
    closeApiProfileForm();renderApiProfiles();notify("配置已暂存到当前页面；刷新后会清空。");
  });
  updateApiProtocolHint();updateApiSummary();

  glass.mount();
  if(!location.hash)location.hash="home";
  route();
  resizeInput();
  requestKeyboard();
})();
