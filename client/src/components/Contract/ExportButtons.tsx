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
    <div className="mt-2 flex gap-2">
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

      <div className="text-xs text-gray-500 flex items-center ml-2">
        发现 {chartData.charts.length} 个图表
      </div>
    </div>
  );
};

export default ExportButtons;
