'use server';

/**
 * @fileOverview Predicts future loan payment defaults using historical data and AI.
 *
 * - predictFuturePaymentDefaults - A function that predicts loan default risk.
 * - PredictFuturePaymentDefaultsInput - The input type for the prediction function.
 * - PredictFuturePaymentDefaultsOutput - The return type for the prediction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictFuturePaymentDefaultsInputSchema = z.object({
  loanData: z
    .string()
    .describe(
      'Historical loan payment data as a string, including loan amount, interest rate, payment history, and applicant details.'
    ),
});
export type PredictFuturePaymentDefaultsInput = z.infer<
  typeof PredictFuturePaymentDefaultsInputSchema
>;

const PredictFuturePaymentDefaultsOutputSchema = z.object({
  riskAssessment: z
    .string()
    .describe(
      'AI-driven risk assessment of future loan payment defaults, indicating the likelihood of default and key contributing factors.'
    ),
  recommendations: z
    .string()
    .describe(
      'Recommendations for mitigating potential losses based on the risk assessment, such as adjusting payment terms or increasing monitoring.'
    ),
});
export type PredictFuturePaymentDefaultsOutput = z.infer<
  typeof PredictFuturePaymentDefaultsOutputSchema
>;

export async function predictFuturePaymentDefaults(
  input: PredictFuturePaymentDefaultsInput
): Promise<PredictFuturePaymentDefaultsOutput> {
  return predictFuturePaymentDefaultsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictFuturePaymentDefaultsPrompt',
  input: {schema: PredictFuturePaymentDefaultsInputSchema},
  output: {schema: PredictFuturePaymentDefaultsOutputSchema},
  prompt: `You are an AI expert in predicting loan payment defaults.
  Analyze the historical loan payment data and applicant details provided to assess the risk of future payment defaults.
  Provide a risk assessment indicating the likelihood of default and the key factors contributing to that risk.
  Also provide recommendations for mitigating potential losses, such as adjusting payment terms or increasing monitoring.

  Loan Data: {{{loanData}}}
  `,
});

const predictFuturePaymentDefaultsFlow = ai.defineFlow(
  {
    name: 'predictFuturePaymentDefaultsFlow',
    inputSchema: PredictFuturePaymentDefaultsInputSchema,
    outputSchema: PredictFuturePaymentDefaultsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
