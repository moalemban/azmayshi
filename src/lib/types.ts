export type Currency = {
  code: string;
  name: string;
};

export type LivePrice = {
  id: string;
  name: string;
  price: string;
  change: string | null;
  symbol: string;
  icon: string;
};

export type PriceData = {
  Bourse?: string;
  GoldOunce?: string;
  MesghalGold?: string;
  Gold18K?: string;
  EmamiCoin?: string;
  Dollar?: string;
  BrentOil?: string;
  USDT?: string;
};


export type ConversionSuggestion = {
  targetUnit: string;
  convertedValue: number;
};
