import { z } from 'zod';

export const step6Schema = z.object({
  hasCoApplicant: z.boolean(),
  coApplicantName: z.string().min(2, 'Name is required'),
  relationship: z.enum(['Spouse', 'Parent', 'Sibling', 'Business Partner'], {
    errorMap: () => ({ message: 'Please select relationship' }),
  }),
  coApplicantPan: z.string().length(10, 'PAN must be exactly 10 characters').toUpperCase(),
  coApplicantPanVerified: z.boolean().refine(val => val === true, 'PAN must be verified'),
  coApplicantIncome: z.coerce.number().min(0, 'Income cannot be negative'),
  coApplicantConsent: z.boolean().refine(val => val === true, 'Consent is required'),
  coApplicantSignature: z.string().min(10, 'Signature is required'),
});

export const getStep6Schema = (isRequired) => {
  if (!isRequired) {
    // If not required, we can just return an empty schema or everything optional
    return z.object({
      hasCoApplicant: z.boolean().optional(),
    });
  }
  return step6Schema;
};
