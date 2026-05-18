import { z } from 'zod';

export const step3Schema = z.object({
  pan: z.string()
    .min(10, 'PAN is required')
    .max(10, 'PAN must be exactly 10 characters')
    .toUpperCase(),
  panVerified: z.boolean().refine(val => val === true, 'PAN must be verified to proceed'),
  aadhaar: z.string()
    .min(12, 'Aadhaar is required')
    .max(12, 'Aadhaar must be exactly 12 digits'),
  aadhaarVerified: z.boolean().refine(val => val === true, 'Aadhaar must be verified to proceed'),
  aadhaarConsent: z.boolean().refine(val => val === true, 'You must provide consent for Aadhaar verification'),
  voterId: z.string().optional().refine(
    val => !val || /^[A-Z]{3}[0-9]{7}$/.test(val),
    'Voter ID must be 3 letters followed by 7 digits'
  ),
  passport: z.string().optional().refine(
    val => !val || /^[A-Z]{1}[0-9]{7}$/.test(val),
    'Passport must be 1 letter followed by 7 digits'
  ),
});
