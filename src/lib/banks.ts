export type BankInfo = {
  name: string;
  logo: string;
  accountExtractor: (raw: string) => string;
};

export const banks: Record<string, BankInfo> = {
  "010": { name: "مرکزی", logo: "https://uploadkon.ir/uploads/dd2d19_25Bank-Markazi-Iran-logo-limo.png", accountExtractor: r => r },
  "011": { name: "صنعت و معدن", logo: "https://uploadkon.ir/uploads/6b9f19_25sanat-madan.png", accountExtractor: r => r.replace(/^0+/, "") },
  "012": { name: "ملت", logo: "https://uploadkon.ir/uploads/f81419_251200px-Bank_Mellat_logo.png", accountExtractor: r => r.replace(/^0+/, "") },
  "013": { name: "رفاه کارگران", logo: "https://uploadkon.ir/uploads/b92819_25refah.png", accountExtractor: r => r.replace(/^0+/, "") },
  "014": { name: "مسکن", logo: "https://uploadkon.ir/uploads/b7c219_25maskan.png", accountExtractor: r => r.replace(/^0+/, "") },
  "015": { name: "سپه", logo: "https://uploadkon.ir/uploads/627619_25bank-sepah.png", accountExtractor: r => r.replace(/^0+/, "") },
  "016": { name: "کشاورزی", logo: "https://uploadkon.ir/uploads/7a5219_25keshavarzi.png", accountExtractor: r => r.replace(/^0+/, "") },
  "017": { name: "ملی ایران", logo: "https://uploadkon.ir/uploads/b3d419_25Melli-Bank-logo.png", accountExtractor: r => r.replace(/^0+/, "") },
  "018": { name: "تجارت", logo: "https://uploadkon.ir/uploads/d88319_25tejarat.png", accountExtractor: r => r.replace(/^0+/, "") },
  "019": { name: "صادرات", logo: "https://uploadkon.ir/uploads/403f19_25saderat.png", accountExtractor: r => r.replace(/^0+/, "") },
  "020": { name: "توسعه صادرات", logo: "https://uploadkon.ir/uploads/9b4019_25tose-saderat.png", accountExtractor: r => r.replace(/^0+/, "") },
  "021": { name: "پست بانک", logo: "https://uploadkon.ir/uploads/0f3319_25post-bank.png", accountExtractor: r => r.replace(/^0+/, "") },
  "022": { name: "توسعه تعاون", logo: "https://uploadkon.ir/uploads/183119_25tose-taavon.png", accountExtractor: r => r.replace(/^0+/, "") },
  "051": { name: "موسسه اعتباری توسعه", logo: "https://uploadkon.ir/uploads/834919_25etebari-tose.png", accountExtractor: r => r.replace(/^0+/, "") },
  "053": { name: "کارآفرین", logo: "https://uploadkon.ir/uploads/74d519_25karafarin.png", accountExtractor: r => r.replace(/^0+/, "") },
  "054": { name: "سامان", logo: "https://uploadkon.ir/uploads/2f5319_25saman.png", accountExtractor: r => r.replace(/^0+/, "") },
  "055": { name: "اقتصاد نوین", logo: "https://uploadkon.ir/uploads/1b2419_25eghtesad-novin.png", accountExtractor: r => r.replace(/^0+/, "") },
  "056": { name: "پارسیان", logo: "https://uploadkon.ir/uploads/e45719_25parsian.png", accountExtractor: r => r.replace(/^0+/, "") },
  "057": { name: "پاسارگاد", logo: "https://uploadkon.ir/uploads/f81419_251200px-Bank_Mellat_logo.png", accountExtractor: r => r },
  "058": { name: "سرمایه", logo: "https://uploadkon.ir/uploads/a80d19_25sarmayeh.png", accountExtractor: r => r.replace(/^0+/, "") },
  "059": { name: "سینا", logo: "https://uploadkon.ir/uploads/237c19_25sina.png", accountExtractor: r => r.replace(/^0+/, "") },
  "060": { name: "مهر ایران", logo: "https://uploadkon.ir/uploads/e3cb19_25mehr-iran.png", accountExtractor: r => r.replace(/^0+/, "") },
  "061": { name: "شهر", logo: "https://uploadkon.ir/uploads/170b19_25shahr.png", accountExtractor: r => r.replace(/^0+/, "") },
  "062": { name: "آینده", logo: "https://uploadkon.ir/uploads/0a7619_25ayande.png", accountExtractor: r => r.replace(/^0+/, "") },
  "063": { name: "انصار", logo: "https://uploadkon.ir/uploads/907a19_25ansar.png", accountExtractor: r => r.replace(/^0+/, "") },
  "064": { name: "گردشگری", logo: "https://uploadkon.ir/uploads/b70a19_25gardeshgari.png", accountExtractor: r => r.replace(/^0+/, "") },
  "065": { name: "حکمت ایرانیان", logo: "https://uploadkon.ir/uploads/31a219_25hekmat-iranian.png", accountExtractor: r => r.replace(/^0+/, "") },
  "066": { name: "دی", logo: "https://uploadkon.ir/uploads/a83619_25dey.png", accountExtractor: r => r.replace(/^0+/, "") },
  "069": { name: "ایران زمین", logo: "https://uploadkon.ir/uploads/a5ec19_25iran-zamin.png", accountExtractor: r => r.replace(/^0+/, "") },
  "070": { name: "رسالت", logo: "https://uploadkon.ir/uploads/9b4419_25resalat.png", accountExtractor: r => r.replace(/^0+/, "") },
  "078": { name: "خاورمیانه", logo: "https://uploadkon.ir/uploads/9d2019_25khavarmiane.png", accountExtractor: r => r.replace(/^0+/, "") },
  "079": { name: "مهر اقتصاد", logo: "https://uploadkon.ir/uploads/c97b19_25mehr-eghtesad.png", accountExtractor: r => r.replace(/^0+/, "") },
  "095": { name: "ملی", logo: "https://uploadkon.ir/uploads/b3d419_25Melli-Bank-logo.png", accountExtractor: r => r.replace(/^0+/, "") },
};
