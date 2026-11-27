# 决策记录

本文件是产品与设计决策的索引。每条记录包含状态、结论和必要说明。

## 已确认

| ID | 决策 | 状态 | 说明 |
|---|---|---|---|
| D-001 | 使用现有 shen-liang-home-ui-v2 作为 v2 规划与前端仓库 | CONFIRMED | 不另建新仓库 |
| D-002 | 当前先完成讨论与规划，基线完成后才正式施工 | CONFIRMED | 当前为 Phase 0 |
| D-003 | 默认主题名称为「雾蓝珍藏室」 | CONFIRMED | Mist Blue Treasure Room |
| D-004 | 使用用户提供的两套雾蓝色卡，包含日间与夜间模式 | CONFIRMED | 原始色值见 DESIGN_BASELINE.md |
| D-005 | 视觉方向融合甜美洛可可与水晶洛可可 | CONFIRMED | 加入古典拼贴、艺术化排版与拟物素材 |
| D-006 | 导航采用 B + E 组合方向 | CONFIRMED | 珍宝挂链 + 分层导航 |
| D-007 | Home 采用珍宝匣式主视觉，并向下进入生活记录内容 | CONFIRMED | 日期、待办、照片与生活片段 |
| D-008 | 日常 Chat 与 Workroom 分开 | CONFIRMED | Workroom 最终命名待确认 |
| D-009 | Reading 属于 Together | CONFIRMED | 不单独作为一级空间 |
| D-010 | 默认主题完整精致，并支持主题扩展与区域混搭 | CONFIRMED | 具体机制待设计 |
| D-011 | 不使用玫瑰轮盘 | REJECTED | 不得从生成图重新引入 |
| D-012 | 不使用珍珠装饰元素 | REJECTED | 不得从生成图重新引入 |

## 当前未决定 / 待研究

| ID | 事项 | 状态 | 说明 |
|---|---|---|---|
| R-001 | 最终技术栈与运行平台 | RESEARCH | 未选型、未初始化 |
| R-002 | Glass Material Kit 0.5 是否采用 | RESEARCH | README 曾提及，不代表已安装 |
| R-003 | Atelier 是否对应 Workroom | RESEARCH | 需要用户确认 |
| R-004 | Room 的功能范围 | DEFERRED | 不根据名称推断 |
| R-005 | 外部组件候选是否采用 | RESEARCH | 需要来源、版本和许可核验 |
| R-006 | 后端与 API 合同 | DEFERRED | 前端基线和架构讨论之后再决定 |

## 状态规则

CONFIRMED 只用于用户明确确认的决定；REJECTED 用于明确淘汰的方向；其他建议必须保留为 PROPOSED、RESEARCH、EXPERIMENT 或 DEFERRED。只有用户明确要求重新讨论，才重新打开 REJECTED 项。
