import { banks } from "./banks";

export * from './banks';

/**
 * Validates an IBAN using the ISO 13616 standard (mod-97).
 */
export function validateIBAN(iban: string): boolean {
  const clean = iban.toUpperCase().replace(/\s+/g, "");
  if (!/^IR\d{24}$/.test(clean)) return false;

  // Move the first 4 characters to the end
  const rearranged = clean.slice(4) + clean.slice(0, 4);

  // Replace letters with numbers (A=10, B=11, ..., Z=35)
  const expanded = rearranged.replace(/[A-Z]/g, ch => (ch.charCodeAt(0) - 55).toString());

  // Perform mod-97 check
  let remainder = expanded;
  let block;
  let temp = "";

  while (remainder.length > 0) {
    block = temp + remainder.substring(0, 9);
    remainder = remainder.substring(9);
    temp = (parseInt(block, 10) % 97).toString();
  }
  
  return parseInt(temp, 10) === 1;
}


export type ShebaInfo = {
    bankCode: string;
    bankName: string;
    bankLogo: string;
    accountNumber: string;
    possibleCardNumber: string | null;
}
/**
 * Converts a SHEBA number to a bank account number.
 */
export function shebaToAccountNumber(sheba: string): ShebaInfo {
  const cleanSheba = sheba.toUpperCase().replace(/IR|\s+/g, "");
  
  if (cleanSheba.length !== 24) throw new Error("شماره شبا باید 24 رقم باشد.");
  if (!/^\d+$/.test(cleanSheba)) throw new Error("شماره شبا فقط باید شامل عدد باشد.");
  
  const fullIBAN = "IR" + cleanSheba;
  if (!validateIBAN(fullIBAN)) throw new Error("شماره شبا نامعتبر است (رقم کنترلی اشتباه است).");

  const bankCode = cleanSheba.slice(2, 5);
  const rawAccount = cleanSheba.slice(5);

  const bank = banks[bankCode];
  if (!bank) throw new Error(`بانک با کد ${bankCode} پشتیبانی نمی‌شود.`);

  const accountNumber = bank.accountExtractor(rawAccount);

  let possibleCardNumber: string | null = null;
  // Some banks have a direct mapping from account to card
  if (bankCode === "056" && accountNumber.length <= 13) {
      possibleCardNumber = `60377010${accountNumber.padStart(8, '0')}`;
  }


  return {
    bankCode,
    bankName: bank.name,
    bankLogo: bank.logo,
    accountNumber,
    possibleCardNumber
  };
}

/**
 * Converts an account number to a SHEBA (IBAN).
 */
export function accountNumberToSheba(accountNumber: string, bankCode: string): string {
    const bank = banks[bankCode];
    if (!bank) throw new Error(`بانک با کد ${bankCode} پشتیبانی نمی‌شود.`);

    const cleanAccountNumber = accountNumber.replace(/\D/g, ''); // Remove non-digits
    
    // Pad the account number based on bank's format length
    const paddedAccountNumber = cleanAccountNumber.padStart(bank.shebaFormatLength || 19, '0');

    if (paddedAccountNumber.length > (bank.shebaFormatLength || 19)) {
        throw new Error(`طول شماره حساب برای این بانک (${bank.name}) نامعتبر است.`);
    }
    
    // Construct the preliminary IBAN: Bank Code + Padded Account Number + IR00
    const preliminaryIBAN = `${bankCode}${paddedAccountNumber}182700`; // 18=I, 27=R

    // Calculate check digits
    let remainder = preliminaryIBAN;
    let block;
    let temp = "";

    while (remainder.length > 0) {
      block = temp + remainder.substring(0, 9);
      remainder = remainder.substring(9);
      temp = (parseInt(block, 10) % 97).toString();
    }

    const checkDigits = 98 - parseInt(temp, 10);
    const finalCheckDigits = String(checkDigits).padStart(2, '0');

    return `IR${finalCheckDigits}${bankCode}${paddedAccountNumber}`;
}
