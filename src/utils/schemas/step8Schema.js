import { z } from 'zod';

export const step8Schema = z.object({
  consentAccuracy: z.boolean().refine(val => val === true, 'You must confirm the information is accurate'),
  consentCreditCheck: z.boolean().refine(val => val === true, 'You must authorise the credit score check'),
  consentTerms: z.boolean().refine(val => val === true, 'You must agree to the Terms and Conditions'),
  consentCommunication: z.boolean().refine(val => val === true, 'You must consent to receive communications'),
});
