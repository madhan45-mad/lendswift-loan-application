import { z } from 'zod';

export const step1Schema = z.object({
  loanType: z.enum(['Personal', 'Home', 'Business'], {
    errorMap: () => ({ message: 'Please select a valid loan type' }),
  }),
  loanAmount: z.coerce.number({
    required_error: 'Loan amount is required',
    invalid_type_error: 'Must be a valid number',
  }).min(50000, 'Minimum loan amount is ₹50,000'),
  loanTenure: z.coerce.number({
    required_error: 'Loan tenure is required',
    invalid_type_error: 'Must be a valid number',
  }),
  loanPurpose: z.string().min(1, 'Please select a loan purpose'),
  referralCode: z.string().optional().refine(
    (val) => !val || (val.length >= 6 && val.length <= 10 && /^[a-zA-Z0-9]+$/.test(val)),
    'Referral code must be 6-10 alphanumeric characters'
  ),
}).superRefine((data, ctx) => {
  const { loanType, loanAmount, loanTenure } = data;

  if (loanType === 'Personal') {
    if (loanAmount > 1000000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['loanAmount'],
        message: 'Personal loan max amount is ₹10,00,000',
      });
    }
    if (loanTenure < 12 || loanTenure > 60) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['loanTenure'],
        message: 'Personal loan tenure must be 12-60 months',
      });
    }
  }

  if (loanType === 'Home') {
    if (loanAmount > 10000000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['loanAmount'],
        message: 'Home loan max amount is ₹1,00,00,000',
      });
    }
    if (loanTenure < 60 || loanTenure > 360) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['loanTenure'],
        message: 'Home loan tenure must be 60-360 months',
      });
    }
  }

  if (loanType === 'Business') {
    if (loanAmount > 5000000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['loanAmount'],
        message: 'Business loan max amount is ₹50,00,000',
      });
    }
    if (loanTenure < 12 || loanTenure > 120) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['loanTenure'],
        message: 'Business loan tenure must be 12-120 months',
      });
    }
  }
});
