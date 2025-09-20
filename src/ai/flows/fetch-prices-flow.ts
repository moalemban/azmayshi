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
import type { PriceData, PriceDataItem } from '@/lib/types';


const URL = "https://www.tgju.org/";
const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
    "AppleWebKit/537.36 (KHTML, like Gecko) " +
    "Chrome/129.0.0.0 Safari/537.36",
};

const IDS: Record<keyof Omit<PriceData, 'Bourse' | 'BrentOil' | 'cryptos'>, string> = {
    GoldOunce: 'l-ons',
    MesghalGold: 'l-mesghal',
    Gold18K: 'l-geram18',
    EmamiCoin: 'l-sekee',
    Dollar: 'l-price_dollar_rl',
    USDT: 'l-crypto-tether-irr',
};

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
});


export async function fetchPrices(): Promise<Omit<PriceData, 'cryptos'>> {
  return fetchPricesFlow();
}


const fetchPricesFlow = ai.defineFlow(
    {
        name: 'fetchPricesFlow',
        outputSchema: PriceDataSchema,
    },
    async () => {
        try {
            const mainPage = await axios.get(URL, { headers: HEADERS, timeout: 10000 });
            
            const $ = cheerio.load(mainPage.data);
            const prices: Omit<PriceData, 'cryptos'> = {};

            for (const key in IDS) {
                const typedKey = key as keyof typeof IDS;
                const elem_id = IDS[typedKey];
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
            return {};
        }
    }
);
