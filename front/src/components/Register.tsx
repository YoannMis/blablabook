import z from 'zod';
import { Box, Field, FieldErrorText, Input, Button, Heading, Text } from '@chakra-ui/react';
import RegisterSchema from '../schema/register.schema.ts';
import axios from 'axios';

import { useState } from 'react';
import { resumeToPipeableStream } from 'react-dom/server';

//Typage Typescript
type RegisterFormValues = z.infer<typeof RegisterSchema>;

//Formulaire
const Register = () => {
  const [userInfos, setUserInfos] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // fonction de soumission du formulaire
  const handleSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault();
    console.log('Formulaire :', userInfos);
    try {
      const response = await axios.post('/api/register', userInfos);
      console.log('Réponse du server:', response.data);
    } catch (error) {
      console.error('Erreur :', error);
      if (error.response)
        
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUserInfos = {
      ...userInfos,
      [event.target.name]: event.target.value,
    };

    // Utiliser ton schemaZod (avec parse) en lui donnait les données du state
    const result = RegisterSchema.safeParse(newUserInfos);

    setUserInfos(newUserInfos);

    if (!result.success) {
      const flattenedErrors = z.flattenError(result.error);
      const newErrors = {
        username: flattenedErrors.fieldErrors.username?.[0] || '',
        email: flattenedErrors.fieldErrors.email?.[0] || '',
        password: flattenedErrors.fieldErrors.password?.[0] || '',
        confirmPassword: flattenedErrors.fieldErrors.confirmPassword?.[0] || '',
      };

      setErrors(newErrors);
    } else {
      setErrors({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <Heading size="3xl">Register</Heading>
      <Field.Root invalid={!!errors.username}>
        <Field.Label>Username</Field.Label>
        <Input
          name="username"
          placeholder="Username"
          value={userInfos.username}
          onChange={handleChange}
        />
        <Field.ErrorText>{errors.username}</Field.ErrorText>
      </Field.Root>

      <Field.Root invalid={!!errors.email}>
        <Field.Label>Email</Field.Label>
        <Input name="email" placeholder="Email" value={userInfos.email} onChange={handleChange} />
        {<Field.ErrorText>{errors.email}</Field.ErrorText>}
      </Field.Root>

      <Field.Root invalid={!!errors.password}>
        <Field.Label>Password</Field.Label>
        <Input
          name="password"
          placeholder="Password"
          value={userInfos.password}
          onChange={handleChange}
        />
        <Field.ErrorText> {errors.password} </Field.ErrorText>
      </Field.Root>

      <Field.Root invalid={!!errors.confirmPassword}>
        <Field.Label>Confirm your Password</Field.Label>
        <Input
          name="confirmPassword"
          placeholder="Confirm your Password"
          value={userInfos.confirmPassword}
          onChange={handleChange}
        />
        {<Field.ErrorText> {errors.confirmPassword} </Field.ErrorText>}
      </Field.Root>
      <Button type="submit">Submit</Button>
    </Box>
  );
};

export default Register;
