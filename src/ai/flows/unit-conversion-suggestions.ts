'use server';

/**
 * @fileOverview A unit conversion suggestion AI agent.
 *
 * - suggestUnitConversions - A function that suggests unit conversions.
 * - SuggestUnitConversionsInput - The input type for the suggestUnitConversions function.
 * - SuggestUnitConversionsOutput - The return type for the suggestUnitConversions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestUnitConversionsInputSchema = z.object({
  inputUnit: z.string().describe('The unit that the user has provided.'),
  inputValue: z.number().describe('The value of the unit the user has provided.'),
});
export type SuggestUnitConversionsInput = z.infer<
  typeof SuggestUnitConversionsInputSchema
>;

const SuggestUnitConversionsOutputSchema = z.object({
  suggestedConversions: z
    .array(
      z.object({
        targetUnit: z.string().describe('The unit to convert to.'),
        convertedValue: z.number().describe('The value after conversion.'),
      })
    )
    .describe('Suggested unit conversions and their converted values.'),
});
export type SuggestUnitConversionsOutput = z.infer<
  typeof SuggestUnitConversionsOutputSchema
>;

export async function suggestUnitConversions(
  input: SuggestUnitConversionsInput
): Promise<SuggestUnitConversionsOutput> {
  return suggestUnitConversionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestUnitConversionsPrompt',
  input: {schema: SuggestUnitConversionsInputSchema},
  output: {schema: SuggestUnitConversionsOutputSchema},
  prompt: `You are a helpful unit conversion assistant. Given an input unit and value, suggest three relevant unit conversions and their converted values.

Input Unit: {{{inputUnit}}}
Input Value: {{{inputValue}}}

Suggest the most common and practical unit conversions for the given input.

Output in JSON format.
`,
});

const suggestUnitConversionsFlow = ai.defineFlow(
  {
    name: 'suggestUnitConversionsFlow',
    inputSchema: SuggestUnitConversionsInputSchema,
    outputSchema: SuggestUnitConversionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
