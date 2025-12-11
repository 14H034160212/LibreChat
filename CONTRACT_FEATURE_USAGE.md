# 合同分析功能使用指南

## 🎯 功能说明

我已经在 LibreChat 中添加了合同分析功能的后端 API。现在你可以通过 API 调用来分析合同并导出 Excel 和 PDF。

## 📡 后端 API 端点

### 1. 分析合同
```
POST /api/contract/analyze
```

**请求体：**
```json
{
  "fileId": "文件ID",
  "conversationId": "对话ID"
}
```

**响应：**
```json
{
  "success": true,
  "prompt": "...自动生成的分析 prompt..."
}
```

### 2. 导出 Excel
```
POST /api/contract/export/excel
```

**请求体：**
```json
{
  "chartData": {
    "has_data": true,
    "charts": [
      {
        "chart_type": "bar",
        "chart_title": "标题",
        "category": "类别",
        "explanation": "说明",
        "data": [
          {"label": "标签1", "value": 100},
          {"label": "标签2", "value": 200}
        ]
      }
    ]
  }
}
```

**响应：** Excel 文件下载

### 3. 导出 PDF
```
POST /api/contract/export/pdf
```

**请求体：** 同上

**响应：** PDF 文件下载

## 🔧 如何使用（临时方案）

由于前端集成需要重新构建前端代码，这里是一个临时的使用方法：

### 方法 1：使用浏览器控制台

1. **在 LibreChat 上传合同并让 AI 分析**
2. **打开浏览器开发者工具（F12）**
3. **在 Console 中运行以下代码：**

```javascript
// 假设 AI 返回的 JSON 数据存储在这里
const chartData = {
  "has_data": true,
  "charts": [
    {
      "chart_type": "bar",
      "chart_title": "2024年季度营收",
      "category": "财务",
      "explanation": "展示各季度营收情况",
      "data": [
        {"label": "Q1", "value": 250000},
        {"label": "Q2", "value": 280000},
        {"label": "Q3", "value": 310000},
        {"label": "Q4", "value": 350000}
      ]
    }
  ]
};

// 导出 Excel
fetch('/api/contract/export/excel', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  },
  body: JSON.stringify({ chartData })
})
.then(response => response.blob())
.then(blob => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'contract_analysis.xlsx';
  a.click();
});

// 导出 PDF
fetch('/api/contract/export/pdf', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  },
  body: JSON.stringify({ chartData })
})
.then(response => response.blob())
.then(blob => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'contract_analysis.pdf';
  a.click();
});
```

### 方法 2：使用 Postman 或 cURL

```bash
# 获取 Token（从浏览器的 localStorage 中）
# 在浏览器控制台运行：console.log(localStorage.getItem('token'))

# 导出 Excel
curl -X POST http://localhost:3080/api/contract/export/excel \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d @chart_data.json \
  -o contract_analysis.xlsx

# 导出 PDF
curl -X POST http://localhost:3080/api/contract/export/pdf \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d @chart_data.json \
  -o contract_analysis.pdf
```

## 🎨 前端集成（需要的工作）

要在 UI 中添加按钮，需要：

1. **创建前端组件**：
   - `client/src/components/Contract/AnalyzeButton.tsx`
   - `client/src/components/Contract/ExportButtons.tsx`

2. **添加 API 调用**：
   - `client/src/data-provider/mutations.ts`
   - 添加 `useAnalyzeContract` 和 `useExportContract` hooks

3. **集成到消息界面**：
   - 修改 `client/src/components/Messages/Message.tsx`
   - 在消息工具栏添加导出按钮

4. **重新构建前端**：
   ```bash
   cd /mnt/LibreChat
   npm run frontend
   ```

## 📝 完整工作流程示例

1. **在 LibreChat 上传合同文件**
2. **发送 Prompt**（或调用 `/api/contract/analyze` 获取自动生成的 prompt）
3. **AI 返回 JSON 格式的图表数据**
4. **复制 JSON 数据**
5. **使用浏览器控制台或 Postman 调用导出 API**
6. **下载生成的 Excel 和 PDF 文件**

## 🚀 下一步

如果你需要完整的 UI 集成，我可以：

1. 创建完整的前端组件
2. 添加"分析合同"按钮到文件上传后的界面
3. 添加"下载 Excel"和"下载 PDF"按钮到 AI 响应后
4. 重新构建前端代码

需要我继续完成前端集成吗？
