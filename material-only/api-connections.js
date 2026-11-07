/*
 * 家 ^ ^ — API connection manager UI.
 * Public preview only: in-memory state, no provider requests, no persistence.
 * Real API credentials belong in a private server-side adapter.
 */
(function () {
  "use strict";
  const app = document.getElementById("app");
  const roomView = document.getElementById("roomView");
  if (!app || !roomView) return;
  const state = { connections: [], defaultId: null, editingId: null, sequence: 0, returnFocus: null, testTimer: null };
  const protocolLabels = {
    "openai-compatible": "OpenAI 兼容接口",
    "anthropic-messages": "Anthropic Messages",
    custom: "自定义协议 / 网关"
  };
  const byId = (id) => document.getElementById(id);
  const isModelRoute = () => location.hash.replace(/^#/, "").split("/").join("/") === "room/settings/model";
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  function announce(message) {
    const target = byId("apiConnectionFeedback");
    if (target) target.textContent = message;
  }
  function renderSettingsEntry() {
    const row = roomView.querySelector('.room-links a[href="#room/settings/model"]');
    const small = row?.querySelector("small");
    if (small) small.textContent = "管理多条 API 连接与独立模型";
  }
  function installModelPage() {
    renderSettingsEntry();
    if (!isModelRoute()) return;
    if (roomView.querySelector(".api-manager")) {
      renderConnections();
      return;
    }
    const intro = roomView.querySelector(".room-detail-intro");
    if (intro) intro.textContent = "为不同服务商添加独立连接，并为每条连接选择自己的模型。";
    const placeholder = roomView.querySelector(".room-placeholder");
    if (!placeholder) return;
    placeholder.outerHTML = `
      <section class="api-manager" aria-label="API 与模型连接管理">
        <section class="api-default-strip" data-glass data-glass-profile="panel" data-glass-radius="20" aria-live="polite">
          <div><span class="api-eyebrow">DEFAULT CONNECTION</span><p id="apiDefaultSummary">尚未设置默认连接</p></div>
          <span class="api-default-state" id="apiDefaultState">未配置</span>
        </section>
        <div class="api-list-head">
          <div><h2>API 连接</h2><p id="apiConnectionCount">还没有添加连接</p></div>
          <button class="api-connection-add" id="apiAddConnection" type="button" data-glass data-glass-profile="compact" data-glass-radius="999">＋ 添加连接</button>
        </div>
        <div class="api-connection-list" id="apiConnectionList">
          <article class="api-connection-empty" data-glass data-glass-profile="panel" data-glass-radius="20">
            <span class="api-eyebrow">YOUR CONNECTIONS</span><h3>还没有 API 连接</h3>
            <p>可以分别添加 GPT、Claude，或自己的自定义 API。每条连接都能独立选择协议和模型。</p>
          </article>
        </div>
        <p class="api-manager-note"><strong>公开预览 · 仅本页内存</strong>连接资料不会上传或写入浏览器存储，刷新或关闭页面即清空。请勿在公开预览中填写真实 API Key。</p>
        <p class="api-manager-feedback" id="apiConnectionFeedback" role="status" aria-live="polite"></p>
      </section>`;
    byId("apiAddConnection")?.addEventListener("click", () => openEditor(null));
    renderConnections();
  }

  function createDialog() {
    const dialog = document.createElement("dialog");
    dialog.id = "apiConnectionDialog";
    dialog.className = "api-connection-dialog";
    dialog.dataset.glass = "";
    dialog.dataset.glassProfile = "panel";
    dialog.dataset.glassRadius = "28";
    dialog.setAttribute("aria-labelledby", "apiConnectionTitle");
    dialog.innerHTML = `
      <form class="api-connection-form" id="apiConnectionForm" autocomplete="off" novalidate>
        <header class="api-dialog-head">
          <div><span class="api-eyebrow">CONNECTION PROFILE</span><h2 id="apiConnectionTitle">添加 API 连接</h2></div>
          <button class="api-dialog-close" id="apiCloseConnection" type="button" aria-label="关闭 API 连接窗口">×</button>
        </header>
        <div class="api-dialog-scroll">
          <p class="api-dialog-intro">为这条连接填写独立的服务地址与模型。不同连接互不覆盖。</p>
          <div class="api-dialog-security" role="note">
            <strong>密钥安全说明</strong>
            <p>此处是公开前端样稿。密钥只在当前页面内存中短暂保留，不会发送或持久化；请勿填写真实 API Key。正式版应由私有服务端保管密钥。</p>
          </div>
          <section class="api-form-section" aria-labelledby="apiBasicTitle">
            <h3 id="apiBasicTitle">基础信息</h3>
            <label class="api-field"><span>连接名称</span><input id="apiConnectionName" name="connectionName" type="text" maxlength="48" placeholder="例如：GPT 主连接、Claude Opus" autocomplete="off" required></label>
            <label class="api-field"><span>服务商 / 协议类型</span>
              <select id="apiProtocol" name="protocol">
                <option value="openai-compatible">OpenAI 兼容接口</option>
                <option value="anthropic-messages">Anthropic Messages</option>
                <option value="custom">自定义协议 / 网关</option>
              </select>
            </label>
            <p class="api-protocol-hint" id="apiProtocolHint">适用于提供 OpenAI 兼容接口格式的服务；具体路径由未来服务端适配器决定。</p>
          </section>
          <section class="api-form-section" aria-labelledby="apiEndpointTitle">
            <h3 id="apiEndpointTitle">接口配置</h3>
            <label class="api-field"><span>API Base URL</span><input id="apiBaseUrl" name="baseUrl" type="url" inputmode="url" placeholder="https://api.example.com/v1" autocomplete="url" required></label>
            <label class="api-field"><span>API Key</span>
              <span class="api-secret-control"><input id="apiKey" name="apiKey" type="password" placeholder="填写服务商提供的密钥" autocomplete="new-password" autocapitalize="off" spellcheck="false" required><button id="apiKeyVisibility" type="button" aria-pressed="false">显示</button></span>
              <small class="api-field-note" id="apiKeyNote">仅在当前页面内存中暂存；编辑已有连接时留空可保留当前密钥。</small>
            </label>
            <label class="api-field"><span>模型 ID</span><input id="apiModelId" name="modelId" type="text" maxlength="160" placeholder="例如：claude-opus-4-6" autocomplete="off" required></label>
          </section>
          <section class="api-form-section api-switches" aria-label="连接状态">
            <label class="api-switch"><input id="apiIsDefault" name="isDefault" type="checkbox"><span><strong>设为默认连接</strong><small>新会话优先使用这条连接（仅本页预览）</small></span></label>
            <label class="api-switch"><input id="apiIsEnabled" name="enabled" type="checkbox" checked><span><strong>启用这条连接</strong><small>关闭后保留配置，但不作为默认连接</small></span></label>
          </section>
          <details class="api-advanced">
            <summary><span>高级设置</span><small>请求路径、协议与超时</small></summary>
            <div class="api-advanced-body">
              <label class="api-field"><span>自定义请求路径</span><input id="apiCustomPath" name="customPath" type="text" placeholder="由服务端适配器解释，不自动拼接"></label>
              <label class="api-field"><span>自定义请求协议说明</span><input id="apiCustomProtocol" name="customProtocol" type="text" placeholder="例如：供应商专用协议 / 版本要求"></label>
              <label class="api-field"><span>超时时间</span><select id="apiTimeout" name="timeout"><option value="15000">15 秒</option><option value="30000">30 秒</option><option value="60000" selected>60 秒</option><option value="90000">90 秒</option><option value="120000">120 秒</option><option value="180000">180 秒</option></select></label>
              <label class="api-field"><span>供应商特定参数</span><textarea id="apiProviderParams" name="providerParams" rows="3" placeholder="可预留 JSON 或供应商专用参数；此处不会发送或解析"></textarea></label>
            </div>
          </details>
          <p class="api-form-status" id="apiFormStatus" role="status" aria-live="polite"></p>
        </div>
        <footer class="api-dialog-actions">
          <button class="api-secondary-button" id="apiCancelConnection" type="button">取消</button>
          <button class="api-test-button" id="apiTestConnection" type="button">测试连接（模拟）</button>
          <button class="api-primary-button" id="apiSaveConnection" type="submit">保存连接</button>
        </footer>
      </form>`;
    app.append(dialog);
    byId("apiCloseConnection").addEventListener("click", () => dialog.close());
    byId("apiCancelConnection").addEventListener("click", () => dialog.close());
    byId("apiProtocol").addEventListener("change", updateProtocolHint);
    byId("apiKeyVisibility").addEventListener("click", toggleKeyVisibility);
    byId("apiIsEnabled").addEventListener("change", () => {
      if (!byId("apiIsEnabled").checked) byId("apiIsDefault").checked = false;
    });
    byId("apiTestConnection").addEventListener("click", testConnection);
    byId("apiConnectionForm").addEventListener("submit", saveConnection);
    dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener("close", resetEditor);
    return dialog;
  }

  const dialog = createDialog();

  function updateProtocolHint() {
    const protocol = byId("apiProtocol").value;
    const hints = {
      "openai-compatible": "适用于提供 OpenAI 兼容接口格式的服务；具体请求路径和认证头由未来服务端适配器决定。",
      "anthropic-messages": "用于 Anthropic Messages 协议；正式版需由服务端处理认证、版本头和供应商要求。",
      custom: "为其他服务预留。不要假设自定义网关与 OpenAI 或 Anthropic 的请求格式相同。"
    };
    const placeholders = {
      "openai-compatible": "https://api.example.com/v1",
      "anthropic-messages": "https://api.anthropic.com",
      custom: "https://your-gateway.example"
    };
    byId("apiProtocolHint").textContent = hints[protocol] || hints.custom;
    byId("apiBaseUrl").placeholder = placeholders[protocol] || placeholders.custom;
  }

  function toggleKeyVisibility() {
    const input = byId("apiKey"), button = byId("apiKeyVisibility");
    const visible = input.type === "password";
    input.type = visible ? "text" : "password";
    button.textContent = visible ? "隐藏" : "显示";
    button.setAttribute("aria-pressed", String(visible));
    button.setAttribute("aria-label", visible ? "隐藏 API Key" : "显示 API Key");
  }

  function getExisting() {
    return state.connections.find((item) => item.id === state.editingId) || null;
  }

  function openEditor(id, demo) {
    const profile = id ? state.connections.find((item) => item.id === id) : null;
    if (id && !profile) return;
    state.editingId = profile?.id || null;
    state.returnFocus = document.activeElement;
    byId("apiConnectionForm").reset();
    byId("apiConnectionTitle").textContent = profile ? "编辑 API 连接" : "添加 API 连接";
    byId("apiConnectionName").value = profile?.name || "";
    byId("apiProtocol").value = profile?.protocol || "openai-compatible";
    byId("apiBaseUrl").value = profile?.baseUrl || "";
    byId("apiModelId").value = profile?.modelId || "";
    byId("apiCustomPath").value = profile?.customPath || "";
    byId("apiCustomProtocol").value = profile?.customProtocol || "";
    byId("apiTimeout").value = String(profile?.timeout || 60000);
    byId("apiProviderParams").value = profile?.providerParams || "";
    byId("apiIsDefault").checked = profile ? profile.id === state.defaultId : state.connections.length === 0;
    byId("apiIsEnabled").checked = profile ? profile.enabled : true;
    byId("apiKey").value = "";
    byId("apiKey").required = !profile?.apiKey;
    byId("apiKey").placeholder = profile?.apiKey ? "已设置；留空可保留当前密钥" : "填写服务商提供的密钥";
    byId("apiKeyNote").textContent = profile?.apiKey
      ? "当前连接已在本页内存中暂存密钥；留空可保留，输入新值则替换。"
      : "仅在当前页面内存中暂存；不会上传或写入浏览器存储。";
    byId("apiKey").type = "password";
    byId("apiKeyVisibility").textContent = "显示";
    byId("apiKeyVisibility").setAttribute("aria-pressed", "false");
    byId("apiFormStatus").textContent = "";
    byId("apiFormStatus").dataset.state = "";
    byId("apiTestConnection").disabled = false;
    byId("apiTestConnection").textContent = "测试连接（模拟）";
    updateProtocolHint();
    if (demo) {
      byId("apiConnectionName").value = "Claude Opus · 示例";
      byId("apiProtocol").value = "anthropic-messages";
      byId("apiBaseUrl").value = "https://api.example.invalid";
      byId("apiModelId").value = "claude-opus-4-6";
      byId("apiKey").required = false;
      byId("apiKey").placeholder = "截图演示：未填写真实密钥";
      byId("apiKeyNote").textContent = "仅为截图演示值；没有真实密钥，也不会发起连接。";
      updateProtocolHint();
    }
    syncVisualViewport();
    if (!dialog.open) dialog.showModal();
    byId("apiCloseConnection").focus({ preventScroll: true });
  }

  function resetEditor() {
    if (state.testTimer) { clearTimeout(state.testTimer); state.testTimer = null; }
    byId("apiConnectionForm").reset();
    byId("apiKey").value = "";
    byId("apiKey").type = "password";
    byId("apiKey").required = true;
    byId("apiKeyVisibility").textContent = "显示";
    byId("apiKeyVisibility").setAttribute("aria-pressed", "false");
    byId("apiFormStatus").textContent = "";
    byId("apiFormStatus").dataset.state = "";
    byId("apiTestConnection").disabled = false;
    byId("apiTestConnection").textContent = "测试连接（模拟）";
    state.editingId = null;
    if (state.returnFocus?.isConnected) state.returnFocus.focus({ preventScroll: true });
    state.returnFocus = null;
  }

  function readForm() {
    const existing = getExisting(), typedKey = byId("apiKey").value.trim();
    return {
      id: state.editingId,
      name: byId("apiConnectionName").value.trim(),
      protocol: byId("apiProtocol").value,
      baseUrl: byId("apiBaseUrl").value.trim(),
      apiKey: typedKey || existing?.apiKey || "",
      modelId: byId("apiModelId").value.trim(),
      isDefault: byId("apiIsDefault").checked,
      enabled: byId("apiIsEnabled").checked,
      customPath: byId("apiCustomPath").value.trim(),
      customProtocol: byId("apiCustomProtocol").value.trim(),
      timeout: Number(byId("apiTimeout").value) || 60000,
      providerParams: byId("apiProviderParams").value.trim()
    };
  }

  function validate(data) {
    if (!data.name) return "请填写连接名称。";
    if (!data.baseUrl) return "请填写 API Base URL。";
    let parsed;
    try { parsed = new URL(data.baseUrl); } catch { return "API Base URL 格式不正确。"; }
    if (!["http:", "https:"].includes(parsed.protocol) || parsed.username || parsed.password) {
      return "Base URL 只接受不含账号密码的 HTTP 或 HTTPS 地址。";
    }
    if (!data.modelId) return "请填写模型 ID。";
    if (!data.apiKey) return "请填写 API Key。";
    if (data.isDefault && !data.enabled) return "默认连接必须处于启用状态。";
    return "";
  }

  function setFormStatus(message, status) {
    const node = byId("apiFormStatus");
    node.textContent = message;
    node.dataset.state = status || "";
  }

  function testConnection() {
    if (state.testTimer) clearTimeout(state.testTimer);
    const error = validate(readForm()), button = byId("apiTestConnection");
    button.disabled = true;
    button.textContent = "本地模拟中…";
    setFormStatus("正在进行本地字段检查；不会发出网络请求。", "loading");
    state.testTimer = setTimeout(() => {
      state.testTimer = null;
      button.disabled = false;
      button.textContent = "测试连接（模拟）";
      if (error) setFormStatus("模拟检查未通过：" + error, "error");
      else setFormStatus("本地字段检查通过（模拟）。没有连接或请求任何 API 服务商。", "success");
    }, 420);
  }

  function firstEnabled(exceptId) {
    return state.connections.find((item) => item.id !== exceptId && item.enabled)?.id || null;
  }

  function saveConnection(event) {
    event.preventDefault();
    const data = readForm(), error = validate(data);
    if (error) { setFormStatus(error, "error"); return; }
    const editingId = state.editingId, id = editingId || "preview-" + (++state.sequence);
    const profile = { ...data, id };
    if (editingId) {
      const index = state.connections.findIndex((item) => item.id === editingId);
      if (index >= 0) state.connections[index] = profile;
    } else state.connections.push(profile);

    if (profile.isDefault) state.defaultId = id;
    else if (state.defaultId === id || !state.defaultId) state.defaultId = firstEnabled() || (profile.enabled ? id : null);
    if (!state.connections.some((item) => item.id === state.defaultId && item.enabled)) {
      state.defaultId = firstEnabled() || (profile.enabled ? id : null);
    }
    dialog.close();
    renderConnections();
    announce("连接已保存到当前页面内存；刷新或关闭页面后会清空。");
  }

  function setDefault(id) {
    const profile = state.connections.find((item) => item.id === id);
    if (!profile || !profile.enabled) { announce("请先启用这条连接，再将它设为默认。"); return; }
    state.defaultId = id;
    renderConnections();
    announce("默认连接已更新，仅在当前页面预览中生效。");
  }

  function setEnabled(id, enabled) {
    const profile = state.connections.find((item) => item.id === id);
    if (!profile) return;
    profile.enabled = enabled;
    if (!enabled && state.defaultId === id) state.defaultId = firstEnabled(id);
    renderConnections();
    announce(enabled ? "连接已启用（仅本页预览）。" : "连接已停用；配置仍保留在本页内存。");
  }

  function renderConnections() {
    const list = byId("apiConnectionList");
    if (!list) return;
    list.replaceChildren();
    const defaultProfile = state.connections.find((item) => item.id === state.defaultId && item.enabled);
    const summary = byId("apiDefaultSummary"), stateLabel = byId("apiDefaultState"), count = byId("apiConnectionCount");
    if (summary) summary.textContent = defaultProfile ? defaultProfile.name + " · " + defaultProfile.modelId : "尚未设置默认连接";
    if (stateLabel) stateLabel.textContent = defaultProfile ? "本页默认" : "未配置";
    if (count) count.textContent = state.connections.length ? state.connections.length + " 条连接 · " + state.connections.filter((item) => item.enabled).length + " 条启用" : "还没有添加连接";

    if (!state.connections.length) {
      const empty = make("article", "api-connection-empty");
      empty.dataset.glass = "";
      empty.dataset.glassProfile = "panel";
      empty.dataset.glassRadius = "20";
      empty.append(make("span", "api-eyebrow", "YOUR CONNECTIONS"), make("h3", "", "还没有 API 连接"),
        make("p", "", "可以分别添加 GPT、Claude，或自己的自定义 API。每条连接都能独立选择协议和模型。"));
      list.append(empty);
      return;
    }

    state.connections.forEach((profile) => {
      const card = make("article", "api-connection-card" + (profile.id === state.defaultId ? " is-default" : ""));
      card.dataset.glass = "";
      card.dataset.glassProfile = "panel";
      card.dataset.glassRadius = "20";
      const head = make("div", "api-connection-card-head");
      const identity = make("div", "api-connection-identity");
      identity.append(make("h3", "", profile.name), make("span", "api-protocol-label", protocolLabels[profile.protocol] || protocolLabels.custom));
      head.append(identity, make("span", "api-connection-badge", profile.id === state.defaultId ? "默认连接" : profile.enabled ? "已启用" : "已停用"));
      const model = make("p", "api-connection-model", profile.modelId);
      const endpoint = make("p", "api-connection-endpoint", profile.baseUrl);
      const secret = make("p", "api-connection-secret", profile.apiKey ? "API Key 已设置 · 仅本页内存" : "尚未设置 API Key");
      const controls = make("div", "api-connection-controls");
      const enableLabel = make("label", "api-enable-toggle"), enableInput = document.createElement("input");
      enableInput.type = "checkbox";
      enableInput.checked = profile.enabled;
      enableInput.setAttribute("aria-label", "启用 " + profile.name);
      enableInput.addEventListener("change", () => setEnabled(profile.id, enableInput.checked));
      enableLabel.append(enableInput, make("span", "", "启用"));
      const actions = make("div", "api-connection-actions");
      const defaultButton = make("button", "", profile.id === state.defaultId ? "当前默认" : "设为默认");
      defaultButton.type = "button";
      defaultButton.disabled = profile.id === state.defaultId || !profile.enabled;
      defaultButton.addEventListener("click", () => setDefault(profile.id));
      const editButton = make("button", "", "编辑");
      editButton.type = "button";
      editButton.addEventListener("click", () => openEditor(profile.id));
      const deleteButton = make("button", "api-delete-button", "删除");
      deleteButton.type = "button";
      deleteButton.addEventListener("click", () => {
        if (!window.confirm("删除这条 API 连接？")) return;
        const index = state.connections.findIndex((item) => item.id === profile.id);
        if (index < 0) return;
        state.connections[index].apiKey = "";
        state.connections.splice(index, 1);
        if (state.defaultId === profile.id) state.defaultId = firstEnabled();
        renderConnections();
        announce("连接已从当前页面内存中删除。");
      });
      actions.append(defaultButton, editButton, deleteButton);
      controls.append(enableLabel, actions);
      card.append(head, model, endpoint, secret, controls);
      list.append(card);
    });
  }

  function syncVisualViewport() {
    const height = window.visualViewport?.height || window.innerHeight;
    const visualBottom = window.visualViewport
      ? Math.max(0, window.innerHeight - (window.visualViewport.height + window.visualViewport.offsetTop))
      : 0;
    dialog.style.setProperty("--api-visual-height", Math.max(260, Math.round(height - 12)) + "px");
    dialog.style.setProperty("--api-visual-bottom", Math.round(visualBottom) + "px");
  }
  window.visualViewport?.addEventListener("resize", syncVisualViewport, { passive: true });
  window.visualViewport?.addEventListener("scroll", syncVisualViewport, { passive: true });
  window.addEventListener("resize", syncVisualViewport, { passive: true });
  window.addEventListener("hashchange", () => requestAnimationFrame(installModelPage), { passive: true });
  window.addEventListener("pagehide", () => {
    if (state.testTimer) clearTimeout(state.testTimer);
    state.connections.forEach((item) => { item.apiKey = ""; });
    state.connections.length = 0;
    state.defaultId = null;
  });

  installModelPage();
  if (new URLSearchParams(location.search).get("apiPreview") === "editor" && isModelRoute()) {
    requestAnimationFrame(() => openEditor(null, true));
  }
})();