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
import type { PriceData, CryptoPrice, PriceDataItem } from '@/lib/types';


const URL = "https://www.tgju.org/";
const CRYPTO_URL = "https://www.tgju.org/crypto";
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

const CryptoPriceSchema = z.object({
  name_fa: z.string(),
  name_en: z.string(),
  symbol: z.string(),
  icon: z.string().nullable(),
  price_usdt: z.number(),
  price_irr: z.number(),
  change_percent: z.number(),
  volume_24h: z.number(),
  market_cap: z.number(),
  last_update: z.string(),
});

const PriceDataSchema = z.object({
    GoldOunce: PriceDataItemSchema.optional(),
    MesghalGold: PriceDataItemSchema.optional(),
    Gold18K: PriceDataItemSchema.optional(),
    EmamiCoin: PriceDataItemSchema.optional(),
    Dollar: PriceDataItemSchema.optional(),
    USDT: PriceDataItemSchema.optional(),
    cryptos: z.array(CryptoPriceSchema).optional(),
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
            const [mainPage, cryptoPage] = await Promise.all([
                axios.get(URL, { headers: HEADERS, timeout: 10000 }),
                axios.get(CRYPTO_URL, { headers: HEADERS, timeout: 15000 })
            ]);

            const $ = cheerio.load(mainPage.data);
            const prices: PriceData = {};

            for (const key in IDS) {
                const typedKey = key as keyof typeof IDS;
                const elem_id = IDS[typedKey];
                const element = $(`li#${elem_id}`);

                if (element.length) {
                    const priceText = element.find(".info-price").text().trim().replace(/,/g, "");
                    const changeText = element.find(".info-change").text().trim().replace(/,/g, "");
                    prices[typedKey as keyof Omit<PriceData, 'cryptos'>] = {
                        price: priceText,
                        change: changeText || null,
                    };
                }
            }

            const $crypto = cheerio.load(cryptoPage.data);
            const cryptos: CryptoPrice[] = [];
            const cryptoRows = $crypto('table tbody tr').slice(0, 10); // Limit to top 10

            cryptoRows.each((i, row) => {
                const tds = $crypto(row).find('td');
                if (tds.length < 8) return;

                const nameFa = $crypto(tds[0]).find('span.name-fa').text().trim();
                const nameEn = $crypto(tds[0]).find('span.name-en').text().trim();
                const symbol = nameEn.split(' ')[0].toUpperCase();
                const iconSrc = $crypto(tds[0]).find('img').attr('data-src') || $crypto(tds[0]).find('img').attr('src');
                
                const parseNumber = (selector: cheerio.Cheerio) => parseFloat(selector.text().trim().replace(/,/g, '')) || 0;

                cryptos.push({
                    name_fa: nameFa,
                    name_en: nameEn,
                    symbol: symbol,
                    icon: iconSrc || null,
                    price_usdt: parseNumber($crypto(tds[1])),
                    price_irr: parseNumber($crypto(tds[2])),
                    change_percent: parseFloat($crypto(tds[3]).text().trim()) || 0,
                    volume_24h: parseNumber($crypto(tds[5])),
                    market_cap: parseNumber($crypto(tds[6])),
                    last_update: $crypto(tds[7]).text().trim(),
                });
            });
            prices.cryptos = cryptos;

            return prices;
        } catch (error) {
            console.error("Failed to fetch prices from tgju.org", error);
            return {};
        }
    }
);
