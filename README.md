Build Error
Failed to compile

Next.js (14.2.4) is outdated (learn more)
./src/ai/flows/text-to-speech-flow.ts:10:1
Module not found: Can't resolve 'wav'
   8 | import { ai } from '@/ai/genkit';
   9 | import { z } from 'zod';
> 10 | import wav from 'wav';
     | ^
  11 | import { googleAI } from '@genkit-ai/googleai';
  12 |
  13 | const TextToSpeechInputSchema = z.object({

https://nextjs.org/docs/messages/module-not-found

Import trace for requested module:
./node_modules/next/dist/build/webpack/loaders/next-flight-action-entry-loader.js?actions=%5B%5B%22%2Fhome%2Fuser%2Fstudio%2Fsrc%2Fai%2Fflows%2Ffetch-crypto-flow.ts%22%2C%5B%22fetchCryptoPrices%22%5D%5D%2C%5B%22%2Fhome%2Fuser%2Fstudio%2Fsrc%2Fai%2Fflows%2Flegal-financial-chat-flow.ts%22%2C%5B%22legalFinancialChat%22%5D%5D%2C%5B%22%2Fhome%2Fuser%2Fstudio%2Fsrc%2Fai%2Fflows%2Fshorten-link-flow.ts%22%2C%5B%22shortenLink%22%5D%5D%2C%5B%22%2Fhome%2Fuser%2Fstudio%2Fsrc%2Fai%2Fflows%2Fsummarize-text-flow.ts%22%2C%5B%22summarizeText%22%5D%5D%2C%5B%22%2Fhome%2Fuser%2Fstudio%2Fsrc%2Fai%2Fflows%2Ftext-to-speech-flow.ts%22%2C%5B%22textToSpeech%22%5D%5D%5D&__client_imported__=true!
This error occurred during the build process and can only be dismissed by fixing the error.# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.
# bot
# tabdila-v1.1
