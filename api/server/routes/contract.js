const express = require('express');
const { requireJwtAuth } = require('~/server/middleware');
const { analyzeContract, exportToExcel, exportToPDF } = require('~/server/controllers/ContractController');

const router = express.Router();

// Apply JWT authentication to all routes
router.use(requireJwtAuth);

/**
 * POST /api/contract/analyze
 * Analyze a contract and extract chart data
 */
router.post('/analyze', analyzeContract);

/**
 * POST /api/contract/export/excel
 * Export chart data to Excel
 */
router.post('/export/excel', exportToExcel);

/**
 * POST /api/contract/export/pdf
 * Export chart data to PDF
 */
router.post('/export/pdf', exportToPDF);

module.exports = router;
