import type React from 'react';

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
  icon: React.ReactNode;
};

export type PriceDataItem = {
  price: string;
  change: string | null;
}

export type PriceData = {
  GoldOunce?: PriceDataItem;
  MesghalGold?: PriceDataItem;
  Gold18K?: PriceDataItem;
  EmamiCoin?: PriceDataItem;
  Dollar?: PriceDataItem;
  USDT?: PriceDataItem;
};


export type ConversionSuggestion = {
  targetUnit: string;
  convertedValue: number;
};
