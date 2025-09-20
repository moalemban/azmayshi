'use server';
/**
 * @fileOverview A flow to take a screenshot of a given website URL.
 * - takeScreenshot - Captures a screenshot of a web page.
 * - TakeScreenshotInput - Input schema for the flow.
 * - TakeScreenshotOutput - Output schema for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const TakeScreenshotInputSchema = z.object({
  url: z.string().url({ message: 'آدرس URL وارد شده معتبر نیست.' }),
});
export type TakeScreenshotInput = z.infer<typeof TakeScreenshotInputSchema>;

const TakeScreenshotOutputSchema = z.object({
  screenshotBase64: z.string().optional().describe('The screenshot image encoded in Base64.'),
  error: z.string().optional().describe('An error message if the screenshot failed.'),
});
export type TakeScreenshotOutput = z.infer<typeof TakeScreenshotOutputSchema>;


const takeScreenshotFlow = ai.defineFlow(
  {
    name: 'takeScreenshotFlow',
    inputSchema: TakeScreenshotInputSchema,
    outputSchema: TakeScreenshotOutputSchema,
  },
  async ({ url }) => {
    let browser = null;
    try {
      // Dynamically import puppeteer and chrome-aws-lambda
      const puppeteer = (await import('puppeteer-core')).default;
      const chromium = (await import('chrome-aws-lambda')).default;

      // Launch Puppeteer
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
      });

      const page = await browser.newPage();
      
      // Set a reasonable viewport
      await page.setViewport({ width: 1280, height: 720 });
      
      // Navigate to the URL
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      // Take a screenshot of the full page
      const screenshotBuffer = await page.screenshot({ 
          type: 'png',
          fullPage: true 
      });

      if (!screenshotBuffer || typeof screenshotBuffer === 'string') {
        throw new Error('Failed to capture screenshot buffer.');
      }
      
      return { screenshotBase64: `data:image/png;base64,${screenshotBuffer.toString('base64')}` };
    } catch (e: any) {
      console.error("Error in takeScreenshotFlow: ", e);
      let errorMessage = 'خطای نامشخصی رخ داد.';
      if (e.message.includes('net::ERR_NAME_NOT_RESOLVED')) {
          errorMessage = 'آدرس سایت یافت نشد. لطفاً URL را بررسی کنید.'
      } else if (e.message.includes('timeout')) {
          errorMessage = 'دریافت اطلاعات از سایت بیش از حد طول کشید (Timeout).'
      } else if (e.message.includes('invalid URL')) {
          errorMessage = 'آدرس URL وارد شده معتبر نیست.'
      }
      return { error: errorMessage };
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
);


export async function takeScreenshot(input: TakeScreenshotInput): Promise<TakeScreenshotOutput> {
  return takeScreenshotFlow(input);
}
