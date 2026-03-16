import z from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
import { Box, Field, FieldErrorText, Input, Button, Heading } from '@chakra-ui/react';
import RegisterSchema from '../schema/register.schema.ts';
import axios from 'axios';

import { FormEvent, useState } from 'react';
import { BiTargetLock } from 'react-icons/bi';

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

  // fonction de soumission du formulaire
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // console.log('Formulaire :', data);
    // try {
    //   const response = await axios.post(url.api)
    // } catch (error) {
    //   console.error("Erreur :", error)
    // }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfos({
      ...userInfos,
      [event.target.name]: event.target.value,
    });

    // Utiliser ton schemaZod (avec parse) en lui donnait les données du state
    // const result = ....
    // if !result.success :
    // Enregistrer les errors dans un state
    // [name]: erreur
  };

  console.log('userIfnos :', userInfos);

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <Heading size="3xl">Register</Heading>
      <Field.Root>
        <Field.Label>Username</Field.Label>
        <Input
          name="username"
          placeholder="Username"
          value={userInfos.username}
          onChange={handleChange}
        />
        {/* {errors.username && (
        <Field.ErrorText> {errors.username.message} </Field.ErrorText>
      )} */}
      </Field.Root>

      <Field.Root>
        <Field.Label>Email</Field.Label>
        <Input name="email" placeholder="Email" value={userInfos.email} onChange={handleChange} />
        {/* {errors.email && (
        <Field.ErrorText> {errors.email.message} </Field.ErrorText>
      )} */}
      </Field.Root>
      <Field.Root>
        <Field.Label>Password</Field.Label>
        <Input
          name="password"
          placeholder="Password"
          value={userInfos.password}
          onChange={handleChange}
        />
        {/* {errors.password && (
        <Field.ErrorText> {errors.password.message} </Field.ErrorText>
      )} */}
      </Field.Root>
      <Field.Root>
        <Field.Label>Confirm your Password</Field.Label>
        <Input
          name="confirmPassword"
          placeholder="Confirm your Password"
          value={userInfos.confirmPassword}
          onChange={handleChange}
        />
        {/* {errors.confirmPassword && (
        <Field.ErrorText> {errors.confirmPassword.message} </Field.ErrorText>
      )} */}
      </Field.Root>
      <Button type="submit">Submit</Button>
    </Box>
  );
};

export default Register;
