'use server';

import { suggestHarpDetails, type SuggestHarpDetailsInput, type SuggestHarpDetailsOutput } from '@/ai/flows/suggest-harp-details';

export async function getHarpSuggestions(input: SuggestHarpDetailsInput): Promise<{success: boolean, data?: SuggestHarpDetailsOutput, error?: string}> {
  try {
    const result = await suggestHarpDetails(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error fetching HARP suggestions:', error);
    return { success: false, error: 'Failed to fetch suggestions.' };
  }
}
