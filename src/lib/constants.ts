import type { Currency, LivePrice } from '@/lib/types';

export const currencies: Currency[] = [
  { code: 'USD', name: 'دلار آمریکا' },
  { code: 'EUR', name: 'یورو' },
  { code: 'IRR', name: 'ریال ایران' },
  { code: 'GBP', name: 'پوند بریتانیا' },
  { code: 'JPY', name: 'ین ژاپن' },
  { code: 'AUD', name: 'دلار استرالیا' },
  { code: 'CAD', name: 'دلار کانادا' },
  { code: 'CHF', name: 'فرانک سوئیس' },
  { code: 'CNY', name: 'یوان چین' },
];

export const mockExchangeRates: { [key: string]: number } = {
  // Rates against USD
  'USD-EUR': 0.93,
  'USD-JPY': 157.7,
  'USD-GBP': 0.79,
  'USD-AUD': 1.51,
  'USD-CAD': 1.37,
  'USD-CHF': 0.9,
  'USD-CNY': 7.25,
  'USD-IRR': 590000, // Updated market rate

  // Inverse rates can be calculated, but some common ones can be pre-defined
  'EUR-USD': 1.075,
  'GBP-USD': 1.265,
  'IRR-USD': 1 / 590000,
};

export const livePrices: { [key: string]: LivePrice[] } = {
  gold: [
    { name: 'انس طلا', price: '2,320.55', change: 0.005, symbol: 'USD' },
    { name: 'سکه امامی', price: '41,500,000', change: -0.012, symbol: 'IRR' },
    { name: 'گرم طلا ۱۸ عیار', price: '3,745,000', change: 0.008, symbol: 'IRR' },
  ],
  currencies: [
    { name: 'دلار بازار', price: '590,000', change: 0.008, symbol: 'IRR' },
    { name: 'یورو بازار', price: '642,000', change: 0.011, symbol: 'IRR' },
    { name: 'درهم امارات', price: '160,800', change: 0.005, symbol: 'IRR' },
  ],
  stocks: [
    { name: 'شاخص کل بورس', price: '2,075,630', change: -0.0025, symbol: 'واحد' },
    { name: 'شاخص هم‌وزن', price: '675,120', change: 0.001, symbol: 'واحد' },
  ],
  crypto: [
    { name: 'بیت‌کوین', price: '67,500', change: 0.02, symbol: 'USDT' },
    { name: 'اتریوم', price: '3,780', change: 0.035, symbol: 'USDT' },
    { name: 'تتر', price: '59,100', change: 0.001, symbol: 'IRR' },
  ],
};

export const unitCategories: { [key: string]: string[] } = {
  'طول': ['meter', 'kilometer', 'centimeter', 'millimeter', 'mile', 'yard', 'foot', 'inch'],
  'جرم': ['kilogram', 'gram', 'milligram', 'pound', 'ounce'],
  'دما': ['celsius', 'fahrenheit', 'kelvin'],
  'حجم': ['liter', 'milliliter', 'cubic meter', 'gallon', 'quart', 'pint', 'cup'],
};

export const allUnits = Object.values(unitCategories).flat();
