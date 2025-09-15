export type Currency = {
  code: string;
  name: string;
};

export type LivePrice = {
  id: string;
  name: string;
  price: string;
  change: number; // This might not be available from the new source, default to 0
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
