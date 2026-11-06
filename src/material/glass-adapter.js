/* App-level adapter; upstream GlassMaterialKit 0.5 stays byte-identical. */
(function(global){
  "use strict";
  let kit=null;
  const element=id=>document.getElementById(id);
  const state=()=>kit?kit.getState():{state:"unavailable",aaMode:"unavailable"};
  const markStatus=({state:mode,aaMode,details})=>{
    const status=element("gpuStatus");
    status.textContent=mode==="gpu"?"GPU · "+aaMode:"CSS fallback · "+(details||"unavailable");
  };
  function mount(){
    if(kit)return kit;
    try{
      kit=global.GlassMaterialKit.mount({
        scene:element("glass-scene"),
        backgroundElement:element("wallpaper"),
        settings:{material:"clear",refraction:.66,thickness:.60,shine:.60,wobble:.12},
        onStatus:markStatus
      });
    }catch(error){
      element("gpuStatus").textContent="未能初始化 · "+error.message;
      element("glass-scene").classList.add("glass-kit-fallback");
    }
    return kit;
  }
  function update(values){kit&&kit.update(values);}
  function refresh(){kit&&kit.refresh();}
  async function diagnostics(){
    if(!kit)return null;
    const report=await kit.requestDiagnostics();
    const gpu=kit.getState();
    const output=element("renderMetrics");
    output.textContent="渲染 "+(gpu.state==="gpu"?"GPU · "+gpu.aaMode:"CSS fallback")+
      " · 当前目标 "+report.currentTargets+
      " · 上次处理 "+report.lastTargets+
      " · 绘制 "+report.lastDrawn+
      " · 剔除 "+report.lastCulled+
      " · 帧 "+report.frames+
      " · Canvas "+report.canvasPixels+" px"+
      " · 纹理 "+report.texturePixels+" px"+
      (report.stale?" · stale":"")+
      (report.suspended?" · suspended":"");
    return report;
  }
  async function setBackgroundFile(file){
    if(!kit)throw new Error("Glass renderer unavailable");
    if(!file || !file.type.startsWith("image/"))throw new Error("Choose an image");
    await kit.setBackgroundFile(file);
    await diagnostics();
  }
  global.homeGlassPreview=Object.freeze({mount,update,refresh,diagnostics,setBackgroundFile,state});
})(window);
