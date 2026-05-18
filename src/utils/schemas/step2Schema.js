import { z } from 'zod';

const nameRegex = /^[a-zA-Z\s.]+$/;

const calculateAge = (dobString) => {
  const today = new Date();
  const birthDate = new Date(dobString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const step2Schema = z.object({
  fullName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .regex(nameRegex, 'Only letters, spaces, and periods allowed'),
  dateOfBirth: z.string()
    .min(1, 'Date of Birth is required')
    .refine((val) => {
      const age = calculateAge(val);
      return age >= 21 && age <= 65;
    }, 'Age must be between 21 and 65 years'),
  gender: z.enum(['Male', 'Female', 'Other'], {
    errorMap: () => ({ message: 'Please select a gender' }),
  }),
  maritalStatus: z.enum(['Single', 'Married', 'Divorced', 'Widowed'], {
    errorMap: () => ({ message: 'Please select marital status' }),
  }),
  fatherName: z.string()
    .min(2, 'Father name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .regex(nameRegex, 'Only letters, spaces, and periods allowed'),
  motherName: z.string()
    .min(2, 'Mother name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .regex(nameRegex, 'Only letters, spaces, and periods allowed'),
  email: z.string()
    .email('Invalid email address format'),
  mobileNumber: z.string()
    .regex(/^[6-9]\d{9}$/, 'Must be a 10-digit number starting with 6-9'),
  alternateMobile: z.string()
    .optional()
    .refine(
      (val) => !val || /^[6-9]\d{9}$/.test(val),
      'Must be a 10-digit number starting with 6-9'
    ),
}).superRefine((data, ctx) => {
  if (data.alternateMobile && data.mobileNumber === data.alternateMobile) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['alternateMobile'],
      message: 'Alternate mobile must differ from primary mobile',
    });
  }
});
