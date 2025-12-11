/**
 * Chart Generation Service for PDF Exports
 * Creates visual charts using PDFKit drawing capabilities
 */

/**
 * Draw a bar chart on a PDF document
 * @param {PDFDocument} doc - PDFKit document instance
 * @param {Array} labels - Chart labels
 * @param {Array} values - Chart values
 * @param {Object} options - Chart options
 */
function drawBarChart(doc, labels, values, options = {}) {
  const {
    x = 50,
    y = 200,
    width = 500,
    height = 250,
    title = 'Bar Chart',
    color = '#4A90E2',
    showValues = true,
    showGrid = true
  } = options;

  // Calculate dimensions
  const chartArea = {
    x: x + 60,
    y: y + 40,
    width: width - 80,
    height: height - 80
  };

  // Find max value for scaling
  const maxValue = Math.max(...values, 1);
  const valueScale = chartArea.height / maxValue;
  const barWidth = chartArea.width / labels.length * 0.7;
  const barSpacing = chartArea.width / labels.length;

  // Draw title
  doc.fontSize(14)
     .font('Helvetica-Bold')
     .text(title, x, y, { width: width, align: 'center' });

  // Draw grid lines if enabled
  if (showGrid) {
    doc.strokeColor('#E0E0E0');
    for (let i = 0; i <= 5; i++) {
      const gridY = chartArea.y + (chartArea.height / 5) * i;
      doc.moveTo(chartArea.x, gridY)
         .lineTo(chartArea.x + chartArea.width, gridY)
         .stroke();

      // Draw value labels on left
      const gridValue = Math.round((maxValue / 5) * (5 - i));
      doc.fontSize(8)
         .fillColor('#666666')
         .text(gridValue.toString(), x + 5, gridY - 4, { width: 50, align: 'right' });
    }
  }

  // Draw Y axis
  doc.strokeColor('#333333')
     .moveTo(chartArea.x, chartArea.y)
     .lineTo(chartArea.x, chartArea.y + chartArea.height)
     .stroke();

  // Draw X axis
  doc.moveTo(chartArea.x, chartArea.y + chartArea.height)
     .lineTo(chartArea.x + chartArea.width, chartArea.y + chartArea.height)
     .stroke();

  // Draw bars
  labels.forEach((label, index) => {
    const value = values[index];
    const barHeight = value * valueScale;
    const barX = chartArea.x + (index * barSpacing) + (barSpacing - barWidth) / 2;
    const barY = chartArea.y + chartArea.height - barHeight;

    // Draw bar
    doc.fillColor(color)
       .rect(barX, barY, barWidth, barHeight)
       .fill();

    // Draw value on top of bar if enabled
    if (showValues && barHeight > 15) {
      doc.fontSize(8)
         .fillColor('#FFFFFF')
         .text(
           value.toString(),
           barX,
           barY + 5,
           { width: barWidth, align: 'center' }
         );
    } else if (showValues) {
      // If bar too short, draw value above
      doc.fontSize(8)
         .fillColor('#333333')
         .text(
           value.toString(),
           barX,
           barY - 12,
           { width: barWidth, align: 'center' }
         );
    }

    // Draw label below X axis
    doc.fontSize(8)
       .fillColor('#333333')
       .text(
         label.length > 15 ? label.substring(0, 12) + '...' : label,
         barX - 10,
         chartArea.y + chartArea.height + 10,
         { width: barWidth + 20, align: 'center' }
       );
  });

  return chartArea.y + chartArea.height + 40; // Return next Y position
}

/**
 * Draw a line chart on a PDF document
 * @param {PDFDocument} doc - PDFKit document instance
 * @param {Array} labels - Chart labels
 * @param {Array} values - Chart values
 * @param {Object} options - Chart options
 */
function drawLineChart(doc, labels, values, options = {}) {
  const {
    x = 50,
    y = 200,
    width = 500,
    height = 250,
    title = 'Line Chart',
    lineColor = '#E74C3C',
    pointColor = '#C0392B',
    showPoints = true,
    showValues = true,
    showGrid = true
  } = options;

  // Calculate dimensions
  const chartArea = {
    x: x + 60,
    y: y + 40,
    width: width - 80,
    height: height - 80
  };

  // Find max value for scaling
  const maxValue = Math.max(...values, 1);
  const valueScale = chartArea.height / maxValue;
  const pointSpacing = chartArea.width / (labels.length - 1 || 1);

  // Draw title
  doc.fontSize(14)
     .font('Helvetica-Bold')
     .text(title, x, y, { width: width, align: 'center' });

  // Draw grid lines if enabled
  if (showGrid) {
    doc.strokeColor('#E0E0E0');
    for (let i = 0; i <= 5; i++) {
      const gridY = chartArea.y + (chartArea.height / 5) * i;
      doc.moveTo(chartArea.x, gridY)
         .lineTo(chartArea.x + chartArea.width, gridY)
         .stroke();

      // Draw value labels on left
      const gridValue = Math.round((maxValue / 5) * (5 - i));
      doc.fontSize(8)
         .fillColor('#666666')
         .text(gridValue.toString(), x + 5, gridY - 4, { width: 50, align: 'right' });
    }
  }

  // Draw Y axis
  doc.strokeColor('#333333')
     .moveTo(chartArea.x, chartArea.y)
     .lineTo(chartArea.x, chartArea.y + chartArea.height)
     .stroke();

  // Draw X axis
  doc.moveTo(chartArea.x, chartArea.y + chartArea.height)
     .lineTo(chartArea.x + chartArea.width, chartArea.y + chartArea.height)
     .stroke();

  // Calculate points
  const points = values.map((value, index) => ({
    x: chartArea.x + (labels.length === 1 ? chartArea.width / 2 : index * pointSpacing),
    y: chartArea.y + chartArea.height - (value * valueScale)
  }));

  // Draw line
  if (points.length > 1) {
    doc.strokeColor(lineColor)
       .lineWidth(2.5);

    doc.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      doc.lineTo(points[i].x, points[i].y);
    }
    doc.stroke();
  }

  // Draw points and values
  points.forEach((point, index) => {
    if (showPoints) {
      // Draw point
      doc.fillColor(pointColor)
         .circle(point.x, point.y, 4)
         .fill();
    }

    if (showValues) {
      // Draw value above point
      doc.fontSize(9)
         .fillColor('#333333')
         .text(
           values[index].toString(),
           point.x - 15,
           point.y - 20,
           { width: 30, align: 'center' }
         );
    }

    // Draw label below X axis
    doc.fontSize(8)
       .fillColor('#333333')
       .text(
         labels[index].length > 15 ? labels[index].substring(0, 12) + '...' : labels[index],
         point.x - 30,
         chartArea.y + chartArea.height + 10,
         { width: 60, align: 'center' }
       );
  });

  return chartArea.y + chartArea.height + 40; // Return next Y position
}

/**
 * Draw chart based on type
 * @param {PDFDocument} doc - PDFKit document instance
 * @param {Object} chartData - Chart data object
 * @param {Object} options - Chart options
 * @returns {number} - Next Y position
 */
function drawChart(doc, chartData, options = {}) {
  const { chart_type, data, labels: directLabels, values: directValues } = chartData;

  // Extract labels and values
  const labels = directLabels || (data ? data.map(d => d.label) : []);
  const values = directValues || (data ? data.map(d => parseFloat(d.value) || 0) : []);

  if (labels.length === 0 || values.length === 0) {
    return options.y || 200; // Return original Y if no data
  }

  if (chart_type === 'line') {
    return drawLineChart(doc, labels, values, options);
  } else {
    // Default to bar chart
    return drawBarChart(doc, labels, values, options);
  }
}

/**
 * Create a visual chart page in PDF
 * @param {PDFDocument} doc - PDFKit document instance
 * @param {Object} chartData - Chart data object with metadata
 * @param {number} chartIndex - Index of the chart (for numbering)
 */
function createChartPage(doc, chartData, chartIndex) {
  const {
    chart_title = `图表 ${chartIndex}`,
    chart_type = 'bar',
    category,
    explanation,
    page_number,
    data,
    labels,
    values
  } = chartData;

  // Add new page (except for first chart)
  if (chartIndex > 1) {
    doc.addPage();
  }

  // Draw page number info if available
  let currentY = 50;
  if (page_number && page_number !== 'N/A') {
    doc.fontSize(10)
       .fillColor('#666666')
       .text(`来源: 第 ${page_number} 页`, 50, currentY, { align: 'right' });
    currentY += 20;
  }

  // Draw chart
  const nextY = drawChart(doc, chartData, {
    x: 50,
    y: currentY,
    width: 500,
    height: 300,
    title: chart_title,
    color: chart_type === 'bar' ? '#4A90E2' : undefined,
    lineColor: chart_type === 'line' ? '#E74C3C' : undefined
  });

  // Draw category if available
  if (category) {
    doc.fontSize(10)
       .fillColor('#666666')
       .text(`分类: ${category}`, 50, nextY + 10);
    currentY = nextY + 30;
  } else {
    currentY = nextY + 10;
  }

  // Draw explanation if available
  if (explanation) {
    doc.fontSize(11)
       .fillColor('#333333')
       .font('Helvetica-Bold')
       .text('说明:', 50, currentY);

    doc.fontSize(10)
       .font('Helvetica')
       .fillColor('#555555')
       .text(explanation, 50, currentY + 20, { width: 500, align: 'left' });
  }
}

module.exports = {
  drawBarChart,
  drawLineChart,
  drawChart,
  createChartPage
};
