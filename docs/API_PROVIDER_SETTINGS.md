# API 与模型设置界面

## 状态与入口

这是 UI v2 的公开前端原型，不是可用的 API 连接器。

- 从 Room 顶部现有的 `···` 进入 Settings。
- Settings 是完整页面，不增加第六个 Dock 项；Dock 仍为 Home / Chat / Together / Reading / Room，Settings 下 Room 保持选中。
- 在 Settings 中进入 `API 与模型`，通过 `#settings/api` 管理连接资料。
- 页面沿用原版 Settings 的分组线性列表、细分隔线、宽松留白；玻璃材质继续由原封不动的 Glass Material Kit 0.5 提供。

## 连接资料模型

每条连接在 UI 原型中包含：

- 自定义连接名称
- 请求协议：OpenAI 兼容、Anthropic Messages、自定义网关
- API Base URL
- 模型 ID
- 默认连接标记

支持添加多条连接，并在预览内执行设为默认、编辑和移除。可以为同一服务建立多条连接，以便分别选择不同模型。

## 公开预览安全边界

- API Key 输入框刻意禁用，不收集、不读取、不暂存真实密钥。
- “测试连接”只显示说明，不发起网络请求。
- 连接资料只存在页面内存；不写入 localStorage、sessionStorage、URL、日志或仓库，刷新即清空。
- 不连接 Fucheers、OpenAI、Anthropic 或任何第三方服务。
- 不修改 Glass Kit 0.5 Shader、原版五项 Dock、正式 Home 仓库、Canonical、数据库或认证。

## 正式版建议接口边界

浏览器只提交非敏感配置和连接 ID；真实 API Key 应由私有服务端安全保管。服务端负责：

1. 保存和轮换密钥，避免密钥出现在浏览器存储、URL、错误响应和日志。
2. 根据协议选择适配器：OpenAI Chat Completions、Anthropic Messages 或明确注册的自定义协议。
3. 在服务端拼接请求路径、认证头、Anthropic 版本头及供应商特定字段。
4. 统一超时、限流、供应商错误和连接测试结果。
5. 仅向客户端返回脱敏后的连接名称、协议、模型和状态。

不要让公开 UI 直接持有长期 API Key，也不要把不同协议简单地当作只替换 URL 的同一种请求。

## 验收

- Room 的 `···` 打开完整 Settings 页面。
- Settings → API 与模型可以进入和返回。
- 不增加或重排五项 Dock。
- 新建、编辑、删除、设为默认在当前页面内存中工作。
- 连接测试明确告知不会发起请求。
- Node 源码检查通过；真实 Safari/iPhone 视觉、滚动与玻璃 GPU 仍需设备验证。
