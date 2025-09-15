export type Currency = {
  code: string;
  name: string;
};

export type LivePrice = {
  id: string;
  name: string;
  price: string;
  change: number;
  symbol: string;
  icon: string;
};

export type ConversionSuggestion = {
  targetUnit: string;
  convertedValue: number;
};
