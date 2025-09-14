export type Currency = {
  code: string;
  name: string;
};

export type LivePrice = {
  name: string;
  price: string;
  change: number;
  symbol: string;
};

export type ConversionSuggestion = {
  targetUnit: string;
  convertedValue: number;
};
