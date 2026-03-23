import z from 'zod';

const LoginSchema = z.object({
  email: z.email('Email must be a valid email address').min(1, 'Email is required'),
  password: z
    .string()
    .min(12, 'Password must be at least 12 characters long')
    .max(100, 'Password must be at most 100 characters long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{12,100}$/,
      'Password must contain at least 1 lowercase, 1 uppercase, 1 number, and 1 special character (!@#$%^&*)'
    ),
});
export default LoginSchema;
