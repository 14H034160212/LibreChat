#!/bin/bash

echo "=== Testing LibreChat Contract Analysis Integration ==="
echo ""

# Test 1: Check if API endpoints are accessible
echo "Test 1: Checking API route registration..."
docker exec LibreChat node -e "
const routes = require('./api/server/routes');
console.log('Contract routes available:', routes.contract ? 'YES' : 'NO');
"

echo ""
echo "Test 2: Testing Excel export with sample data..."
# Note: This test requires a valid JWT token
# For now, we'll just verify the file can be created
docker exec LibreChat node -e "
const ExcelJS = require('exceljs');
const testData = {
  has_data: true,
  charts: [
    {
      chart_type: 'bar',
      chart_title: '测试图表',
      category: '测试',
      data: [
        {label: '项目A', value: 100},
        {label: '项目B', value: 200}
      ]
    }
  ]
};

async function testExcel() {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Summary');
    worksheet.addRow(['图表标题', '类型', '数据点数量']);
    testData.charts.forEach(chart => {
      worksheet.addRow([
        chart.chart_title,
        chart.chart_type,
        chart.data.length
      ]);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    console.log('Excel generation: SUCCESS');
    console.log('Excel buffer size:', buffer.length, 'bytes');
  } catch (error) {
    console.log('Excel generation: FAILED');
    console.error(error.message);
  }
}

testExcel();
"

echo ""
echo "Test 3: Testing PDF export with sample data..."
docker exec LibreChat node -e "
const PDFDocument = require('pdfkit');
const { PassThrough } = require('stream');

async function testPDF() {
  try {
    const doc = new PDFDocument();
    const stream = new PassThrough();
    const buffers = [];

    stream.on('data', chunk => buffers.push(chunk));
    stream.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      console.log('PDF generation: SUCCESS');
      console.log('PDF buffer size:', pdfBuffer.length, 'bytes');
    });

    doc.pipe(stream);
    doc.fontSize(20).text('测试 PDF 文档', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text('这是一个测试图表');
    doc.end();
  } catch (error) {
    console.log('PDF generation: FAILED');
    console.error(error.message);
  }
}

testPDF();
"

echo ""
echo "=== Integration Test Complete ==="
echo ""
echo "Next steps:"
echo "1. Access LibreChat at http://localhost:3080"
echo "2. Upload a contract file"
echo "3. Send a message with chart data in JSON format"
echo "4. Look for the '下载 Excel' and '下载 PDF' buttons below the AI response"
