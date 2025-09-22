'use server';
/**
 * @fileOverview A flow to convert Persian text to speech.
 *
 * - textToSpeech - A function that takes a text string and returns a playable audio data URI.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import wav from 'wav';
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


async function toWav(pcmData: Buffer, channels = 1, rate = 24000, sampleWidth = 2): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => bufs.push(d));
    writer.on('end', () => resolve(Buffer.concat(bufs).toString('base64')));

    writer.write(pcmData);
    writer.end();
  });
}

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

        if (!media) {
            throw new Error('پاسخی از مدل دریافت نشد.');
        }

        const audioBuffer = Buffer.from(
            media.url.substring(media.url.indexOf(',') + 1),
            'base64'
        );
        
        const wavBase64 = await toWav(audioBuffer);
        
        return {
            audioDataUri: 'data:audio/wav;base64,' + wavBase64,
        };

    } catch (error: any) {
        console.error("Text-to-speech conversion failed", error);
        return { error: 'خطا در تبدیل متن به گفتار. لطفاً دوباره تلاش کنید.' };
    }
  }
);
