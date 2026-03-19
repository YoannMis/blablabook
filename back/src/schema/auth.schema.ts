import z from 'zod';

//Création du Schema Zod
export const AuthSchema = z
  .object({
    username: z.string().min(1),
    email: z.string().email().min(1),
    password: z
      .string()
      .min(8)
      .max(14)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,14}$/),
    confirmPassword: z.string().min(1),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ['confirmPassword'],
  });

export const LoginSchema = z.object({
  email: z.string().email().min(1),
  password: z
    .string()
    .min(8)
    .max(14)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,14}$/),
});
