# LibreChat 合同分析功能

本项目在 LibreChat 基础上添加了合同分析功能，实现了类似 contract_AI_MVP 的核心特性：

- ✅ **匿名化处理** - 自动识别和替换敏感信息
- ✅ **图表信息提取** - 从合同中提取数值数据并生成图表配置
- ✅ **Excel 导出** - 将图表数据导出为 Excel 文件
- ✅ **PDF 导出** - 生成包含图表的 PDF 报告
- ✅ **GPT-4/GPT-5 集成** - 使用最新的 AI 模型进行分析

## 快速开始

### 1. 安装和运行 LibreChat

详细的安装和运行指南请参考：**[QUICK_START_CN.md](QUICK_START_CN.md)**

**快速启动（Docker）：**

```bash
# 克隆仓库（如果还没有）
cd /mnt/LibreChat

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，添加你的 OPENAI_API_KEY

# 启动服务
docker compose up -d

# 访问 http://localhost:3080
```

### 2. 使用合同分析功能

详细的使用指南请参考：**[CONTRACT_ANALYSIS_GUIDE.md](CONTRACT_ANALYSIS_GUIDE.md)**

**基本工作流程：**

1. **上传合同文件**
   - 在 LibreChat 聊天界面点击"附件"图标
   - 上传 PDF 或 DOCX 格式的合同

2. **使用 Prompt 模板分析**
   - 使用预定义的 Prompt 模板（见下文）
   - 让 AI 分析合同并提取信息

3. **导出结果**
   - 导出为 JSON 格式
   - 使用 `export_charts.py` 脚本生成 Excel 和 PDF

## 主要功能

### 功能 1：匿名化分析

使用以下 Prompt 进行匿名化分析：

```
请分析以下合同内容，并在回答中将所有敏感信息替换为通用标签：

**替换规则：**
- 公司名称 → <公司名称>
- 人名 → <人名>
- 邮箱地址 → <邮箱>
- 电话号码 → <电话>
- 地址 → <地址>
- 网址 → <网址>

请提取合同的关键字段和重要信息，并提供结构化摘要。
```

### 功能 2：图表信息提取

使用以下 Prompt 提取图表数据：

```
请分析这份合同并提取所有数值数据用于可视化。

查找：金额、支付、数量、百分比、指标、表格、财务数据等。

**重要：** 在图表标题和标签中替换敏感信息：
- 公司名称 → <公司名称>
- 人名 → <人名>
- 邮箱 → <邮箱>，电话 → <电话>，地址 → <地址>

请以以下 JSON 格式返回（不要使用 markdown 代码块）：

{
  "has_data": true/false,
  "charts": [
    {
      "chart_type": "bar" 或 "line",
      "chart_title": "标题（使用通用标签替换敏感数据）",
      "category": "财务" 或 "指标" 或 "时间线",
      "explanation": "简要说明（使用通用标签）",
      "data": [{"label": "X（使用通用标签）", "value": 100}]
    }
  ]
}

**指南：**
- 提取文本中的所有数值数据
- 将相关指标分组
- 每个图表最多 10 项以保持可读性
- 创建 2-5 个聚焦的图表而不是 1 个大图表
```

### 功能 3：Excel 和 PDF 导出

**步骤：**

1. 将 AI 生成的 JSON 数据保存为文件（如 `chart_data.json`）

2. 安装 Python 依赖：

```bash
pip install pandas openpyxl matplotlib
```

3. 运行导出脚本：

```bash
python export_charts.py chart_data.json
```

4. 生成的文件：
   - `chart_data.xlsx` - Excel 文件（包含摘要和所有图表）
   - `chart_data.pdf` - PDF 报告（包含可视化图表）

**测试示例：**

```bash
# 使用提供的示例数据测试
python export_charts.py example_chart_data.json

# 查看生成的文件
ls -lh example_chart_data.xlsx example_chart_data.pdf
```

## 文件说明

| 文件 | 说明 |
|------|------|
| `QUICK_START_CN.md` | LibreChat 快速启动指南（中文） |
| `CONTRACT_ANALYSIS_GUIDE.md` | 合同分析功能详细使用指南 |
| `export_charts.py` | 图表数据导出脚本（生成 Excel 和 PDF） |
| `example_chart_data.json` | 示例图表数据文件（用于测试） |
| `CONTRACT_ANALYSIS_README.md` | 本文件 |
| `api/server/services/Contract/anonymize.js` | 匿名化服务（后端，可选） |

## 完整示例工作流程

### 示例：分析一份销售合同

**步骤 1：启动 LibreChat**

```bash
docker compose up -d
# 访问 http://localhost:3080
```

**步骤 2：上传合同**
- 在聊天界面上传 `sales_contract.pdf`

**步骤 3：提取字段（Prompt 1）**

```
请从这份销售合同中提取关键字段和信息，并提供结构化摘要。

**重要：** 在回答中将所有敏感信息替换为通用标签：
- 公司名称 → <公司名称>
- 人名 → <人名>
- 邮箱地址 → <邮箱>
- 电话号码 → <电话>
- 地址 → <地址>

请按以下结构组织回答：
1. 关键字段
2. 执行摘要
3. 重要日期
4. 财务条款
5. 义务和责任
6. 风险和注意事项
```

**步骤 4：提取图表数据（Prompt 2）**

```
请分析这份合同并提取所有数值数据用于可视化。
[使用上面的图表提取 Prompt]
```

**步骤 5：保存 JSON 数据**

AI 返回的 JSON 复制到 `sales_contract_charts.json` 文件。

**步骤 6：生成 Excel 和 PDF**

```bash
python export_charts.py sales_contract_charts.json
```

**步骤 7：查看结果**

- `sales_contract_charts.xlsx` - Excel 文件
- `sales_contract_charts.pdf` - PDF 报告

## 与 contract_AI_MVP 的对比

| 功能 | contract_AI_MVP | LibreChat 方案 |
|------|-----------------|----------------|
| **匿名化** | ✅ 内置自动检测 | ✅ 通过 Prompt 实现 |
| **图表提取** | ✅ 内置 UI | ✅ 通过 Prompt + 脚本 |
| **Excel 导出** | ✅ 一键导出 | ✅ 通过脚本导出 |
| **PDF 导出** | ✅ 一键导出 | ✅ 通过脚本导出 |
| **多模型支持** | ❌ 仅 OpenAI | ✅ OpenAI、Anthropic、Google 等 |
| **文件管理** | ❌ 无历史记录 | ✅ 完整的对话历史 |
| **协作功能** | ❌ 单用户 | ✅ 多用户、分享对话 |
| **自定义扩展** | ❌ 受限 | ✅ 插件、Agents、API |
| **部署** | 🟡 简单（Streamlit） | 🟡 中等（Docker/Node.js） |

## 高级用法

### 创建自定义 Prompt 模板

在 LibreChat 中保存常用的 Prompt：

1. 点击界面中的"Prompts"按钮
2. 点击"新建 Prompt"
3. 输入名称（如："合同图表提取"）
4. 粘贴 Prompt 内容
5. 保存

以后可以直接从列表中选择使用。

### 使用 Agents 功能

创建专门的合同分析 Agent：

1. 进入"Agents"设置
2. 创建新 Agent："合同分析助手"
3. 设置系统提示词（使用上面的模板）
4. 配置工具（文件上传等）
5. 保存并使用

### API 自动化

如果需要批量处理合同，可以使用 LibreChat 的 API：

```javascript
const axios = require('axios');

async function analyzeContract(fileUrl, prompt) {
  const response = await axios.post('http://localhost:3080/api/messages', {
    endpoint: 'openAI',
    model: 'gpt-5-turbo',
    files: [{ url: fileUrl }],
    text: prompt,
  }, {
    headers: {
      'Authorization': 'Bearer YOUR_JWT_TOKEN',
      'Content-Type': 'application/json'
    }
  });

  return response.data;
}
```

## 常见问题

**Q: 为什么不直接在 LibreChat 中添加专门的合同分析界面？**

A: LibreChat 的设计理念是通用性和灵活性。通过 Prompt 工程，我们可以实现相同的功能，同时保持代码库的简洁。这也使得功能更容易维护和更新。

**Q: 匿名化效果如何？是否可靠？**

A: 基于 Prompt 的匿名化依赖于 AI 模型的能力。GPT-4 和 GPT-5 在这方面表现很好，但不是 100% 完美。对于高度敏感的数据，建议：
1. 在上传前手动预处理
2. 多次验证 AI 的输出
3. 使用后端的 `anonymize.js` 服务进行额外处理（如果需要）

**Q: 可以处理多大的合同文件？**

A: 取决于模型的上下文窗口：
- GPT-4 Turbo: 128K tokens（约 500 页）
- GPT-5: 支持更大的上下文
- 对于超大文件，建议分页处理

**Q: 导出的图表可以自定义吗？**

A: 可以。你可以修改 `export_charts.py` 脚本来自定义：
- 图表颜色和样式
- PDF 布局
- Excel 格式
- 添加公司 logo 等

**Q: 是否支持其他语言的合同？**

A: 是的。只需将 Prompt 模板翻译成对应的语言即可。LibreChat 支持多语言界面。

## 后续改进计划

- [ ] 创建 LibreChat 插件版本（更集成的体验）
- [ ] 添加更多图表类型（饼图、散点图等）
- [ ] 实现批量合同对比分析
- [ ] 添加合同模板库
- [ ] 集成电子签名功能

## 贡献

欢迎提交问题和改进建议！

## 许可证

本扩展遵循 LibreChat 的 MIT 许可证。

## 资源链接

- **LibreChat 官方文档**：https://www.librechat.ai/docs
- **LibreChat GitHub**：https://github.com/danny-avila/LibreChat
- **OpenAI Prompt Engineering**：https://platform.openai.com/docs/guides/prompt-engineering

---

**开发者**: LibreChat Community
**最后更新**: 2025-12-11

祝你使用愉快！ 🎉
