const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const { Buffer } = require('buffer');
const { createChartPage } = require('~/server/services/Contract/chartGenerator');
const { generateComprehensiveAnalysisPrompt } = require('~/server/services/Contract/pdfProcessor');

/**
 * Analyze contract and extract chart data
 * This is called when user clicks "Analyze Contract" button
 */
const analyzeContract = async (req, res) => {
  try {
    const { fileId, conversationId } = req.body;

    // Return the prompt that should be sent to the AI
    const analysisPrompt = `请分析这份合同并提取所有数值数据用于可视化。

查找：金额、支付、数量、百分比、指标、表格、财务数据等。

**重要：** 在图表标题和标签中替换敏感信息：
- 公司名称 → <公司名称>
- 人名 → <人名>
- 邮箱 → <邮箱>
- 电话 → <电话>
- 地址 → <地址>

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

指南：
- 提取文本中的所有数值数据
- 将相关指标分组
- 每个图表最多 10 项以保持可读性
- 创建 2-5 个聚焦的图表

如果没有找到数值数据：{"has_data": false, "explanation": "未找到数值数据"}`;

    res.json({
      success: true,
      prompt: analysisPrompt,
    });
  } catch (error) {
    console.error('Contract analysis error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Export chart data to Excel
 */
const exportToExcel = async (req, res) => {
  try {
    const { chartData } = req.body;

    if (!chartData || !chartData.charts || chartData.charts.length === 0) {
      return res.status(400).json({
        success: false,
        error: '没有图表数据可导出',
      });
    }

    const workbook = new ExcelJS.Workbook();

    // Create Summary sheet
    const summarySheet = workbook.addWorksheet('摘要');
    summarySheet.columns = [
      { header: '图表编号', key: 'chartNum', width: 12 },
      { header: '标题', key: 'title', width: 30 },
      { header: '类型', key: 'type', width: 12 },
      { header: '数据点数', key: 'dataPoints', width: 12 },
      { header: '来源页', key: 'sourcePage', width: 15 },
      { header: '说明', key: 'explanation', width: 40 },
    ];

    // Style the header row
    summarySheet.getRow(1).font = { bold: true };
    summarySheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDDEBF7' },
    };

    // Add summary data
    chartData.charts.forEach((chart, index) => {
      const pageInfo = chart.page_number && chart.page_number !== 'N/A'
        ? `第 ${chart.page_number} 页`
        : chart.category || 'N/A';

      summarySheet.addRow({
        chartNum: index + 1,
        title: chart.chart_title,
        type: chart.chart_type,
        dataPoints: chart.data ? chart.data.length : 0,
        sourcePage: pageInfo,
        explanation: chart.explanation || '',
      });
    });

    // Create individual sheets for each chart
    chartData.charts.forEach((chart, index) => {
      const sheetName = `图表${index + 1}`;
      const chartSheet = workbook.addWorksheet(sheetName);

      // Add chart data
      chartSheet.columns = [
        { header: '标签', key: 'label', width: 25 },
        { header: '数值', key: 'value', width: 15 },
      ];

      chartSheet.getRow(1).font = { bold: true };
      chartSheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFDDEBF7' },
      };

      if (chart.data && Array.isArray(chart.data)) {
        chart.data.forEach((item) => {
          chartSheet.addRow({
            label: item.label,
            value: item.value,
          });
        });
      }

      // Add metadata
      const metadataStartRow = chartSheet.rowCount + 3;
      chartSheet.addRow([]);
      chartSheet.addRow([]);

      const metadataSheet = [
        ['属性', '值'],
        ['图表标题', chart.chart_title],
        ['图表类型', chart.chart_type],
        ['来源页', chart.page_number && chart.page_number !== 'N/A' ? `第 ${chart.page_number} 页` : chart.category || 'N/A'],
        ['说明', chart.explanation || ''],
      ];

      metadataSheet.forEach((row) => {
        chartSheet.addRow(row);
      });

      chartSheet.getRow(metadataStartRow).font = { bold: true };
    });

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Send file with timestamp in filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=contract_analysis_${timestamp}.xlsx`);
    res.send(buffer);

  } catch (error) {
    console.error('Excel export error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Export chart data to PDF with visual charts
 */
const exportToPDF = async (req, res) => {
  try {
    const { chartData } = req.body;

    if (!chartData || !chartData.charts || chartData.charts.length === 0) {
      return res.status(400).json({
        success: false,
        error: '没有图表数据可导出',
      });
    }

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));

    // Title page
    doc.fontSize(20)
       .font('Helvetica-Bold')
       .fillColor('#2C3E50')
       .text('合同数据分析报告', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('#555555')
       .text(`生成时间: ${new Date().toLocaleString('zh-CN')}`, { align: 'center' });
    doc.moveDown(2);

    // Summary section
    doc.fontSize(16)
       .font('Helvetica-Bold')
       .fillColor('#2C3E50')
       .text('图表摘要', { underline: true });
    doc.moveDown();
    doc.fontSize(10)
       .font('Helvetica')
       .fillColor('#333333')
       .text(`共生成 ${chartData.charts.length} 个图表\n`);

    // List all charts with source info
    chartData.charts.forEach((chart, index) => {
      const pageInfo = chart.page_number && chart.page_number !== 'N/A'
        ? `第 ${chart.page_number} 页`
        : chart.category || '通用';
      doc.fontSize(10)
         .fillColor('#555555')
         .text(`${index + 1}. ${pageInfo}: ${chart.chart_title}`);
    });

    // Create visual chart pages
    chartData.charts.forEach((chart, index) => {
      createChartPage(doc, chart, index + 1);
    });

    doc.end();

    // Wait for PDF to be generated
    await new Promise((resolve) => {
      doc.on('end', resolve);
    });

    const pdfBuffer = Buffer.concat(buffers);

    // Send file with timestamp in filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=contract_analysis_${timestamp}.pdf`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  analyzeContract,
  exportToExcel,
  exportToPDF,
};
