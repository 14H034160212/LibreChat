import React, { useEffect, useState } from 'react';
import { useContractAnalysis } from './useContractAnalysis';

interface ExportButtonsProps {
  messageText: string;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({ messageText }) => {
  const {
    parseChartData,
    exportToExcel,
    exportToPdf,
    isExportingExcel,
    isExportingPdf,
  } = useContractAnalysis();

  const [chartData, setChartData] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    // Try to parse chart data from message
    const data = parseChartData(messageText);
    if (data && data.has_data && data.charts && data.charts.length > 0) {
      setChartData(data);
    }
  }, [messageText, parseChartData]);

  if (!chartData) {
    return null;
  }

  return (
    <div className="mt-3">
      <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={() => exportToExcel(chartData)}
        disabled={isExportingExcel}
        className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="导出为 Excel"
      >
        {isExportingExcel ? (
          <span className="flex items-center gap-1">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            生成中...
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            下载 Excel
          </span>
        )}
      </button>

      <button
        onClick={() => exportToPdf(chartData)}
        disabled={isExportingPdf}
        className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="导出为 PDF"
      >
        {isExportingPdf ? (
          <span className="flex items-center gap-1">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            生成中...
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            下载 PDF
          </span>
        )}
      </button>

        <button
          onClick={() => setShowPreview(!showPreview)}
          className="rounded-md bg-gray-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
          title={showPreview ? '隐藏预览' : '查看图表预览'}
        >
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {showPreview ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              )}
            </svg>
            {showPreview ? '隐藏预览' : '预览图表'}
          </span>
        </button>

        <div className="text-xs text-gray-500 flex items-center">
          检测到 {chartData.charts.length} 个图表
        </div>
      </div>

      {/* Chart Preview Section */}
      {showPreview && (
        <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            图表预览
          </h4>
          <div className="space-y-3">
            {chartData.charts.map((chart: any, index: number) => (
              <div
                key={index}
                className="p-3 bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium">
                        {index + 1}
                      </span>
                      <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {chart.chart_title}
                      </h5>
                    </div>
                    <div className="flex gap-3 text-xs text-gray-600 dark:text-gray-400 ml-8">
                      <span className="inline-flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                        </svg>
                        {chart.chart_type === 'bar' ? '柱状图' : '折线图'}
                      </span>
                      {chart.category && (
                        <span>
                          分类: {chart.category}
                        </span>
                      )}
                      {chart.page_number && chart.page_number !== 'N/A' && (
                        <span>
                          页码: {chart.page_number}
                        </span>
                      )}
                      <span>
                        {chart.data?.length || 0} 个数据点
                      </span>
                    </div>
                    {chart.explanation && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 ml-8">
                        {chart.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            💡 提示: 点击下载按钮可将图表导出为 Excel 表格或包含可视化图表的 PDF 文件
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportButtons;
