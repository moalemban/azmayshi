import type { Currency, LivePrice } from '@/lib/types';

export const currencies: Currency[] = [
  { code: 'IRT', name: 'تومان ایران' },
  { code: 'IRR', name: 'ریال ایران' },
  { code: 'USD', name: 'دلار آمریکا' },
  { code: 'EUR', name: 'یورو' },
  { code: 'GBP', name: 'پوند بریتانیا' },
  { code: 'JPY', name: 'ین ژاپن' },
  { code: 'AUD', name: 'دلار استرالیا' },
  { code: 'CAD', name: 'دلار کانادا' },
  { code: 'CHF', name: 'فرانک سوئیس' },
  { code: 'CNY', name: 'یوان چین' },
];

export const mockExchangeRates: { [key: string]: number } = {
  // Rates against USD
  'USD-IRR': 590000, 
  'USD-EUR': 0.93,
  'USD-JPY': 157.7,
  'USD-GBP': 0.79,
  'USD-AUD': 1.51,
  'USD-CAD': 1.37,
  'USD-CHF': 0.9,
  'USD-CNY': 7.25,
};


export const livePrices: { [key: string]: LivePrice[] } = {
  gold: [
    { name: 'سکه امامی', price: '41,500,000', change: -0.012, symbol: 'IRR', id: 'sekkeh' },
    { name: 'گرم طلا ۱۸ عیار', price: '3,745,000', change: 0.008, symbol: 'IRR', id: 'gold-18' },
  ],
  currencies: [
    { name: 'دلار بازار', price: '59,000', change: 0.008, symbol: 'IRT', id: 'usd-market' },
    { name: 'یورو بازار', price: '64,200', change: 0.011, symbol: 'IRT', id: 'eur-market' },
    { name: 'درهم امارات', price: '16,080', change: 0.005, symbol: 'IRT', id: 'aed-market' },
  ],
  stocks: [
    { name: 'شاخص کل بورس', price: '2,075,630', change: -0.0025, symbol: 'واحد', id: 'bourse-total' },
    { name: 'شاخص هم‌وزن', price: '675,120', change: 0.001, symbol: 'واحد', id: 'bourse-hamvazn' },
  ],
  crypto: [],
};

export const unitCategories: { [key: string]: string[] } = {
  length: ['meter', 'kilometer', 'centimeter', 'millimeter', 'mile', 'yard', 'foot', 'inch'],
  mass: ['kilogram', 'gram', 'milligram', 'pound', 'ounce'],
  temperature: ['celsius', 'fahrenheit', 'kelvin'],
  volume: ['liter', 'milliliter', 'cubic-meter', 'gallon', 'quart', 'pint', 'cup'],
};

export const unitNames = {
    'طول': {
        meter: 'متر (meter)',
        kilometer: 'کیلومتر (kilometer)',
        centimeter: 'سانتی‌متر (centimeter)',
        millimeter: 'میلی‌متر (millimeter)',
        mile: 'مایل (mile)',
        yard: 'یارد (yard)',
        foot: 'فوت (foot)',
        inch: 'اینچ (inch)',
    },
    'جرم': {
        kilogram: 'کیلوگرم (kilogram)',
        gram: 'گرم (gram)',
        milligram: 'میلی‌گرم (milligram)',
        pound: 'پوند (pound)',
        ounce: 'اونس (ounce)',
    },
    'دما': {
        celsius: 'سلسیوس (celsius)',
        fahrenheit: 'فارنهایت (fahrenheit)',
        kelvin: 'کلوین (kelvin)',
    },
    'حجم': {
        liter: 'لیتر (liter)',
        milliliter: 'میلی‌لیتر (milliliter)',
        'cubic-meter': 'متر مکعب (cubic meter)',
        gallon: 'گالن (gallon)',
        quart: 'کوارت (quart)',
        pint: 'پاینت (pint)',
        cup: 'فنجان (cup)',
    }
};

export const allUnits = Object.values(unitCategories).flat();
