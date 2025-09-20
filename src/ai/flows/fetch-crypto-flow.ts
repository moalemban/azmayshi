'use server';
/**
 * @fileOverview A flow to fetch and parse live crypto prices from tgju.org.
 *
 * - fetchCryptoPrices - A function that scrapes tgju.org for live crypto prices using Cheerio.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import axios from 'axios';
import * as cheerio from 'cheerio';
import type { CryptoPrice } from '@/lib/types';

const CRYPTO_URL = "https://www.tgju.org/crypto";
const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
    "AppleWebKit/537.36 (KHTML, like Gecko) " +
    "Chrome/129.0.0.0 Safari/537.36",
};

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

const CryptoDataSchema = z.object({
    cryptos: z.array(CryptoPriceSchema).optional(),
});

export async function fetchCryptoPrices(): Promise<{ cryptos?: CryptoPrice[] }> {
  return fetchCryptoPricesFlow();
}

const fetchCryptoPricesFlow = ai.defineFlow(
    {
        name: 'fetchCryptoPricesFlow',
        outputSchema: CryptoDataSchema,
    },
    async () => {
        try {
            const cryptoPage = await axios.get(CRYPTO_URL, { headers: HEADERS, timeout: 15000 });
            
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

            return { cryptos };
        } catch (error) {
            console.error("Failed to fetch crypto prices from tgju.org", error);
            return { cryptos: [] };
        }
    }
);
