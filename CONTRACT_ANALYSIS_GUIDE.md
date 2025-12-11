# LibreChat 合同分析功能使用指南

本指南介绍如何使用 LibreChat 实现类似 contract_AI_MVP 的功能：匿名化处理、图表信息提取、以及数据导出。

## 功能概述

LibreChat 已经内置了强大的功能，我们可以直接利用这些功能来实现合同分析：

1. **文档上传** - 支持 PDF、DOCX 等格式
2. **GPT-4/GPT-5 集成** - 使用最新的 AI 模型
3. **对话导出** - 支持 JSON、Markdown、Text、CSV 格式
4. **Prompt 模板** - 自定义提示词模板

## 一、使用 LibreChat 进行合同分析

### 1. 匿名化分析

使用以下 Prompt 模板进行匿名化合同分析：

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

### 2. 图表信息提取

使用以下 Prompt 提取数值数据并生成图表配置：

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
- 将相关指标分组（例如：所有 2024 数据、所有百分比、所有估值）
- 每个图表最多 10 项以保持可读性
- 创建 2-5 个聚焦的图表而不是 1 个大图表
- 使用描述性标题解释数据代表什么
- 如果没有找到数值数据：{"has_data": false, "explanation": "未找到数值数据"}
```

### 3. 使用步骤

**步骤 1：上传合同文件**
1. 在 LibreChat 聊天界面点击"附件"图标
2. 上传 PDF 或 DOCX 格式的合同文件
3. 等待文件上传完成

**步骤 2：选择合适的模型**
1. 选择 GPT-4、GPT-5 或其他支持的模型
2. 确保模型支持文件分析功能

**步骤 3：发送分析请求**
1. 复制上面的 Prompt 模板
2. 根据需要修改 Prompt
3. 发送消息让 AI 分析合同

**步骤 4：导出结果**
1. 点击对话右上角的"导出"按钮
2. 选择导出格式（JSON、Markdown、Text、CSV）
3. 下载导出的文件

## 二、Prompt 模板库

LibreChat 支持保存自定义 Prompt 模板。以下是一些有用的模板：

### 模板 1：合同字段提取（匿名化）

```
请从以下合同中提取关键字段和信息，并提供结构化摘要。

**重要：** 在回答中将所有敏感信息替换为通用标签：
- 公司名称 → <公司名称>
- 人名 → <人名>
- 邮箱地址 → <邮箱>
- 电话号码 → <电话>
- 地址 → <地址>
- 网址 → <网址>

请按以下结构组织回答：

1. **关键字段**：列出重要的合同字段（对敏感数据使用标签）
2. **摘要**：提供简洁的执行摘要（对敏感数据使用标签）
3. **重要日期**：列出所有重要日期
4. **财务条款**：列出所有财务相关条款
5. **义务和责任**：列出双方的主要义务
6. **风险和注意事项**：指出潜在的风险点
```

### 模板 2：合同续签草稿生成（匿名化）

```
基于以下合同，生成一份专业的续签草稿。

**重要：** 在草稿中将所有敏感信息替换为通用标签：
- 公司名称 → <公司名称>
- 人名 → <人名>
- 邮箱地址 → <邮箱>
- 电话号码 → <电话>
- 地址 → <地址>
- 网址 → <网址>

原合同：
[在这里粘贴合同内容或上传文件]
```

### 模板 3：合同问答（匿名化）

```
你是一个分析合同的助手。请基于合同内容和之前的对话回答问题。

**重要：** 在回答中将所有敏感信息替换为通用标签：
- 公司名称 → <公司名称>
- 人名 → <人名>
- 邮箱地址 → <邮箱>
- 电话号码 → <电话>
- 地址 → <地址>
- 网址 → <网址>

合同：
[在这里粘贴合同内容或上传文件]

当前问题：[在这里输入你的问题]

回答：
```

### 模板 4：按页图表提取（用于 PDF）

```
分析这一页并提取数值数据用于可视化。

查找：金额、支付、数量、百分比、指标、表格等。

**重要：** 在图表标题和标签中替换敏感信息为通用标签：
- 公司名称 → <公司名称>
- 人名 → <人名>
- 邮箱 → <邮箱>，电话 → <电话>，地址 → <地址>

返回纯 JSON（不要使用 markdown）：

{
  "has_data": true/false,
  "charts": [
    {
      "chart_type": "bar" 或 "line",
      "chart_title": "标题（对敏感数据使用通用标签）",
      "explanation": "简要说明（使用通用标签）",
      "data": [{"label": "X（使用通用标签）", "value": 100}]
    }
  ]
}

指南：提取所有数值数据，将相关指标分组，创建多个聚焦的图表。
如果没有数据：{"has_data": false}
```

## 三、创建自定义 Prompt（保存模板）

在 LibreChat 中保存常用的 Prompt 模板：

1. **创建新 Prompt**：
   - 点击界面中的"Prompts"按钮
   - 点击"新建 Prompt"
   - 输入 Prompt 名称（例如："合同匿名化分析"）
   - 粘贴 Prompt 内容
   - 点击"保存"

2. **使用保存的 Prompt**：
   - 在聊天界面点击"Prompts"
   - 从列表中选择你保存的 Prompt
   - Prompt 会自动填充到输入框
   - 添加具体内容后发送

## 四、数据导出和可视化

### 导出选项

LibreChat 支持以下导出格式：

1. **JSON 格式**：包含完整的对话结构和元数据
2. **Markdown 格式**：适合文档和报告
3. **Text 格式**：纯文本格式
4. **CSV 格式**：可导入 Excel 进行进一步处理

### Excel 和 PDF 导出（手动方法）

由于 LibreChat 原生不支持 Excel 和 PDF 导出，你可以：

**方法 1：使用 CSV → Excel**
1. 在 LibreChat 中导出为 CSV 格式
2. 用 Excel 打开 CSV 文件
3. 根据需要格式化数据
4. 保存为 .xlsx 文件

**方法 2：使用图表数据 JSON**
1. 让 AI 生成图表数据的 JSON
2. 复制 JSON 数据
3. 使用在线工具（如 https://www.convertcsv.com/json-to-excel.htm）转换
4. 或使用 Python 脚本处理：

```python
import json
import pandas as pd

# 读取 AI 生成的图表数据 JSON
with open('chart_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 创建 Excel 文件
with pd.ExcelWriter('contract_analysis.xlsx', engine='openpyxl') as writer:
    # 摘要工作表
    summary_data = {
        'Chart #': [],
        'Title': [],
        'Type': [],
        'Data Points': []
    }

    for i, chart in enumerate(data['charts'], 1):
        summary_data['Chart #'].append(i)
        summary_data['Title'].append(chart['chart_title'])
        summary_data['Type'].append(chart['chart_type'])
        summary_data['Data Points'].append(len(chart['data']))

    pd.DataFrame(summary_data).to_excel(writer, sheet_name='Summary', index=False)

    # 每个图表的工作表
    for i, chart in enumerate(data['charts'], 1):
        chart_df = pd.DataFrame(chart['data'])
        sheet_name = f"Chart {i}"
        chart_df.to_excel(writer, sheet_name=sheet_name, index=False)

print("Excel 文件已生成：contract_analysis.xlsx")
```

**方法 3：PDF 导出**
1. 导出为 Markdown 格式
2. 使用工具转换为 PDF：
   - Pandoc: `pandoc conversation.md -o report.pdf`
   - 在线工具：https://www.markdowntopdf.com/
   - VS Code 插件：Markdown PDF

## 五、完整工作流程示例

### 示例：分析一份租赁合同

**步骤 1：上传文件**
- 上传 lease_agreement.pdf

**步骤 2：字段提取（使用模板 1）**
```
请从这份租赁合同中提取关键字段...
[使用上面的"合同字段提取"模板]
```

**步骤 3：提取图表数据（使用模板 4）**
```
请分析这份合同并提取所有数值数据...
[使用上面的"图表信息提取"模板]
```

**步骤 4：问答环节**
```
Q: 租金是多少？
Q: 租期是多久？
Q: 有哪些额外费用？
```

**步骤 5：导出结果**
1. 点击"导出"按钮
2. 选择 JSON 或 Markdown 格式
3. 下载文件

**步骤 6：生成 Excel/PDF（可选）**
- 使用上面提供的 Python 脚本或在线工具

## 六、高级技巧

### 1. 批量处理多份合同

创建一个系统 Prompt：
```
你是一个合同分析专家。对于每份合同，你将：
1. 提取关键字段并匿名化敏感信息
2. 生成结构化摘要
3. 识别风险和注意事项
4. 提取所有数值数据用于可视化

对所有敏感信息使用通用标签替换。
```

然后逐个上传合同并分析。

### 2. 使用 Agents（代理）功能

LibreChat 支持 Agents，可以创建专门的合同分析代理：

1. 进入"Agents"设置
2. 创建新代理："合同分析助手"
3. 设置系统提示词（使用上面的模板）
4. 配置工具（文件上传、代码执行等）
5. 保存并使用

### 3. 组合多个 Prompt

对于复杂分析，可以分步骤进行：
1. 第一轮：字段提取
2. 第二轮：图表数据提取
3. 第三轮：风险评估
4. 第四轮：生成报告

## 七、API 集成（高级）

如果你需要自动化处理，可以使用 LibreChat 的 API：

```javascript
// 示例：使用 LibreChat API 分析合同
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

// 使用示例
const prompt = `请分析这份合同并提取图表数据...`;
const result = await analyzeContract('path/to/contract.pdf', prompt);
console.log(result);
```

## 八、常见问题

**Q: LibreChat 支持哪些文件格式？**
A: PDF、DOCX、TXT、图片（PNG、JPG）等。

**Q: 如何确保数据匿名化？**
A: 在 Prompt 中明确要求 AI 替换敏感信息为通用标签。

**Q: 可以一次分析多份合同吗？**
A: 可以，但建议分别上传和分析以获得更好的结果。

**Q: 导出的数据可以编辑吗？**
A: 是的，导出为 JSON、Markdown 或 CSV 后都可以编辑。

**Q: 如何生成图表？**
A: 使用图表提取 Prompt 获取数据，然后使用 Excel、Python（matplotlib）或在线工具生成图表。

## 九、资源链接

- LibreChat 官方文档：https://www.librechat.ai/docs
- Prompt 工程指南：https://platform.openai.com/docs/guides/prompt-engineering
- Markdown to PDF：https://www.markdowntopdf.com/
- JSON to Excel：https://www.convertcsv.com/json-to-excel.htm

---

## 总结

虽然 LibreChat 不像 contract_AI_MVP 那样有专门的合同分析界面，但通过：
1. 精心设计的 Prompt 模板
2. 文件上传功能
3. 强大的 GPT 模型
4. 灵活的导出选项

你完全可以实现相同的功能，甚至更强大。关键是学会编写好的 Prompt 并利用现有工具。
