'use server';
/**
 * @fileOverview A flow to shorten a URL using the TinyURL API.
 * - shortenLink - A function that takes a long URL and returns a short URL.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import axios from 'axios';

const ShortenLinkInputSchema = z.object({
  url: z.string().url().describe('The long URL to be shortened.'),
});
export type ShortenLinkInput = z.infer<typeof ShortenLinkInputSchema>;

const ShortenLinkOutputSchema = z.object({
  shortUrl: z.string().url().optional().describe('The shortened URL.'),
  error: z.string().optional().describe('An error message if shortening fails.'),
});
export type ShortenLinkOutput = z.infer<typeof ShortenLinkOutputSchema>;

export async function shortenLink(input: ShortenLinkInput): Promise<ShortenLinkOutput> {
  return shortenLinkFlow(input);
}

const shortenLinkFlow = ai.defineFlow(
  {
    name: 'shortenLinkFlow',
    inputSchema: ShortenLinkInputSchema,
    outputSchema: ShortenLinkOutputSchema,
  },
  async ({ url }) => {
    try {
      const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
      
      if (response.status === 200 && response.data && typeof response.data === 'string') {
        if(response.data.startsWith('http')) {
            return { shortUrl: response.data };
        }
        // TinyURL sometimes returns an error string instead of a URL
        return { error: response.data };
      }
      
      return { error: `پاسخ نامعتبر از سرور: ${response.status}` };
    } catch (error: any) {
      console.error('Error shortening link:', error);
      if (axios.isAxiosError(error) && error.response) {
        return { error: `خطای سرور: ${error.response.status} - ${error.response.data}` };
      }
      return { error: 'امکان اتصال به سرویس کوتاه‌کننده لینک وجود ندارد.' };
    }
  }
);
