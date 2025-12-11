/**
 * Contract Anonymization Service
 * Detects and anonymizes sensitive information in text
 */

/**
 * Anonymize sensitive information in text
 * @param {string} text - The text to anonymize
 * @returns {string} - Anonymized text
 */
function anonymizeText(text) {
  if (!text || typeof text !== 'string') {
    return text;
  }

  let anonymized = text;

  // Company name patterns (with legal suffixes)
  const companyPatterns = [
    /\b[A-Z][A-Za-z0-9\s&\-]{1,50}?\s+(?:Inc\.?|LLC\.?|Ltd\.?|Limited|Corp\.?|Corporation|Company|Co\.?)\b/gi,
    /\b[A-Z][A-Za-z0-9\s&\-]{1,50}?\s+(?:B\.S\.C\.|W\.L\.L\.|S\.P\.C\.)\s*(?:\([^)]+\))?\b/gi,
    /\b[A-Z][A-Za-z0-9\s&\-]{1,50}?\s+(?:GmbH|AG|PLC|S\.A\.|S\.p\.A\.|N\.V\.|B\.V\.)\b/gi,
  ];

  companyPatterns.forEach((pattern) => {
    anonymized = anonymized.replace(pattern, '{{COMPANY}}');
  });

  // Phone number patterns
  const phonePatterns = [
    /\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g,
    /\(\d{3}\)\s*\d{3}[-.\s]?\d{4}/g,
    /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/g,
  ];

  phonePatterns.forEach((pattern) => {
    anonymized = anonymized.replace(pattern, '{{PHONE}}');
  });

  // Email pattern
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi;
  anonymized = anonymized.replace(emailPattern, '{{EMAIL}}');

  // URL pattern
  const urlPattern = /https?:\/\/[^\s]+/gi;
  anonymized = anonymized.replace(urlPattern, '{{URL}}');

  // Person name with title pattern
  const titleNamePattern = /\b(?:Mr|Mrs|Ms|Dr|Prof)\.?\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g;
  anonymized = anonymized.replace(titleNamePattern, '{{NAME}}');

  // Address pattern (basic)
  const addressPattern =
    /\d+\s+[A-Z][a-z]+\s+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Circle|Cir|Way|Place|Pl)\b/gi;
  anonymized = anonymized.replace(addressPattern, '{{ADDRESS}}');

  // Social Security Number pattern (US)
  const ssnPattern = /\b\d{3}-\d{2}-\d{4}\b/g;
  anonymized = anonymized.replace(ssnPattern, '{{SSN}}');

  // Credit card pattern (basic)
  const creditCardPattern = /\b(?:\d{4}[-\s]?){3}\d{4}\b/g;
  anonymized = anonymized.replace(creditCardPattern, '{{CREDIT_CARD}}');

  // Date of birth pattern (various formats)
  const dobPatterns = [
    /\b(?:0?[1-9]|1[0-2])\/(?:0?[1-9]|[12]\d|3[01])\/(?:19|20)\d{2}\b/g, // MM/DD/YYYY
    /\b(?:0?[1-9]|[12]\d|3[01])\/(?:0?[1-9]|1[0-2])\/(?:19|20)\d{2}\b/g, // DD/MM/YYYY
  ];

  dobPatterns.forEach((pattern) => {
    // Only replace if it looks like a DOB (year in reasonable range)
    anonymized = anonymized.replace(pattern, (match) => {
      const year = parseInt(match.split('/')[2], 10);
      if (year >= 1920 && year <= 2020) {
        return '{{DOB}}';
      }
      return match;
    });
  });

  // Bank account pattern (basic)
  const bankAccountPattern = /\b\d{8,17}\b/g;
  anonymized = anonymized.replace(bankAccountPattern, (match) => {
    // Only replace if it's likely a bank account (8-17 digits)
    if (match.length >= 8 && match.length <= 17) {
      return '{{ACCOUNT_NUMBER}}';
    }
    return match;
  });

  return anonymized;
}

/**
 * Apply anonymization to chart data
 * @param {Object} chartData - Chart data object
 * @returns {Object} - Anonymized chart data
 */
function anonymizeChartData(chartData) {
  if (!chartData || typeof chartData !== 'object') {
    return chartData;
  }

  const anonymized = JSON.parse(JSON.stringify(chartData)); // Deep clone

  if (anonymized.chart_title) {
    anonymized.chart_title = anonymizeText(anonymized.chart_title);
  }

  if (anonymized.explanation) {
    anonymized.explanation = anonymizeText(anonymized.explanation);
  }

  if (Array.isArray(anonymized.data)) {
    anonymized.data = anonymized.data.map((item) => ({
      ...item,
      label: anonymizeText(item.label),
    }));
  }

  if (Array.isArray(anonymized.labels)) {
    anonymized.labels = anonymized.labels.map((label) => anonymizeText(label));
  }

  return anonymized;
}

module.exports = {
  anonymizeText,
  anonymizeChartData,
};
