import { z } from 'zod';

const addressSchema = z.object({
  addressLine1: z.string().min(5, 'Address must be at least 5 characters').max(200, 'Address too long'),
  addressLine2: z.string().optional(),
  pinCode: z.string().regex(/^[0-9]{6}$/, 'PIN Code must be exactly 6 digits'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postOffice: z.string().optional(),
});

export const step4Schema = z.object({
  currentAddress: addressSchema,
  residenceType: z.enum(['Owned', 'Rented', 'Company', 'Family'], {
    errorMap: () => ({ message: 'Please select residence type' }),
  }),
  rentAmount: z.coerce.number().optional(),
  yearsAtAddress: z.coerce.number().min(0).max(50, 'Invalid years'),
  isSameAsCurrent: z.boolean(),
  permanentAddress: addressSchema.optional(),
  // For previous address if < 1 year
  previousAddress: addressSchema.optional(),
}).superRefine((data, ctx) => {
  // If rented, rent amount is required
  if (data.residenceType === 'Rented') {
    if (!data.rentAmount || data.rentAmount <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['rentAmount'],
        message: 'Rent amount is required for rented residence',
      });
    }
  }

  // If not same as current, permanent address is required
  if (!data.isSameAsCurrent) {
    if (!data.permanentAddress?.addressLine1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['permanentAddress', 'addressLine1'],
        message: 'Permanent address is required',
      });
    }
    if (!data.permanentAddress?.pinCode) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['permanentAddress', 'pinCode'],
        message: 'PIN Code is required',
      });
    }
    if (!data.permanentAddress?.city) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['permanentAddress', 'city'],
        message: 'City is required',
      });
    }
    if (!data.permanentAddress?.state) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['permanentAddress', 'state'],
        message: 'State is required',
      });
    }
  }

  // If < 1 year at current address, previous address is required
  if (data.yearsAtAddress === 0) {
    if (!data.previousAddress?.addressLine1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['previousAddress', 'addressLine1'],
        message: 'Previous address is required as current residence is < 1 year',
      });
    }
    // and other fields...
  }
});
