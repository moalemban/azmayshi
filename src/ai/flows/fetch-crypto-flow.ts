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
            
            const $ = cheerio.load(cryptoPage.data);
            const cryptos: CryptoPrice[] = [];
            const cryptoRows = $('tbody tr[data-market-nameslug]').slice(0, 10); // Limit to top 10

            cryptoRows.each((i, row) => {
                const $row = $(row);
                
                const parseNumber = (text: string) => parseFloat(text.replace(/[^۰-۹0-9.-]/g, '').replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))) || 0;
                
                const nameFa = $row.find('td:nth-of-type(2) .tgcss-font-semibold').first().text().trim();
                const nameEn = $row.find('.original-title-en').text().trim();
                const symbol = $row.find('td:nth-of-type(3)').text().trim();
                const iconSrc = $row.find('td:nth-of-type(2) img').attr('data-src') || $row.find('td:nth-of-type(2) img').attr('src');
                const price_usdt = parseNumber($row.find("[data-market-name='p']").text().trim());
                const price_irr = parseNumber($row.find("[data-market-p]").text().trim());
                const change_percent = parseNumber($row.find("[data-market-name='dp']").text().trim());
                const volume_24h = parseNumber($row.find("[data-label*='معاملات 24']").text().trim());
                const market_cap = parseNumber($row.find("[data-label*='ارزش بازار']").text().trim());
                const last_update = $row.find("td[data-label='زمان بروزرسانی']").text().trim();

                cryptos.push({
                    name_fa: nameFa,
                    name_en: nameEn,
                    symbol: symbol,
                    icon: iconSrc || null,
                    price_usdt: price_usdt,
                    price_irr: price_irr,
                    change_percent: change_percent,
                    volume_24h: volume_24h,
                    market_cap: market_cap,
                    last_update: last_update,
                });
            });

            return { cryptos };
        } catch (error) {
            console.error("Failed to fetch crypto prices from tgju.org", error);
            return { cryptos: [] };
        }
    }
);
