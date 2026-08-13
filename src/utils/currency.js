/**
 * Currency utilities for converting and formatting prices from base AED (د.إ)
 */

export const SUPPORTED_CURRENCIES = [
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
  { code: 'ILS', name: 'Israeli Shekel', symbol: '₪' },
  { code: 'ISK', name: 'Icelandic Króna', symbol: 'kr' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
  { code: 'PLN', name: 'Polish Złoty', symbol: 'zł' },
  { code: 'RON', name: 'Romanian Leu', symbol: 'lei' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' }
];

export const CURRENCY_SYMBOLS = SUPPORTED_CURRENCIES.reduce((acc, curr) => {
  acc[curr.code] = curr.symbol;
  return acc;
}, {});

// Fallback rates relative to 1 AED (computed at peg: 1 USD = 3.6725 AED)
export const FALLBACK_RATES = {
  AED: 1.0,
  USD: 1 / 3.6725,
  EUR: 0.87451 / 3.6725,
  GBP: 0.74419 / 3.6725,
  INR: 96.28 / 3.6725,
  CAD: 1.4023 / 3.6725,
  AUD: 1.4337 / 3.6725,
  JPY: 162.35 / 3.6725,
  CNY: 6.7775 / 3.6725,
  CHF: 0.807 / 3.6725,
  SGD: 1.2912 / 3.6725,
  HKD: 7.8402 / 3.6725,
  NZD: 1.7148 / 3.6725,
  BRL: 5.1158 / 3.6725,
  CZK: 21.167 / 3.6725,
  DKK: 6.5375 / 3.6725,
  HUF: 317.91 / 3.6725,
  IDR: 17945 / 3.6725,
  ILS: 3.047 / 3.6725,
  ISK: 125.4 / 3.6725,
  KRW: 1485.32 / 3.6725,
  MXN: 17.4837 / 3.6725,
  MYR: 4.095 / 3.6725,
  NOK: 9.6537 / 3.6725,
  PHP: 61.601 / 3.6725,
  PLN: 3.8017 / 3.6725,
  RON: 4.5829 / 3.6725,
  SEK: 9.655 / 3.6725,
  THB: 33.635 / 3.6725,
  TRY: 47.142 / 3.6725,
  ZAR: 16.5079 / 3.6725
};

/**
 * Parses a price string to extract the numerical value (assumes base is AED)
 * @param {string} priceStr 
 * @returns {number}
 */
export const getNumericPrice = (priceStr) => {
  if (priceStr === undefined || priceStr === null) return 0;
  if (typeof priceStr === 'number') return priceStr;
  const cleaned = String(priceStr).replace(/[^\d]/g, '');
  return parseInt(cleaned, 10) || 0;
};

/**
 * Converts a base AED price string to target currency and formats it beautifully
 * @param {string} aedPriceStr - Price in AED (e.g. "د.إ3,400" or "د.إ999")
 * @param {string} targetCurrency - One of the supported currency codes
 * @param {object} rates - Dynamic rates object from App state relative to AED
 * @returns {string}
 */
export const formatPrice = (aedPriceStr, targetCurrency = 'AED', rates = {}) => {
  if (!aedPriceStr) return '';
  
  const baseValue = getNumericPrice(aedPriceStr);
  
  if (targetCurrency === 'AED') {
    return `د.إ${baseValue.toLocaleString('en-US')}`;
  }
  
  // Use dynamic rates if available, otherwise fall back to static exchange rate peg
  const rate = rates?.[targetCurrency] || FALLBACK_RATES[targetCurrency] || (1 / 3.6725);
  const converted = Math.round(baseValue * rate);
  const symbol = CURRENCY_SYMBOLS[targetCurrency] || targetCurrency;
  
  // Clean formatting depending on symbol type
  if (symbol.length > 2) {
    return `${symbol} ${converted.toLocaleString('en-US')}`;
  }
  return `${symbol}${converted.toLocaleString('en-US')}`;
};

/**
 * Calculates the percentage discount between a regular price and an offer price.
 * @param {string} regularPriceStr - Compulsory regular price (e.g. "د.إ3,400")
 * @param {string} offerPriceStr - Optional offer price (e.g. "د.إ2,800")
 * @returns {number} Percentage discount (0-100)
 */
export const calculateDiscountPercentage = (regularPriceStr, offerPriceStr) => {
  if (!regularPriceStr || !offerPriceStr) return 0;
  const regular = getNumericPrice(regularPriceStr);
  const offer = getNumericPrice(offerPriceStr);
  if (regular <= 0 || offer <= 0 || offer >= regular) return 0;
  return Math.round(((regular - offer) / regular) * 100);
};

