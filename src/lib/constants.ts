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

export const iranCities: { label: string; value: string }[] = [
    { label: 'تهران', value: 'Tehran' },
    { label: 'مشهد', value: 'Mashhad' },
    { label: 'اصفهان', value: 'Isfahan' },
    { label: 'کرج', value: 'Karaj' },
    { label: 'شیراز', value: 'Shiraz' },
    { label: 'تبریز', value: 'Tabriz' },
    { label: 'قم', value: 'Qom' },
    { label: 'اهواز', value: 'Ahvaz' },
    { label: 'کرمانشاه', value: 'Kermanshah' },
    { label: 'ارومیه', value: 'Urmia' },
    { label: 'رشت', value: 'Rasht' },
    { label: 'زاهدان', value: 'Zahedan' },
    { label: 'همدان', value: 'Hamadan' },
    { label: 'کرمان', value: 'Kerman' },
    { label: 'یزد', value: 'Yazd' },
    { label: 'اردبیل', value: 'Ardabil' },
    { label: 'بندرعباس', value: 'Bandar Abbas' },
    { label: 'اراک', value: 'Arak' },
    { label: 'اسلامشهر', value: 'Eslamshahr' },
    { label: 'زنجان', value: 'Zanjan' },
    { label: 'سنندج', value: 'Sanandaj' },
    { label: 'قزوین', value: 'Qazvin' },
    { label: 'خرم‌آباد', value: 'Khorramabad' },
    { label: 'گرگان', value: 'Gorgan' },
    { label: 'ساری', value: 'Sari' },
];

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
