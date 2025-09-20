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

export type CryptoPrice = {
  name_fa: string;
  name_en: string;
  symbol: string;
  icon: string | null;
  price_usdt: number;
  price_irr: number;
  change_percent: number;
  volume_24h: number;
  market_cap: number;
  last_update: string;
};

export type PriceData = {
  GoldOunce?: PriceDataItem;
  MesghalGold?: PriceDataItem;
  Gold18K?: PriceDataItem;
  EmamiCoin?: PriceDataItem;
  Dollar?: PriceDataItem;
  USDT?: PriceDataItem;
  cryptos?: CryptoPrice[];
};


export type ConversionSuggestion = {
  targetUnit: string;
  convertedValue: number;
};
