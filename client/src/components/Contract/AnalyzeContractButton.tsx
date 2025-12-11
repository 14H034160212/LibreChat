import React from 'react';
import type { TMessage } from 'librechat-data-provider';

interface AnalyzeContractButtonProps {
  message: TMessage;
}

export const AnalyzeContractButton: React.FC<AnalyzeContractButtonProps> = ({ message }) => {
  // Check if message has files (PDF, Word, etc.)
  const hasDocuments = message.files && message.files.length > 0;

  if (!hasDocuments || !message.isCreatedByUser) {
    return null;
  }

  const handleAnalyze = () => {
    // Get the conversation input element and submit button
    const textarea = document.querySelector('textarea[data-testid="text-input"]') as HTMLTextAreaElement;
    const submitButton = document.querySelector('button[data-testid="send-button"]') as HTMLButtonElement;

    if (!textarea) {
      console.error('Could not find message input');
      return;
    }

    // The comprehensive analysis prompt
    const analysisPrompt = `请分析上传的文档，提取其中所有包含数字信息的内容，并按照以下 JSON 格式返回：

\`\`\`json
{
  "has_data": true,
  "charts": [
    {
      "chart_type": "bar" 或 "line",
      "chart_title": "图表标题（例如：2024年季度营收）",
      "category": "类别（例如：财务、时间表、数量、成本等）",
      "explanation": "简要说明这个图表展示的内容",
      "page_number": 页码（如果能识别的话）,
      "data": [
        {"label": "标签1（例如：Q1、一月、项目A等）", "value": 数值1},
        {"label": "标签2", "value": 数值2}
      ]
    }
  ]
}
\`\`\`

**重要要求：**
1. **匿名化处理**：
   - 将所有公司名称替换为 [COMPANY_A], [COMPANY_B] 等
   - 将所有人名替换为 [PERSON_A], [PERSON_B] 等
   - 将所有邮箱替换为 [EMAIL_A], [EMAIL_B] 等
   - 将所有电话号码替换为 [PHONE_A], [PHONE_B] 等
   - 将所有地址替换为 [ADDRESS_A], [ADDRESS_B] 等

2. **提取规则**：
   - 逐页扫描文档
   - 提取所有包含数字的表格、列表或段落
   - 每个独立的数据集创建一个图表对象
   - 优先使用 bar (柱状图) 显示对比数据
   - 使用 line (折线图) 显示趋势数据

3. **数据格式**：
   - 所有 value 必须是纯数字（去除货币符号、单位等）
   - label 保持原文或使用合理的缩写
   - chart_title 要简洁明了

4. **完整性**：
   - 确保提取文档中**每一页**的数据
   - 不要遗漏任何包含数字的重要信息
   - 如果某页没有数据，继续检查下一页

请现在开始分析并返回完整的 JSON 数据。`;

    // Set the prompt in the textarea
    textarea.value = analysisPrompt;

    // Trigger input event to update React state
    const inputEvent = new Event('input', { bubbles: true });
    textarea.dispatchEvent(inputEvent);

    // Auto-submit after a short delay to ensure state is updated
    setTimeout(() => {
      if (submitButton && !submitButton.disabled) {
        submitButton.click();
      } else {
        // Fallback: try to find and click any submit button
        const form = textarea.closest('form');
        if (form) {
          form.requestSubmit();
        }
      }
    }, 100);
  };

  return (
    <div className="mt-2">
      <button
        onClick={handleAnalyze}
        className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        title="自动分析文档并提取图表数据"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        提取文档图表
      </button>
      <p className="mt-1 text-xs text-gray-500">
        点击后将自动分析文档并提取所有图表数据
      </p>
    </div>
  );
};

export default AnalyzeContractButton;
