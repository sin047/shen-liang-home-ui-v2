# shen-liang-home-ui-v2

**项目代号：雾蓝珍藏室（Mist Blue Treasure Room）**

> 一个以艺术化导航、日夜主题和清晰空间分区为核心的个人 AI 家园前端项目。

## 当前阶段

**Phase 0 — Design & Planning**

当前只进行产品讨论、视觉研究、设计基线整理和工程规划。尚未批准正式前端施工，也没有锁定技术栈、后端方案或部署方式。

## 已确认的方向

- 默认主题为「雾蓝珍藏室」，包含日间与夜间两套配色。
- 视觉方向融合甜美洛可可、水晶洛可可、古典拼贴、艺术化排版与拟物素材。
- 导航采用 B + E 的组合思路：珍宝挂链的物件感与分层导航结构结合。
- 首页以洛可可珍宝匣式主视觉为方向，并支持向下浏览日常记录、日期、待办、照片与生活片段。
- 日常 Chat 与 Workroom 分开；Reading 属于 Together。
- 默认主题本身完整精致，同时为后续主题扩展和区域混搭留出能力。
- 不采用玫瑰轮盘，不使用珍珠装饰元素。

完整口径以 [决策记录](docs/DECISIONS.md)、[产品说明](docs/planning/PRODUCT.md) 和 [设计基线](docs/design/DESIGN_BASELINE.md) 为准。

## 文档导航

- [文档总览](docs/README.md)
- [项目指令与施工边界](AGENTS.md)
- [当前交接快照](docs/HANDOFF.md)
- [产品说明](docs/planning/PRODUCT.md)
- [功能矩阵](docs/planning/FEATURE_MATRIX.md)
- [路线图](docs/planning/ROADMAP.md)
- [待确认问题](docs/planning/OPEN_QUESTIONS.md)
- [设计基线](docs/design/DESIGN_BASELINE.md)
- [导航方案](docs/design/NAVIGATION.md)
- [主题系统](docs/design/THEME_SYSTEM.md)
- [材质系统](docs/design/MATERIAL_SYSTEM.md)
- [视觉参考](docs/design/VISUAL_REFERENCES.md)
- [素材使用规范](docs/design/ASSET_GUIDE.md)
- [教程研究笔记](docs/research/TUTORIAL_NOTES.md)
- [已知风险与踩坑清单](docs/research/KNOWN_PITFALLS.md)
- [组件候选库](docs/research/COMPONENT_CANDIDATES.md)
- [架构规划](docs/engineering/ARCHITECTURE.md)
- [质量验收基线](docs/engineering/QA_BASELINE.md)
- [决策记录](docs/DECISIONS.md)
- [变更日志](docs/CHANGELOG.md)

## 仓库边界

- 本仓库只负责 v2 前端项目的规划与后续前端工作。
- 旧版家园仓库与 UI playground 保持独立；未经明确授权，不修改、不迁移、不覆盖它们。
- 当前仓库尚无应用源码。README 初始描述中提到的 Glass Material Kit 0.5、Mobile-first、PWA-first 均视为待核实的项目起始信息，不等于已经安装依赖或锁定架构。
- 当前仓库为公开仓库。禁止提交密钥、个人聊天原文、私人数据、未获授权的付费素材原件或其他不适合公开的信息。

## 工作原则

先讨论并确认，再形成设计规格；先有可验收的设计基线，再开始施工。任何未由用户确认的建议都必须保留为提案或研究项，不得擅自升级为决定。
