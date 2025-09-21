'use server';
/**
 * @fileOverview A streaming AI flow for a legal and financial chatbot for Iran.
 * - legalFinancialChat - A function that takes a prompt and history and returns a stream of responses.
 * - LegalFinancialChatInput - The input type for the legalFinancialChat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const HistoryItemSchema = z.object({
  role: z.enum(['user', 'bot']),
  content: z.string(),
});

export const LegalFinancialChatInputSchema = z.object({
  history: z.array(HistoryItemSchema).optional(),
  prompt: z.string(),
});

export type LegalFinancialChatInput = z.infer<typeof LegalFinancialChatInputSchema>;


export async function legalFinancialChat(input: LegalFinancialChatInput): Promise<ReadableStream<string>> {
    const history = (input.history || []).map(item => ({
        role: item.role as 'user' | 'model',
        content: [{text: item.content}]
    }));

    const { stream } = ai.generateStream({
        model: 'googleai/gemini-1.5-flash-latest',
        system: `You are an expert AI assistant specializing in Iranian legal and financial matters. 
        Your name is "Tabdila Bot". You must answer in Persian.
        Provide clear, accurate, and helpful information regarding laws, regulations, financial calculations, and legal procedures in Iran.
        You are a helpful assistant, not a replacement for a professional lawyer or financial advisor. Always clarify that your advice is for informational purposes only.`,
        history: history,
        prompt: input.prompt,
    });
    
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          controller.enqueue(encoder.encode(chunk.text));
        }
        controller.close();
      },
    });

    return readableStream;
}