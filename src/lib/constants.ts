import type { Currency, LivePrice } from '@/lib/types';

export const currencies: Currency[] = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'IRR', name: 'Iranian Rial' },
];

export const mockExchangeRates: { [key: string]: number } = {
  'USD-EUR': 0.93,
  'USD-JPY': 157.7,
  'USD-GBP': 0.79,
  'USD-AUD': 1.51,
  'USD-CAD': 1.37,
  'USD-CHF': 0.9,
  'USD-CNY': 7.25,
  'USD-IRR': 42000.0,
  'EUR-USD': 1.07,
  'JPY-USD': 0.0063,
  'GBP-USD': 1.27,
  'AUD-USD': 0.66,
  'CAD-USD': 0.73,
  'CHF-USD': 1.11,
  'CNY-USD': 0.14,
  'IRR-USD': 0.000024,
};

export const livePrices: { [key: string]: LivePrice[] } = {
  gold: [
    { name: 'Gold Ounce', price: '2,320.55', change: 0.005, symbol: 'USD' },
    { name: 'Seke Bahar Azadi', price: '41,500,000', change: -0.012, symbol: 'IRR' },
  ],
  currencies: [
    { name: 'USD/IRR', price: '585,000', change: 0.008, symbol: 'IRR' },
    { name: 'EUR/IRR', price: '635,000', change: 0.011, symbol: 'IRR' },
  ],
  stocks: [
    { name: 'Total Index', price: '2,075,630', change: -0.0025, symbol: 'TSE' },
  ],
  crypto: [
    { name: 'Bitcoin', price: '67,500', change: 0.02, symbol: 'USD' },
    { name: 'Ethereum', price: '3,780', change: 0.035, symbol: 'USD' },
  ],
};

export const unitCategories: { [key: string]: string[] } = {
  Length: ['meter', 'kilometer', 'centimeter', 'millimeter', 'mile', 'yard', 'foot', 'inch'],
  Mass: ['kilogram', 'gram', 'milligram', 'pound', 'ounce'],
  Temperature: ['celsius', 'fahrenheit', 'kelvin'],
  Volume: ['liter', 'milliliter', 'cubic meter', 'gallon', 'quart', 'pint', 'cup'],
};

export const allUnits = Object.values(unitCategories).flat();
