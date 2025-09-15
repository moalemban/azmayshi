'use server';
/**
 * @fileOverview A flow to fetch and parse live prices from a given URL.
 *
 * - fetchPrices - A function that scrapes tgju.org for live prices.
 * - PriceDataSchema - The Zod schema for the structured price data.
 * - PriceData - The TypeScript type for the price data.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { PriceData as PriceDataType } from '@/lib/types';

// Zod schema defines the expected structure of the output.
// Descriptions help the model understand what each field means.
export const PriceDataSchema = z.object({
    Bourse: z.string().optional().describe('The price for Bourse (l-gc30)'),
    GoldOunce: z.string().optional().describe('The price for Gold Ounce (l-ons)'),
    MesghalGold: z.string().optional().describe('The price for Mesghal Gold (l-mesghal)'),
    Gold18K: z.string().optional().describe('The price for Gold 18K (l-geram18)'),
    EmamiCoin: z.string().optional().describe('The price for Emami Coin (l-sekee)'),
    Dollar: z.string().optional().describe('The price for Dollar (l-price_dollar_rl)'),
    BrentOil: z.string().optional().describe('The price for Brent Oil (l-oil_brent)'),
    USDT: z.string().optional().describe('The price for Tether/USDT (l-crypto-tether-irr)'),
});

export type PriceData = z.infer<typeof PriceDataSchema>;

export async function fetchPrices(): Promise<PriceData> {
  return fetchPricesFlow();
}

const fetchPrompt = ai.definePrompt({
    name: 'fetchPricesPrompt',
    output: { schema: PriceDataSchema },
    prompt: `Fetch the content from the URL https://www.tgju.org/.
The content is in HTML format.
From the HTML, find the following list items by their 'id' attributes.
Inside each list item, find the span with class 'info-price'.
Extract the text content of that span, remove any commas, and return it as a string for the corresponding field.

- Bourse: id 'l-gc30'
- GoldOunce: id 'l-ons'
- MesghalGold: id 'l-mesghal'
- Gold18K: id 'l-geram18'
- EmamiCoin: id 'l-sekee'
- Dollar: id 'l-price_dollar_rl'
- BrentOil: id 'l-oil_brent'
- USDT: id 'l-crypto-tether-irr'

Only return the structured JSON data.
`,
});

const fetchPricesFlow = ai.defineFlow(
    {
        name: 'fetchPricesFlow',
        outputSchema: PriceDataSchema,
    },
    async () => {
        const { output } = await fetchPrompt();
        return output ?? {};
    }
);
