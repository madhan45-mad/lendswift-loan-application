import { z } from 'zod';

const addressSchema = z.object({
  addressLine1: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pinCode: z.string().regex(/^[0-9]{6}$/, 'Must be 6 digits'),
});

const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

const baseSchema = z.object({
  employmentType: z.enum(['Salaried', 'Self-Employed', 'Business Owner'], {
    errorMap: () => ({ message: 'Please select an employment type' }),
  }),
});

const salariedSchema = baseSchema.extend({
  employmentType: z.literal('Salaried'),
  companyName: z.string().min(2, 'Company name is required'),
  designation: z.string().min(2, 'Designation is required'),
  monthlySalary: z.coerce.number().min(15000, 'Minimum salary requirement is ₹15,000'),
  yearsOfExperience: z.coerce.number().min(0).max(50, 'Invalid years of experience'),
});

const selfEmployedSchema = baseSchema.extend({
  employmentType: z.literal('Self-Employed'),
  businessName: z.string().min(2, 'Business/Practice name is required'),
  businessType: z.enum(['Professional', 'Freelancer', 'Consultant', 'Other'], {
    errorMap: () => ({ message: 'Please select a business type' }),
  }),
  annualTurnover: z.coerce.number().min(300000, 'Minimum turnover requirement is ₹3,00,000'),
  yearsInBusiness: z.coerce.number().min(2, 'Minimum 2 years in business required'),
  monthlyIncome: z.coerce.number().min(10000, 'Monthly income is required'),
  officeAddress: addressSchema,
});

const businessOwnerSchema = baseSchema.extend({
  employmentType: z.literal('Business Owner'),
  businessName: z.string().min(2, 'Business name is required'),
  businessType: z.enum(['Proprietorship', 'Partnership', 'Private Limited', 'LLP'], {
    errorMap: () => ({ message: 'Please select a business type' }),
  }),
  annualTurnover: z.coerce.number().min(300000, 'Minimum turnover requirement is ₹3,00,000'),
  yearsInBusiness: z.coerce.number().min(2, 'Minimum 2 years in business required'),
  monthlyIncome: z.coerce.number().min(10000, 'Monthly income is required'),
  gstNumber: z.string().regex(gstRegex, 'Invalid GST Number format'),
  officeAddress: addressSchema,
});

export const getStep5Schema = (loanType) => {
  const schema = z.discriminatedUnion('employmentType', [
    salariedSchema,
    selfEmployedSchema,
    businessOwnerSchema,
  ]).superRefine((data, ctx) => {
    if (loanType === 'Business' && data.employmentType === 'Salaried') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['employmentType'],
        message: 'Business loans require Self-Employed or Business Owner employment type',
      });
    }
  });
  return schema;
};
