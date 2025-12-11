# 临时使用指南 - 合同图表提取功能

由于前端构建遇到一些依赖问题，这里提供一个临时的使用方法，通过浏览器控制台来实现相同的功能。

## 🚀 快速使用方法

### 步骤 1: 上传文档

1. 访问 http://localhost:3080
2. 登录 LibreChat
3. 上传您的合同文档（PDF、Word 等）

### 步骤 2: 自动分析（使用控制台脚本）

按 **F12** 打开浏览器开发者工具，切换到 **Console** 标签，粘贴以下代码并按回车：

```javascript
// 自动发送分析 prompt
(function() {
  const textarea = document.querySelector('textarea[data-testid="text-input"]');
  if (!textarea) {
    alert('请先确保在聊天页面');
    return;
  }

  const prompt = `请分析上传的文档，提取其中所有包含数字信息的内容，并按照以下 JSON 格式返回：

\`\`\`json
{
  "has_data": true,
  "charts": [
    {
      "chart_type": "bar" 或 "line",
      "chart_title": "图表标题（例如：2024年季度营收）",
      "category": "类别（例如：财务、时间表、数量、成本等）",
      "explanation": "简要说明这个图表展示的内容",
      "page_number": 页码,
      "data": [
        {"label": "标签1", "value": 数值1},
        {"label": "标签2", "value": 数值2}
      ]
    }
  ]
}
\`\`\`

**重要要求：**
1. **匿名化处理**：
   - 公司名 → [COMPANY_A], [COMPANY_B]
   - 人名 → [PERSON_A], [PERSON_B]
   - 邮箱 → [EMAIL_A], [EMAIL_B]
   - 电话 → [PHONE_A], [PHONE_B]
   - 地址 → [ADDRESS_A], [ADDRESS_B]

2. **提取规则**：
   - 逐页扫描文档
   - 提取所有包含数字的表格、列表
   - 不要遗漏任何页的数据

3. **数据格式**：
   - value 必须是纯数字
   - label 保持原文或合理缩写

请开始分析并返回完整的 JSON 数据。`;

  textarea.value = prompt;
  textarea.dispatchEvent(new Event('input', { bubbles: true }));

  setTimeout(() => {
    const submitBtn = document.querySelector('button[data-testid="send-button"]');
    if (submitBtn) {
      submitBtn.click();
      alert('分析请求已发送！请等待 AI 返回结果。');
    } else {
      const form = textarea.closest('form');
      if (form) form.requestSubmit();
    }
  }, 200);
})();
```

### 步骤 3: 等待 AI 返回结果

AI 会分析文档并返回 JSON 格式的图表数据。

### 步骤 4: 下载 Excel 和 PDF

当 AI 返回包含图表数据的 JSON 后，在控制台运行以下代码来下载文件：

```javascript
// 提取最新的 AI 回复中的图表数据
(function() {
  // 获取最后一条 AI 消息
  const messages = document.querySelectorAll('.message-content');
  const lastMessage = messages[messages.length - 1];

  if (!lastMessage) {
    alert('没有找到消息');
    return;
  }

  const messageText = lastMessage.textContent;

  // 尝试解析 JSON
  let chartData = null;
  try {
    // 移除 markdown 代码块
    let cleanText = messageText;
    const jsonMatch = cleanText.match(/```json\s*(.*?)\s*```/s) ||
                     cleanText.match(/```\s*(.*?)\s*```/s);
    if (jsonMatch) {
      cleanText = jsonMatch[1];
    }

    // 查找包含 has_data 的 JSON 对象
    const objectMatch = cleanText.match(/\{[\s\S]*"has_data"[\s\S]*\}/);
    if (objectMatch) {
      chartData = JSON.parse(objectMatch[0]);
    }
  } catch (e) {
    alert('无法解析图表数据，请确保 AI 返回了正确的 JSON 格式');
    return;
  }

  if (!chartData || !chartData.has_data) {
    alert('未找到有效的图表数据');
    return;
  }

  alert(`找到 ${chartData.charts.length} 个图表！正在下载...`);

  // 下载 Excel
  fetch('/api/contract/export/excel', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    },
    body: JSON.stringify({ chartData })
  })
  .then(r => r.blob())
  .then(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contract_analysis_${Date.now()}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
    console.log('✅ Excel 下载成功');
  })
  .catch(err => console.error('Excel 下载失败:', err));

  // 下载 PDF
  fetch('/api/contract/export/pdf', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    },
    body: JSON.stringify({ chartData })
  })
  .then(r => r.blob())
  .then(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contract_analysis_${Date.now()}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    console.log('✅ PDF 下载成功');
  })
  .catch(err => console.error('PDF 下载失败:', err));
})();
```

## 📋 完整工作流程示例

1. **上传文档** → 在 LibreChat 中上传合同文档
2. **打开控制台** → 按 F12
3. **运行脚本 1** → 自动发送分析 prompt
4. **等待 AI** → AI 分析文档并返回 JSON
5. **运行脚本 2** → 自动提取数据并下载 Excel + PDF

## 🎯 为什么要用控制台？

由于 LibreChat 使用预构建的 Docker 镜像，直接修改源代码后需要重新构建整个前端。构建过程中遇到了一些依赖问题。

使用控制台脚本是一个快速的临时解决方案，可以立即使用所有功能，无需等待重新构建。

## 🔧 后端 API 状态

后端 API 已经完全可用：
- ✅ `/api/contract/export/excel` - Excel 导出
- ✅ `/api/contract/export/pdf` - PDF 导出
- ✅ 已测试并验证通过

## 📝 测试数据

如果您想快速测试，可以让 AI 返回以下测试数据：

```json
{
  "has_data": true,
  "charts": [
    {
      "chart_type": "bar",
      "chart_title": "2024年季度营收",
      "category": "财务",
      "explanation": "各季度营收对比",
      "page_number": 1,
      "data": [
        {"label": "Q1", "value": 250000},
        {"label": "Q2", "value": 280000},
        {"label": "Q3", "value": 310000},
        {"label": "Q4", "value": 350000}
      ]
    },
    {
      "chart_type": "line",
      "chart_title": "成本趋势",
      "category": "财务",
      "explanation": "各季度成本变化",
      "page_number": 2,
      "data": [
        {"label": "Q1", "value": 180000},
        {"label": "Q2", "value": 190000},
        {"label": "Q3", "value": 200000},
        {"label": "Q4", "value": 210000}
      ]
    }
  ]
}
```

然后直接运行下载脚本即可。

## 💡 提示

- 确保在控制台中看到 "✅ Excel 下载成功" 和 "✅ PDF 下载成功" 消息
- 下载的文件会保存在浏览器的默认下载文件夹
- 文件名包含时间戳，不会互相覆盖

---

**注意**: 这是临时解决方案。完整的 UI 集成正在解决依赖问题中，完成后将提供一键式按钮操作。
