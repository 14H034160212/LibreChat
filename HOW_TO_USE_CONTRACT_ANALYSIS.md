# ✅ 合同分析功能 - 完整使用指南

## 🎉 功能已完成并可用！

前端和后端已完全集成，您现在可以通过简单的几个步骤使用合同图表提取功能了！

---

## 🚀 使用方法

### 方式 1: 使用"提取文档图表"按钮（推荐）

1. **访问 LibreChat**
   ```
   http://localhost:3080
   ```

2. **登录您的账户**

3. **上传文档**
   - 点击附件图标（📎）
   - 选择您的合同文件（支持 PDF、Word 等）
   - 上传成功后，文件会显示在消息区域

4. **点击"提取文档图表"按钮**
   - 在上传的文件下方，您会看到一个蓝色的 **"提取文档图表"** 按钮
   - 点击该按钮，系统会自动：
     - 发送专业的分析 prompt 给 AI
     - 要求 AI 逐页提取文档中的所有图表数据
     - 自动进行匿名化处理

5. **等待 AI 分析**
   - AI 会分析文档并返回 JSON 格式的图表数据
   - 包含图表类型、标题、类别、数据等信息

6. **下载文件**
   - 当 AI 返回包含图表数据的 JSON 后
   - 在 AI 回复的下方会自动显示两个按钮：
     - 🟢 **下载 Excel** - 导出为 Excel 文件
     - 🔴 **下载 PDF** - 导出为 PDF 文件
   - 点击任意按钮即可下载对应格式的文件

---

### 方式 2: 使用浏览器控制台（备用方案）

如果看不到"提取文档图表"按钮，请查看 `TEMPORARY_USAGE_GUIDE.md` 文件，那里有详细的控制台脚本使用说明。

---

## 📊 AI 返回的数据格式

AI 会以以下 JSON 格式返回数据：

```json
{
  "has_data": true,
  "charts": [
    {
      "chart_type": "bar",
      "chart_title": "2024年季度营收",
      "category": "财务",
      "explanation": "展示各季度营收对比",
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
      "explanation": "各季度成本变化趋势",
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

---

## 📁 导出文件内容

### Excel 文件包含：

1. **Summary 工作表**
   - 所有图表的概览表
   - 列：图表标题、类别、类型、数据点数量、页码

2. **各图表独立工作表**
   - 每个图表一个独立的工作表
   - 包含图表元数据和详细数据表格
   - 自动调整列宽

### PDF 文件包含：

1. **标题页**
   - 文档标题："合同分析报告"
   - 生成时间
   - 检测到的图表总数

2. **图表详情页**
   - 每个图表占一页
   - 显示图表标题、类别、类型、说明
   - 以表格形式展示数据

---

## ✨ 功能特点

### ✅ 自动化
- 一键式操作，无需手动编写 prompt
- 自动发送分析请求
- 自动检测并显示下载按钮

### ✅ 匿名化
- 自动将敏感信息替换为标签：
  - 公司名 → [COMPANY_A], [COMPANY_B]
  - 人名 → [PERSON_A], [PERSON_B]
  - 邮箱 → [EMAIL_A], [EMAIL_B]
  - 电话 → [PHONE_A], [PHONE_B]
  - 地址 → [ADDRESS_A], [ADDRESS_B]

### ✅ 完整提取
- 逐页扫描文档
- 提取所有包含数字的表格和列表
- 不遗漏任何重要数据

### ✅ 多格式支持
- 同时导出 Excel 和 PDF
- Excel 便于数据处理
- PDF 便于打印和分享

---

## 🎯 完整工作流程示例

### 示例：分析销售合同

1. **准备文档**
   - 有一份包含季度销售数据的合同 PDF

2. **上传到 LibreChat**
   - 登录 → 点击附件图标 → 选择合同 PDF → 上传

3. **启动分析**
   - 看到文件缩略图后
   - 点击下方的 **"提取文档图表"** 按钮

4. **AI 处理**
   - AI 自动分析文档（约 10-30 秒）
   - 返回包含所有图表数据的 JSON

5. **查看结果**
   - AI 回复类似：
     ```
     我已分析了您的文档，提取到以下数据：

     [JSON 数据...]
     ```

6. **下载文件**
   - 在 AI 回复下方看到两个按钮
   - 点击"下载 Excel"获取 .xlsx 文件
   - 点击"下载 PDF"获取 .pdf 文件

7. **查看导出结果**
   - Excel：在浏览器下载文件夹中找到 `contract_analysis_[时间戳].xlsx`
   - PDF：在浏览器下载文件夹中找到 `contract_analysis_[时间戳].pdf`

---

## 🔧 技术实现

### 前端组件：
- ✅ `AnalyzeContractButton.tsx` - "提取文档图表"按钮
- ✅ `ExportButtons.tsx` - "下载 Excel/PDF"按钮
- ✅ `useContractAnalysis.ts` - API 调用和状态管理
- ✅ `Container.tsx` - 集成到消息显示
- ✅ `MessageRender.tsx` - 集成到 AI 回复

### 后端 API：
- ✅ `/api/contract/analyze` - 返回分析 prompt
- ✅ `/api/contract/export/excel` - 导出 Excel
- ✅ `/api/contract/export/pdf` - 导出 PDF

### 文件位置：
```
/mnt/LibreChat/
├── client/src/components/Contract/
│   ├── AnalyzeContractButton.tsx     # 分析按钮
│   ├── ExportButtons.tsx             # 导出按钮
│   └── useContractAnalysis.ts        # React Hook
├── client/src/components/Chat/Messages/
│   └── Content/Container.tsx         # 集成点
│   └── ui/MessageRender.tsx          # 集成点
└── api/server/
    ├── routes/contract.js            # 路由
    └── controllers/ContractController.js  # 控制器
```

---

## ❓ 常见问题

### Q1: 看不到"提取文档图表"按钮？
**A:** 请确保：
1. 已成功上传文档（看到文件缩略图）
2. 文档在**用户消息**中（不是 AI 消息）
3. 刷新页面后重试

### Q2: 点击按钮后没有反应？
**A:** 请：
1. 打开浏览器控制台（F12）查看是否有错误
2. 确认已登录 LibreChat
3. 尝试手动发送消息测试

### Q3: AI 没有返回 JSON 格式的数据？
**A:** 请：
1. 确认使用的是支持 JSON 输出的 AI 模型（如 GPT-4）
2. 重新点击"提取文档图表"按钮
3. 或手动发送分析 prompt

### Q4: 下载按钮没有出现？
**A:** 请确保：
1. AI 返回的是包含 `has_data: true` 的 JSON
2. JSON 格式正确（可以在控制台检查）
3. 使用备用方案（控制台脚本）

### Q5: 下载的文件是空的？
**A:** 检查：
1. AI 返回的数据格式是否正确
2. 后端 API 是否正常运行（查看容器日志）
3. 使用测试数据验证导出功能

---

## 🎓 高级使用技巧

### 技巧 1: 自定义分析 Prompt
如果需要提取特定类型的数据，可以：
1. 不点击"提取文档图表"按钮
2. 手动发送自定义 prompt
3. 确保 AI 返回的是符合格式的 JSON

### 技巧 2: 批量处理
如果有多个文档：
1. 依次上传每个文档
2. 分别点击"提取文档图表"
3. 下载对应的 Excel/PDF
4. 所有文件会用时间戳区分

### 技巧 3: 验证数据
下载前可以：
1. 查看 AI 返回的 JSON 数据
2. 手动验证提取的准确性
3. 如有错误，可以要求 AI 重新分析

---

## 📞 需要帮助？

### 检查系统状态：
```bash
# 查看容器状态
docker compose ps

# 查看后端日志
docker compose logs api --tail 50

# 测试 API 端点
curl http://localhost:3080/health
```

### 验证功能：
1. 访问 http://localhost:3080
2. 上传测试文件
3. 点击"提取文档图表"按钮
4. 等待 AI 返回结果
5. 点击下载按钮

### 查看文档：
- `INTEGRATION_COMPLETE.md` - 功能完成说明
- `TEMPORARY_USAGE_GUIDE.md` - 控制台脚本方案
- `CONTRACT_ANALYSIS_GUIDE.md` - 详细的分析指南

---

**集成完成时间**: 2025-12-11
**LibreChat 版本**: v0.8.1
**功能状态**: ✅ 完全可用
**服务地址**: http://localhost:3080
