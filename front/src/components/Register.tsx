import z from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
import { Box, Field, FieldErrorText, Input, Button, Heading } from '@chakra-ui/react';

// //Création du Schema Zod
// const RegisterSchema = z.object({
//   username: z.string().min(1, 'Username is required'),
//   email: z.string().email('Email must be a valid email address').min(1, 'Email is required'),
//   password: z
//     .string()
//     .min(8, 'Password must be at least 8 characters long')
//     .max(14, 'Password must be at most 14 characters long')
//     .regex(
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,14}$/,
//       'Password must contain at least 1 lowercase, 1 uppercase, 1 number, and 1 special character (!@#$%^&*)'
//     ),
//   confirmPassword: z
//     .string()
//     .min(1, 'Confirm Password is required')
//     .refine((value, { parent }) => value === parent.password, {
//       message: 'Passwords do not match',
//     }),
// });

// //Typage Typescript
// type RegisterFormValues = z.infer<typeof RegisterSchema>;

//Formulaire
const Register = () => {
  //fonction de soumission du formulaire
  // const onsubmit = (data: RegisterFormValues) => {
  //   console.log('Formulaire :', data);
  // };

  return (
    <Box as="form">
      <Heading size="3xl">Register</Heading>
      <Field.Root>
        <Field.Label>Username</Field.Label>
        <Input name="username" placeholder="Username" />
        {/* {errors.username && (
        <Field.ErrorText> {errors.username.message} </Field.ErrorText>
      )} */}
      </Field.Root>

      <Field.Root>
        <Field.Label>Email</Field.Label>
        <Input name="email" placeholder="Email" />
        {/* {errors.email && (
        <Field.ErrorText> {errors.email.message} </Field.ErrorText>
      )} */}
      </Field.Root>
      <Field.Root>
        <Field.Label>Password</Field.Label>
        <Input name="password" placeholder="Password" />
        {/* {errors.password && (
        <Field.ErrorText> {errors.password.message} </Field.ErrorText>
      )} */}
      </Field.Root>
      <Field.Root>
        <Field.Label>Confirm your Password</Field.Label>
        <Input name="confirmPassword" placeholder="Confirm your Password" />
        {/* {errors.confirmPassword && (
        <Field.ErrorText> {errors.confirmPassword.message} </Field.ErrorText>
      )} */}
      </Field.Root>
      <Button type="submit">Submit</Button>
    </Box>
  );
};

export default Register;
