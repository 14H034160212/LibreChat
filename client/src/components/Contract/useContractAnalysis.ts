import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

interface ChartDataItem {
  label: string;
  value: number;
}

interface ChartInfo {
  chart_type: 'bar' | 'line';
  chart_title: string;
  category?: string;
  explanation?: string;
  page_number?: number | string;
  data: ChartDataItem[];
}

interface ChartData {
  has_data: boolean;
  charts: ChartInfo[];
}

/**
 * Hook for contract analysis and export
 */
export const useContractAnalysis = () => {
  const [chartData, setChartData] = useState<ChartData | null>(null);

  // Export to Excel
  const exportExcelMutation = useMutation({
    mutationFn: async (data: ChartData) => {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/contract/export/excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ chartData: data }),
      });

      if (!response.ok) {
        throw new Error('Excel export failed');
      }

      const blob = await response.blob();
      return blob;
    },
    onSuccess: (blob) => {
      // Download the file
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contract_analysis_${Date.now()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
  });

  // Export to PDF
  const exportPdfMutation = useMutation({
    mutationFn: async (data: ChartData) => {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/contract/export/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ chartData: data }),
      });

      if (!response.ok) {
        throw new Error('PDF export failed');
      }

      const blob = await response.blob();
      return blob;
    },
    onSuccess: (blob) => {
      // Download the file
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contract_analysis_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
  });

  const exportToExcel = (data: ChartData) => {
    exportExcelMutation.mutate(data);
  };

  const exportToPdf = (data: ChartData) => {
    exportPdfMutation.mutate(data);
  };

  // Try to parse chart data from message text
  const parseChartData = (text: string): ChartData | null => {
    try {
      // Remove markdown code blocks if present
      let cleanText = text.trim();
      if (cleanText.includes('```json')) {
        const match = cleanText.match(/```json\s*(.*?)\s*```/s);
        if (match) {
          cleanText = match[1];
        }
      } else if (cleanText.includes('```')) {
        const match = cleanText.match(/```\s*(.*?)\s*```/s);
        if (match) {
          cleanText = match[1];
        }
      }

      // Try to find JSON object
      const jsonMatch = cleanText.match(/\{[\s\S]*"has_data"[\s\S]*\}/);
      if (!jsonMatch) {
        return null;
      }

      const data = JSON.parse(jsonMatch[0]);

      // Validate structure
      if (
        typeof data.has_data === 'boolean' &&
        Array.isArray(data.charts)
      ) {
        return data as ChartData;
      }

      return null;
    } catch (error) {
      console.error('Failed to parse chart data:', error);
      return null;
    }
  };

  return {
    chartData,
    setChartData,
    parseChartData,
    exportToExcel,
    exportToPdf,
    isExportingExcel: exportExcelMutation.isPending,
    isExportingPdf: exportPdfMutation.isPending,
    exportExcelError: exportExcelMutation.error,
    exportPdfError: exportPdfMutation.error,
  };
};

export default useContractAnalysis;
