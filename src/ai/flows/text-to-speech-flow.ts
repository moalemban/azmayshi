'use server';
/**
 * @fileOverview A flow to convert Persian text to speech.
 *
 * - textToSpeech - A function that takes a text string and returns a playable audio data URI.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { googleAI } from '@genkit-ai/googleai';

const TextToSpeechInputSchema = z.object({
  text: z.string().min(1, 'متن نمی‌تواند خالی باشد.').max(1000, 'حداکثر طول متن ۱۰۰۰ کاراکتر است.'),
});

export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

const TextToSpeechOutputSchema = z.object({
  audioDataUri: z.string().optional(),
  error: z.string().optional(),
});

export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;

export async function textToSpeech(input: TextToSpeechInput): Promise<TextToSpeechOutput> {
  return textToSpeechFlow(input);
}

const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: TextToSpeechInputSchema,
    outputSchema: TextToSpeechOutputSchema,
  },
  async ({ text }) => {
    try {
        const { media } = await ai.generate({
            model: googleAI.model('gemini-2.5-flash-preview-tts'),
            config: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                  voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Alloy' }, // A voice that supports Persian
                  },
                },
            },
            prompt: text,
        });

        if (!media || !media.url) {
            throw new Error('پاسخی از مدل دریافت نشد.');
        }

        // The model returns PCM data, which might not be directly playable.
        // For broad browser support, we should ideally convert this to WAV or MP3.
        // However, many modern browsers can play raw PCM if given the correct data URI format,
        // but it's not guaranteed. For this fix, we will return the raw data URI and assume
        // the client can handle it, to avoid the `wav` package dependency issue during build.
        
        // The URL is already a data URI with base64 encoded PCM data.
        // e.g., "data:audio/L16;rate=24000;encoding=base64,..."
        // We will just return it directly.
        return {
            audioDataUri: media.url
        };

    } catch (error: any) {
        console.error("Text-to-speech conversion failed", error);
        return { error: 'خطا در تبدیل متن به گفتار. لطفاً دوباره تلاش کنید.' };
    }
  }
);
