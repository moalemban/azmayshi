'use server';
/**
 * @fileOverview A flow to fetch and parse live prices from tgju.org.
 *
 * - fetchPrices - A function that scrapes tgju.org for live prices using Cheerio.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import axios from 'axios';
import * as cheerio from 'cheerio';
import type { PriceData } from '@/lib/types';


const URL = "https://www.tgju.org/";
const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
    "AppleWebKit/537.36 (KHTML, like Gecko) " +
    "Chrome/129.0.0.0 Safari/537.36",
};

const IDS: Record<keyof Omit<PriceData, 'Bourse' | 'BrentOil' | 'Bitcoin' | 'Ethereum' | 'Tron'>, string> = {
    GoldOunce: 'l-ons',
    MesghalGold: 'l-mesghal',
    Gold18K: 'l-geram18',
    EmamiCoin: 'l-sekee',
    Dollar: 'l-price_dollar_rl',
    USDT: 'l-crypto-tether-irr',
};

const CRYPTO_IDS: Record<keyof Pick<PriceData, 'Bitcoin' | 'Ethereum' | 'Tron'>, string> = {
    Bitcoin: "l-crypto-bitcoin-irr",
    Ethereum: "l-crypto-ethereum-irr",
    Tron: "l-crypto-tron-irr",
}


const PriceDataItemSchema = z.object({
    price: z.string(),
    change: z.string().nullable(),
});

const PriceDataSchema = z.object({
    GoldOunce: PriceDataItemSchema.optional(),
    MesghalGold: PriceDataItemSchema.optional(),
    Gold18K: PriceDataItemSchema.optional(),
    EmamiCoin: PriceDataItemSchema.optional(),
    Dollar: PriceDataItemSchema.optional(),
    USDT: PriceDataItemSchema.optional(),
    Bitcoin: PriceDataItemSchema.optional(),
    Ethereum: PriceDataItemSchema.optional(),
    Tron: PriceDataItemSchema.optional(),
});


export async function fetchPrices(): Promise<PriceData> {
  return fetchPricesFlow();
}


const fetchPricesFlow = ai.defineFlow(
    {
        name: 'fetchPricesFlow',
        outputSchema: PriceDataSchema,
    },
    async () => {
        try {
            const { data: html } = await axios.get(URL, {
                headers: HEADERS,
                timeout: 10000,
            });

            const $ = cheerio.load(html);
            const prices: PriceData = {};

            const allIds = {...IDS, ...CRYPTO_IDS};

            for (const key in allIds) {
                const typedKey = key as keyof PriceData;
                const elem_id = allIds[typedKey];
                const element = $(`li#${elem_id}`);

                if (element.length) {
                    const priceText = element.find(".info-price").text().trim().replace(/,/g, "");
                    const changeText = element.find(".info-change").text().trim().replace(/,/g, "");
                    prices[typedKey] = {
                        price: priceText,
                        change: changeText || null,
                    };
                }
            }
            return prices;
        } catch (error) {
            console.error("Failed to fetch prices from tgju.org", error);
            // On error, return an empty object, the UI will handle it.
            return {};
        }
    }
);
