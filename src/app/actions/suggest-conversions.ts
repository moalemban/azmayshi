'use server';

import { suggestUnitConversions, SuggestUnitConversionsInput } from '@/ai/flows/unit-conversion-suggestions';

export async function getSuggestedConversions(input: SuggestUnitConversionsInput) {
    try {
        const result = await suggestUnitConversions(input);
        return { success: true, data: result };
    } catch (error) {
        console.error("Error in suggestUnitConversions flow:", error);
        return { success: false, error: "Failed to get suggestions from AI. Please try again later." };
    }
}
