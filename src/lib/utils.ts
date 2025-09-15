import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Basic number to words converter for age calculation.
export function numToWords(numStr: string): string {
    const num = parseInt(numStr.replace(/,/g, ''), 10);
    if (isNaN(num)) return '';
    if (num === 0) return 'صفر';
    if (num > 999999999999999) return 'عدد بسیار بزرگ';

    const ones = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
    const teens = ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'];
    const tens = ['', 'ده', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
    const hundreds = ['', 'یکصد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'];
    const thousands = ['', 'هزار', 'میلیون', 'میلیارد', 'تریلیون'];

    function convertGroup(n: number): string {
        if (n === 0) return '';
        const parts = [];

        const h = Math.floor(n / 100);
        if (h > 0) parts.push(hundreds[h]);
        
        const rem = n % 100;
        if (rem > 0) {
            if (rem < 10) {
                parts.push(ones[rem]);
            } else if (rem < 20) {
                parts.push(teens[rem - 10]);
            } else {
                const t = Math.floor(rem / 10);
                const o = rem % 10;
                parts.push(tens[t]);
                if (o > 0) parts.push(ones[o]);
            }
        }
        return parts.join(' و ');
    }

    if (num < 1000) {
        return convertGroup(num);
    }

    const numGroups = [];
    let tempNum = num;
    while (tempNum > 0) {
        numGroups.push(tempNum % 1000);
        tempNum = Math.floor(tempNum / 1000);
    }

    const wordGroups = numGroups.map((group, i) => {
        if (group === 0) return '';
        const groupWords = convertGroup(group);
        // Avoid adding "هزار" if it's just "یک هزار"
        if (i === 1 && group === 1) return thousands[i];
        return i > 0 ? `${groupWords} ${thousands[i]}` : groupWords;
    });

    return wordGroups.reverse().filter(g => g).join(' و ');
}
