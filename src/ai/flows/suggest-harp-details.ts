'use server';

/**
 * @fileOverview An AI agent for suggesting HARP details based on partial inputs and historical data.
 *
 * - suggestHarpDetails - A function that suggests location, department, block, and floor details.
 * - SuggestHarpDetailsInput - The input type for the suggestHarpDetails function.
 * - SuggestHarpDetailsOutput - The return type for the suggestHarpDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestHarpDetailsInputSchema = z.object({
  partialLocation: z.string().optional().describe('Partial location input.'),
  partialDepartment: z.string().optional().describe('Partial department input.'),
  partialBlock: z.string().optional().describe('Partial block input.'),
  partialFloor: z.string().optional().describe('Partial floor input.'),
});
export type SuggestHarpDetailsInput = z.infer<typeof SuggestHarpDetailsInputSchema>;

const SuggestHarpDetailsOutputSchema = z.object({
  suggestedLocation: z.string().describe('Suggested location based on input.'),
  suggestedDepartment: z.string().describe('Suggested department based on input.'),
  suggestedBlock: z.string().describe('Suggested block based on input.'),
  suggestedFloor: z.string().describe('Suggested floor based on input.'),
});
export type SuggestHarpDetailsOutput = z.infer<typeof SuggestHarpDetailsOutputSchema>;

export async function suggestHarpDetails(input: SuggestHarpDetailsInput): Promise<SuggestHarpDetailsOutput> {
  return suggestHarpDetailsFlow(input);
}

const getSimilarHarpDetails = ai.defineTool(
    {
        name: 'getSimilarHarpDetails',
        description: 'Retrieves similar HARP details from previous entries based on partial inputs.',
        inputSchema: z.object({
            partialLocation: z.string().optional().describe('Partial location input.'),
            partialDepartment: z.string().optional().describe('Partial department input.'),
            partialBlock: z.string().optional().describe('Partial block input.'),
            partialFloor: z.string().optional().describe('Partial floor input.'),
        }),
        outputSchema: z.object({
            location: z.string().describe('Location from previous HARP entry.'),
            department: z.string().describe('Department from previous HARP entry.'),
            block: z.string().describe('Block from previous HARP entry.'),
            floor: z.string().describe('Floor from previous HARP entry.'),
        }).array(),
    },
    async (input) => {
      // TODO: Replace with actual data retrieval logic from the database or historical data source
      // This is a placeholder implementation
      const dummyData = [
        {location: 'Sample Location 1', department: 'Sample Department 1', block: 'A', floor: '1'},
        {location: 'Sample Location 2', department: 'Sample Department 2', block: 'B', floor: '2'},
      ];

      // Filter dummy data based on partial inputs
      const filteredData = dummyData.filter(item => {
        if (input.partialLocation && !item.location.includes(input.partialLocation)) return false;
        if (input.partialDepartment && !item.department.includes(input.partialDepartment)) return false;
        if (input.partialBlock && !item.block.includes(input.partialBlock)) return false;
        if (input.partialFloor && !item.floor.includes(input.partialFloor)) return false;
        return true;
      });

      return filteredData;
    }
);

const prompt = ai.definePrompt({
  name: 'suggestHarpDetailsPrompt',
  tools: [getSimilarHarpDetails],
  input: {schema: SuggestHarpDetailsInputSchema},
  output: {schema: SuggestHarpDetailsOutputSchema},
  prompt: `You are an AI assistant designed to suggest HARP details based on partial inputs and historical data.

  The user will provide partial inputs for location, department, block, and floor. Use the getSimilarHarpDetails tool to retrieve similar HARP details from previous entries.

  Based on the retrieved data, suggest the most likely values for location, department, block, and floor.

  Partial Location: {{{partialLocation}}}
  Partial Department: {{{partialDepartment}}}
  Partial Block: {{{partialBlock}}}
  Partial Floor: {{{partialFloor}}}

  If no similar data is found, provide general suggestions or leave the fields blank.

  Respond with suggested values for location, department, block and floor. Be brief.
`,
});

const suggestHarpDetailsFlow = ai.defineFlow(
  {
    name: 'suggestHarpDetailsFlow',
    inputSchema: SuggestHarpDetailsInputSchema,
    outputSchema: SuggestHarpDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
