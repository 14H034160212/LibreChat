/**
 * Enhanced PDF Processing Service
 * Provides page-by-page extraction and analysis capabilities
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * Extract text from PDF file (page by page)
 * This is a placeholder that should be integrated with the existing file service
 *
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<Array>} - Array of page objects with page_number and text
 */
async function extractPDFPageByPage(filePath) {
  try {
    // For now, return a mock structure that the frontend expects
    // In production, this should integrate with sharp/file-type libraries already available
    // or use the file content directly from the conversation context

    return [
      {
        page_number: 1,
        text: 'Page content will be extracted from uploaded PDF',
        has_tables: false
      }
    ];
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error(`PDF extraction failed: ${error.message}`);
  }
}

/**
 * Extract tables from PDF
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<Array>} - Array of table objects
 */
async function extractTablesFromPDF(filePath) {
  try {
    // Placeholder for table extraction
    // This would integrate with existing PDF processing capabilities
    return [];
  } catch (error) {
    console.error('Table extraction error:', error);
    return [];
  }
}

/**
 * Analyze PDF structure and prepare for chart extraction
 * @param {string} fileId - File ID from the system
 * @param {Object} fileMetadata - File metadata from the database
 * @returns {Promise<Object>} - Analysis result with page information
 */
async function analyzePDFStructure(fileId, fileMetadata) {
  try {
    // This function prepares the PDF for page-by-page analysis
    // It should work with the existing file service to get file content

    return {
      success: true,
      totalPages: 1, // Placeholder
      hasText: true,
      hasTables: false,
      fileSize: fileMetadata.bytes || 0
    };
  } catch (error) {
    console.error('PDF structure analysis error:', error);
    throw error;
  }
}

/**
 * Generate analysis prompt for a specific page
 * @param {number} pageNumber - Page number
 * @param {string} pageText - Text content of the page
 * @param {string} language - Language code (zh for Chinese, en for English)
 * @returns {string} - Analysis prompt
 */
function generatePageAnalysisPrompt(pageNumber, pageText, language = 'zh') {
  if (language === 'zh') {
    return `分析第 ${pageNumber} 页并提取数值数据用于可视化。

页面内容：
${pageText.substring(0, 2000)} ${pageText.length > 2000 ? '...' : ''}

查找：金额、支付、数量、百分比、指标、表格、财务数据等。

**重要：** 匿名化敏感信息：
- 公司名称 → [COMPANY_A]、[COMPANY_B] 等
- 人名 → [PERSON_A]、[PERSON_B] 等
- 邮箱 → [EMAIL_A]、[EMAIL_B] 等
- 电话 → [PHONE_A]、[PHONE_B] 等
- 地址 → [ADDRESS_A]、[ADDRESS_B] 等

返回格式（仅返回有效 JSON）：
{
  "has_data": true/false,
  "charts": [
    {
      "chart_type": "bar" 或 "line",
      "chart_title": "标题（使用通用标签）",
      "category": "财务" 或 "指标" 或 "时间线",
      "explanation": "简要说明",
      "page_number": ${pageNumber},
      "data": [{"label": "X", "value": 100}]
    }
  ]
}

如果没有数值数据：{"has_data": false}`;
  } else {
    return `Analyze page ${pageNumber} and extract numerical data for visualization.

Page content:
${pageText.substring(0, 2000)} ${pageText.length > 2000 ? '...' : ''}

Look for: amounts, payments, quantities, percentages, metrics, tables, financial data, etc.

**IMPORTANT:** Anonymize sensitive information:
- Company names → [COMPANY_A], [COMPANY_B], etc.
- Person names → [PERSON_A], [PERSON_B], etc.
- Emails → [EMAIL_A], [EMAIL_B], etc.
- Phone numbers → [PHONE_A], [PHONE_B], etc.
- Addresses → [ADDRESS_A], [ADDRESS_B], etc.

Return format (valid JSON only):
{
  "has_data": true/false,
  "charts": [
    {
      "chart_type": "bar" or "line",
      "chart_title": "title (with anonymized labels)",
      "category": "financial" or "metrics" or "timeline",
      "explanation": "brief explanation",
      "page_number": ${pageNumber},
      "data": [{"label": "X", "value": 100}]
    }
  ]
}

If no numerical data found: {"has_data": false}`;
  }
}

/**
 * Generate comprehensive analysis prompt for entire document
 * @param {string} documentText - Full document text
 * @param {string} language - Language code
 * @returns {string} - Comprehensive analysis prompt
 */
function generateComprehensiveAnalysisPrompt(documentText, language = 'zh') {
  const truncatedText = documentText.substring(0, 6000);
  const isTruncated = documentText.length > 6000;

  if (language === 'zh') {
    return `请分析上传的文档，提取其中所有包含数字信息的内容，并创建可视化图表。

文档内容${isTruncated ? '（前6000字符）' : ''}：
${truncatedText}

**重要要求：**

1. **匿名化处理**：将所有敏感信息替换为通用标签
   - 公司名称 → [COMPANY_A]、[COMPANY_B] 等
   - 人名 → [PERSON_A]、[PERSON_B] 等
   - 邮箱地址 → [EMAIL_A]、[EMAIL_B] 等
   - 电话号码 → [PHONE_A]、[PHONE_B] 等
   - 地址信息 → [ADDRESS_A]、[ADDRESS_B] 等

2. **数据提取**：识别并提取所有数值数据
   - 财务金额、支付、收入、成本
   - 数量、百分比、比率
   - 时间线数据、增长率
   - 表格中的数字信息

3. **数据格式**：返回有效的 JSON 格式（不要使用 markdown 代码块）
{
  "has_data": true/false,
  "charts": [
    {
      "chart_type": "bar" 或 "line",
      "chart_title": "图表标题（已匿名化）",
      "category": "财务" 或 "指标" 或 "时间线",
      "explanation": "数据说明（已匿名化）",
      "page_number": "N/A",
      "data": [
        {"label": "标签1（已匿名化）", "value": 数值1},
        {"label": "标签2（已匿名化）", "value": 数值2}
      ]
    }
  ]
}

4. **完整性**：确保提取所有重要的数值信息，创建 2-5 个聚焦的图表

**图表建议：**
- 每个图表最多包含 10 个数据点
- 将相关指标分组到同一图表
- 使用柱状图（bar）展示对比数据
- 使用折线图（line）展示趋势数据

如果文档中没有找到数值数据，返回：{"has_data": false, "explanation": "未找到可视化的数值数据"}`;
  } else {
    return `Please analyze the uploaded document and extract all numerical information for visualization.

Document content${isTruncated ? ' (first 6000 characters)' : ''}:
${truncatedText}

**IMPORTANT REQUIREMENTS:**

1. **Anonymization**: Replace all sensitive information with generic tags
   - Company names → [COMPANY_A], [COMPANY_B], etc.
   - Person names → [PERSON_A], [PERSON_B], etc.
   - Email addresses → [EMAIL_A], [EMAIL_B], etc.
   - Phone numbers → [PHONE_A], [PHONE_B], etc.
   - Addresses → [ADDRESS_A], [ADDRESS_B], etc.

2. **Data Extraction**: Identify and extract all numerical data
   - Financial amounts, payments, revenue, costs
   - Quantities, percentages, ratios
   - Timeline data, growth rates
   - Numerical information from tables

3. **Data Format**: Return valid JSON (no markdown code blocks)
{
  "has_data": true/false,
  "charts": [
    {
      "chart_type": "bar" or "line",
      "chart_title": "chart title (anonymized)",
      "category": "financial" or "metrics" or "timeline",
      "explanation": "data explanation (anonymized)",
      "page_number": "N/A",
      "data": [
        {"label": "label1 (anonymized)", "value": value1},
        {"label": "label2 (anonymized)", "value": value2}
      ]
    }
  ]
}

4. **Completeness**: Extract all important numerical information, create 2-5 focused charts

**Chart Guidelines:**
- Max 10 data points per chart
- Group related metrics together
- Use bar charts for comparison data
- Use line charts for trend data

If no numerical data found: {"has_data": false, "explanation": "No numerical data found for visualization"}`;
  }
}

module.exports = {
  extractPDFPageByPage,
  extractTablesFromPDF,
  analyzePDFStructure,
  generatePageAnalysisPrompt,
  generateComprehensiveAnalysisPrompt
};
