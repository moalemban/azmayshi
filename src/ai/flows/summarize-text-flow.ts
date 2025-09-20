'use server';
/**
 * @fileOverview A flow to summarize long texts using an AI model.
 * - summarizeText - A function that takes a long text and returns a summary.
 * - SummarizeTextInput - The input type for the summarizeText function.
 * - SummarizeTextOutput - The return type for the summarizeText function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { headers } from 'next/headers';

const SummarizeTextInputSchema = z.object({
  text: z.string().min(100, { message: 'متن برای خلاصه‌سازی باید حداقل ۱۰۰ کاراکتر باشد.' }).describe('The text to be summarized.'),
});
export type SummarizeTextInput = z.infer<typeof SummarizeTextInputSchema>;

const SummarizeTextOutputSchema = z.object({
  summary: z.string().describe('The generated summary.'),
});
export type SummarizeTextOutput = z.infer<typeof SummarizeTextOutputSchema>;

// In-memory store for rate limiting
const requestTracker = new Map<string, number[]>();
const RATE_LIMIT_COUNT = 3; // Max requests
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes in milliseconds

export async function summarizeText(input: SummarizeTextInput): Promise<SummarizeTextOutput> {
  return summarizeTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeTextPrompt',
  input: { schema: SummarizeTextInputSchema },
  output: { schema: SummarizeTextOutputSchema },
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `You are an expert text summarizer. Your task is to provide a concise and clear summary of the given text in Persian. Focus on the main points and key information.

The user has provided the following text:
---
{{{text}}}
---

Please provide the summary in the 'summary' field of the output.`,
});

const summarizeTextFlow = ai.defineFlow(
  {
    name: 'summarizeTextFlow',
    inputSchema: SummarizeTextInputSchema,
    outputSchema: SummarizeTextOutputSchema,
  },
  async (input) => {
    // Rate limiting logic
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || '127.0.0.1';
    const now = Date.now();

    const userRequests = (requestTracker.get(ip) || []).filter(
      (timestamp) => now - timestamp < RATE_LIMIT_WINDOW
    );

    if (userRequests.length >= RATE_LIMIT_COUNT) {
      throw new Error('شما به حداکثر تعداد درخواست مجاز (۳ بار در ۱۰ دقیقه) رسیده‌اید. لطفاً کمی صبر کنید.');
    }

    // Add current request timestamp
    userRequests.push(now);
    requestTracker.set(ip, userRequests);
    
    // Proceed with summarization
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate summary.');
    }
    return output;
  }
);
