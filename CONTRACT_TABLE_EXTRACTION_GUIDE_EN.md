# 📊 Contract Table Extraction Feature Guide

## Feature Overview

LibreChat now includes powerful document analysis and chart extraction capabilities that can automatically extract numerical data from uploaded PDF and Word documents, and export them as Excel spreadsheets or PDF files with visualized charts.

### ✨ Key Features

1. **Intelligent Data Extraction**
   - Automatically identifies all numerical data in documents
   - Supports tables, lists, and numerical information in paragraphs
   - Smart categorization (financial, metrics, timeline, etc.)

2. **Privacy Protection (Anonymization)**
   - Automatically detects and replaces sensitive information
   - Company names → [COMPANY_A], [COMPANY_B]
   - Person names → [PERSON_A], [PERSON_B]
   - Emails, phone numbers, addresses automatically anonymized

3. **Multi-Format Export**
   - **Excel**: Multi-sheet format with summary and detailed data
   - **PDF**: Contains visualized bar charts and line graphs

4. **Visual Preview**
   - Online preview of detected chart information
   - View chart types, data point counts, source page numbers, etc.

---

## 🚀 Usage Steps

### Step 1: Upload Document

1. Click the attachment icon (📎) in the chat interface
2. Select a PDF or Word document to upload
3. Wait for the file upload to complete

### Step 2: Extract Chart Data

Below the uploaded document message, a blue button will appear:

```
[📊 Extract Document Charts]
```

After clicking this button:
- The system automatically generates an analysis prompt
- AI analyzes the entire document and extracts all numerical data
- Extraction includes automatic anonymization

**Estimated time**: Typically 10-60 seconds depending on document size

### Step 3: View Extraction Results

After AI returns results, buttons will appear below the message:

```
[Download Excel] [Download PDF] [Preview Charts]
Detected X charts
```

### Step 4: Preview Charts (Optional)

Click the **[Preview Charts]** button to view:
- Chart titles and types (bar/line)
- Data categories and source page numbers
- Number of data points
- Chart descriptions

### Step 5: Export Data

**Excel Export**:
1. Click the green **[Download Excel]** button
2. File downloads automatically, containing:
   - **Summary worksheet**: Overview of all charts
   - **Chart1, Chart2...**: Detailed data and metadata for each chart

**PDF Export**:
1. Click the red **[Download PDF]** button
2. File downloads automatically, containing:
   - **Cover page**: Report title and generation time
   - **Summary page**: List of all charts
   - **Chart pages**: One page per chart with visualized bar/line graphs

---

## 📋 Excel File Structure

### Summary Worksheet
| Column | Description |
|--------|-------------|
| Chart Number | Chart sequence (1, 2, 3...) |
| Title | Chart title |
| Type | bar (bar chart) or line (line chart) |
| Data Points | Number of data items |
| Source Page | Original document page number or category |
| Description | Chart description text |

### Chart Worksheets (one per chart)
**Data Section**:
| Label | Value |
|-------|-------|
| Q1 2024 | 150000 |
| Q2 2024 | 200000 |
| ... | ... |

**Metadata Section** (below data):
| Property | Value |
|----------|-------|
| Chart Title | 2024 Quarterly Revenue |
| Chart Type | bar |
| Source Page | Page 3 |
| Description | Shows 2024 quarterly revenue growth trend |

---

## 📄 PDF File Structure

### Page 1: Cover
- Report title: **Contract Data Analysis Report**
- Generation time

### Page 2: Summary
- Total number of charts
- Chart list (number, source page, title)

### Pages 3+: Visualized Charts (one per page)
Each chart page contains:

**1. Chart Information**
- Source page notation (top right)
- Chart title (bold)

**2. Visualization**
- **Bar Chart**: Blue bars with values displayed on top
- **Line Chart**: Red line and data points with labeled values

**3. Details**
- Chart type indicator
- Chart description text (bottom)

---

## 🔒 Privacy Protection (Auto-Anonymization)

The system automatically detects and replaces the following sensitive information:

| Type | Detection Pattern | Replaced With |
|------|------------------|---------------|
| Company Names | XX Inc., XX LLC, XX Ltd., XX Corp., etc. | [COMPANY_A], [COMPANY_B]... |
| Person Names | Mr./Mrs./Dr. + Name | [PERSON_A], [PERSON_B]... |
| Emails | user@domain.com | [EMAIL_A], [EMAIL_B]... |
| Phone Numbers | +1-234-567-8900, (123) 456-7890 | [PHONE_A], [PHONE_B]... |
| Addresses | Street address patterns | [ADDRESS_A], [ADDRESS_B]... |
| URLs | http://..., https://... | [URL_A], [URL_B]... |

**Note**: Numerical data (amounts, quantities, etc.) is not anonymized as it is core to the analysis.

---

## 💡 Best Practices

### 1. Document Preparation
- ✅ Ensure PDF is text-based (not scanned images)
- ✅ Tables should have clear titles and column names
- ✅ Numbers should use standard formats (avoid special characters)

### 2. Extraction Optimization
- 📄 For large documents (>50 pages), consider uploading in segments
- 🔍 If initial extraction is suboptimal, re-extract or manually supplement prompts
- 📊 Complex charts should be manually verified for data accuracy

### 3. Result Verification
- 👀 Use "Preview Charts" feature to quickly check extraction results
- ✏️ If data is missing, ask AI to supplement in the conversation
- 📝 Verify anonymization meets requirements before exporting

---

## 🛠️ Technical Implementation

### Backend Services
- **ContractController**: Handles analysis requests and export operations
- **pdfProcessor**: PDF page extraction and prompt generation
- **chartGenerator**: Visual chart drawing (PDFKit)
- **anonymize**: Sensitive information detection and replacement

### Frontend Components
- **AnalyzeContractButton**: Blue button that triggers analysis
- **ExportButtons**: Excel/PDF export and preview controls
- **useContractAnalysis**: React Hook for API calls

### API Endpoints
```
POST /api/contract/analyze     - Get analysis prompt
POST /api/contract/export/excel - Export Excel
POST /api/contract/export/pdf   - Export PDF
```

---

## ❓ FAQ

### Q: Why weren't some charts detected?
**A**: Possible reasons:
1. Non-standard data format (e.g., numbers written as text)
2. Chart is in a scanned document (OCR not enabled)
3. Too few data points (<2 data points)

**Solution**: Explicitly tell the AI which page has data in the conversation for re-extraction.

### Q: Can I manually edit exported charts?
**A**: Yes!
- **Excel**: Edit data and create charts directly in Excel
- **PDF**: Use PDF editing tools to modify after export

### Q: Can anonymization be disabled?
**A**: The current version has anonymization enabled by default. For original data:
1. Specify "keep all original information" in the prompt
2. Or manually replace anonymization tags after export

### Q: What document formats are supported?
**A**:
- ✅ PDF (text-based)
- ✅ Word (.docx)
- ⚠️ Scanned PDFs require OCR (future version)
- ❌ Image formats (JPG, PNG)

### Q: What if Excel/PDF export fails?
**A**: Check:
1. Is the AI-returned data format correct (should contain JSON)?
2. Is network connection stable?
3. Are there errors in browser console?
4. Try refreshing page and re-exporting

---

## 🔄 Version History

### v1.0 (Current)
- ✅ Basic chart extraction functionality
- ✅ Excel and PDF export
- ✅ Automatic anonymization
- ✅ Chart preview feature
- ✅ Visual chart generation

### Planned Features (v1.1)
- 🔜 Page-by-page analysis at the page level
- 🔜 OCR support for scanned documents
- 🔜 More chart types (pie charts, scatter plots)
- 🔜 Batch document processing
- 🔜 Custom anonymization rules

---

## 📞 Support

If you encounter issues or have improvement suggestions:
1. Check the FAQ section in this document
2. Ask AI in the chat
3. Submit a GitHub Issue (if applicable)

---

**Enjoy!** 🎉
