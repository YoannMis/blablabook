import z from 'zod';

//Création du Schema Zod
const RegisterSchema = z
  .object({
    username: z.string().min(1, 'Username is required'),
    email: z.string().email('Email must be a valid email address').min(1, 'Email is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(14, 'Password must be at most 14 characters long')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,14}$/,
        'Password must contain at least 1 lowercase, 1 uppercase, 1 number, and 1 special character (!@#$%^&*)'
      ),
    confirmPassword: z.string().min(1, 'Confirm Password is required'),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export default RegisterSchema;
