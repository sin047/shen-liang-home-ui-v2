"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawn, spawnSync } = require("node:child_process");
const { pathToFileURL } = require("node:url");

const candidates = ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser"];
const chrome = candidates.map((name) => spawnSync("which", [name], { encoding: "utf8" }))
  .find((result) => result.status === 0)?.stdout.trim();
assert.ok(chrome, "A Chromium/Chrome binary is required for the browser smoke test");

const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), "home-api-ui-"));
const artifactDir = path.resolve("artifacts/api-connection-ui");
fs.mkdirSync(artifactDir, { recursive: true });
const child = spawn(chrome, [
  "--headless=new", "--no-sandbox", "--disable-dev-shm-usage",
  "--enable-webgl", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader",
  "--hide-scrollbars", "--remote-debugging-port=9222", "--remote-debugging-address=127.0.0.1", "--remote-allow-origins=*", "--allow-file-access-from-files", "--no-first-run",
  "--disable-background-networking", "--disable-extensions",
  "--user-data-dir=" + profileDir, "about:blank"
], { stdio: ["ignore", "ignore", "pipe"] });
let chromeStderr = "";
child.stderr.setEncoding("utf8");
child.stderr.on("data", (chunk) => { chromeStderr = (chromeStderr + chunk).slice(-4000); });

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let socket = null;
let sequence = 0;
const pending = new Map();

function connectSocket(url) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url);
    ws.addEventListener("open", () => resolve(ws), { once: true });
    ws.addEventListener("error", () => reject(new Error("Chrome DevTools WebSocket connection failed")), { once: true });
  });
}

function cdp(method, params = {}) {
  const id = ++sequence;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(new Error("CDP timeout: " + method));
    }, 15000);
    pending.set(id, { resolve, reject, timer });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(expression) {
  const result = await cdp("Runtime.evaluate", {
    expression, returnByValue: true, awaitPromise: true, userGesture: true
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text || "Browser evaluation failed");
  }
  return result.result?.value;
}

async function waitFor(check, label, timeout = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (child.exitCode !== null) throw new Error("Chrome exited before " + label);
    try { if (await check()) return; } catch {}
    await delay(100);
  }
  throw new Error("Timed out waiting for " + label);
}

async function capture(name) {
  await delay(450);
  const result = await cdp("Page.captureScreenshot", { format: "png", fromSurface: true, captureBeyondViewport: false });
  const output = path.join(artifactDir, name);
  fs.writeFileSync(output, Buffer.from(result.data, "base64"));
  assert.ok(fs.statSync(output).size > 10000, "Screenshot looks unexpectedly small: " + name);
  return output;
}

async function main() {
  try {
    const endpoint = "http://127.0.0.1:9222/json/list";
    await waitFor(async () => {
      if (child.exitCode !== null) throw new Error("Chrome exited: " + chromeStderr);
      try { const response = await fetch(endpoint); return response.ok; } catch { return false; }
    }, "Chrome DevTools endpoint");
    const targets = await fetch(endpoint).then((response) => response.json());
    const page = targets.find((target) => target.type === "page");
    assert.ok(page?.webSocketDebuggerUrl, "Chrome page target not found");
    socket = await connectSocket(page.webSocketDebuggerUrl);
    socket.addEventListener("message", (event) => {
      const message = JSON.parse(String(event.data));
      if (!message.id || !pending.has(message.id)) return;
      const item = pending.get(message.id);
      pending.delete(message.id);
      clearTimeout(item.timer);
      if (message.error) item.reject(new Error(message.error.message));
      else item.resolve(message.result);
    });
    await cdp("Page.enable");
    await cdp("Runtime.enable");

    const pagePath = path.resolve("material-only/chat-preview.html");
    const editorUrl = pathToFileURL(pagePath).href + "?apiPreview=editor#room/settings/model";
    await cdp("Page.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
    await cdp("Page.navigate", { url: editorUrl });
    await waitFor(
      () => evaluate('document.readyState==="complete" && !!document.getElementById("apiConnectionDialog") && document.getElementById("apiConnectionDialog").open'),
      "desktop API editor preview"
    );
    const desktopState = await evaluate("window.homeMaterialOnly?.getState()?.state || 'unavailable'");
    await capture("api-connection-editor-desktop.png");

    await cdp("Page.setDeviceMetricsOverride", {
      width: 390, height: 844, deviceScaleFactor: 3, mobile: true,
      screenWidth: 390, screenHeight: 844,
      screenOrientation: { type: "portraitPrimary", angle: 0 }
    });
    await capture("api-connection-editor-iphone.png");

    const functionalUrl = pathToFileURL(pagePath).href + "#room/settings/model";
    await cdp("Page.setDeviceMetricsOverride", { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
    await cdp("Page.navigate", { url: functionalUrl });
    await waitFor(
      () => evaluate('document.readyState==="complete" && !!document.getElementById("apiAddConnection")'),
      "API connection list"
    );

    const interaction = async function () {
      const $ = (id) => document.getElementById(id);
      const assertPage = (condition, message) => { if (!condition) throw new Error(message); };
      const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      window.confirm = () => true;

      $("apiAddConnection").click();
      assertPage($("apiConnectionDialog").open, "Add button did not open the editor");
      $("apiConnectionName").value = "GPT 主连接";
      $("apiProtocol").value = "openai-compatible";
      $("apiProtocol").dispatchEvent(new Event("change", { bubbles: true }));
      $("apiBaseUrl").value = "https://api.example.test/v1";
      $("apiKey").value = "demo-key-not-a-real-secret";
      $("apiModelId").value = "gpt-demo-model";
      assertPage($("apiKey").type === "password", "API Key should start hidden");
      $("apiKeyVisibility").click();
      assertPage($("apiKey").type === "text", "Show API Key did not reveal the field");
      $("apiKeyVisibility").click();
      assertPage($("apiKey").type === "password", "Hide API Key did not mask the field");
      $("apiTestConnection").click();
      await wait(520);
      assertPage($("apiFormStatus").textContent.includes("本地字段检查通过（模拟）"), "Local simulated success state missing");
      $("apiSaveConnection").click();
      await wait(80);
      assertPage(!$("apiConnectionDialog").open, "Save did not close the editor");
      assertPage(document.querySelectorAll(".api-connection-card").length === 1, "First connection was not saved");
      assertPage($("apiDefaultSummary").textContent.includes("GPT 主连接"), "First connection should become default");

      let card = document.querySelector(".api-connection-card");
      [...card.querySelectorAll("button")].find((button) => button.textContent === "编辑").click();
      assertPage($("apiConnectionDialog").open, "Edit did not reuse the same editor");
      assertPage($("apiKey").value === "" && $("apiKey").placeholder.includes("留空"), "Edit should not prefill the secret");
      $("apiModelId").value = "gpt-demo-model-updated";
      $("apiSaveConnection").click();
      await wait(80);
      card = document.querySelector(".api-connection-card");
      assertPage(card.textContent.includes("gpt-demo-model-updated"), "Edit did not update the model ID");
      assertPage(card.textContent.includes("API Key 已设置"), "Blank edit should preserve the in-memory key");

      let enabled = card.querySelector('input[type="checkbox"]');
      enabled.checked = false;
      enabled.dispatchEvent(new Event("change", { bubbles: true }));
      assertPage($("apiDefaultSummary").textContent === "尚未设置默认连接", "Disabled default should be cleared");
      card = document.querySelector(".api-connection-card");
      enabled = card.querySelector('input[type="checkbox"]');
      enabled.checked = true;
      enabled.dispatchEvent(new Event("change", { bubbles: true }));
      card = document.querySelector(".api-connection-card");
      [...card.querySelectorAll("button")].find((button) => button.textContent === "设为默认").click();
      assertPage($("apiDefaultSummary").textContent.includes("GPT 主连接"), "Set default action failed");

      $("apiAddConnection").click();
      $("apiConnectionName").value = "Claude Opus";
      $("apiProtocol").value = "anthropic-messages";
      $("apiProtocol").dispatchEvent(new Event("change", { bubbles: true }));
      $("apiBaseUrl").value = "https://api.anthropic.example";
      $("apiModelId").value = "claude-opus-4-6";
      $("apiTestConnection").click();
      await wait(520);
      assertPage($("apiFormStatus").textContent.includes("模拟检查未通过"), "Missing-key failure state absent");
      $("apiKey").value = "demo-anthropic-key-not-real";
      $("apiTestConnection").click();
      await wait(520);
      assertPage($("apiFormStatus").textContent.includes("本地字段检查通过（模拟）"), "Anthropic simulated success state absent");
      $("apiSaveConnection").click();
      await wait(80);
      assertPage(document.querySelectorAll(".api-connection-card").length === 2, "Multiple independent connections not supported");

      const cards = [...document.querySelectorAll(".api-connection-card")];
      [...cards[1].querySelectorAll("button")].find((button) => button.textContent === "删除").click();
      assertPage(document.querySelectorAll(".api-connection-card").length === 1, "Delete did not remove the selected connection");
      assertPage(!document.querySelector(".api-connection-card").textContent.includes("demo-key-not-a-real-secret"), "API Key leaked into the connection card");

      $("apiAddConnection").click();
      $("apiKey").value = "cancel-only-demo";
      $("apiCancelConnection").click();
      await wait(50);
      assertPage($("apiKey").value === "", "Cancel should clear the editor's secret field");
      return "PASS: add/edit/delete, multi-provider, default/enabled, key show/hide, simulated loading/success/failure, cancel and key masking";
    };
    const result = await evaluate("(" + interaction.toString() + ")()");
    assert.match(result, /^PASS:/);
    console.log(result);
    console.log("Desktop screenshot: artifacts/api-connection-ui/api-connection-editor-desktop.png");
    console.log("iPhone-size screenshot: artifacts/api-connection-ui/api-connection-editor-iphone.png");
    console.log("Glass Kit runtime state in screenshot browser: " + desktopState);
  } finally {
    if (socket) { try { socket.close(); } catch {} }
    if (child.exitCode === null) child.kill("SIGTERM");
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch {}
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
