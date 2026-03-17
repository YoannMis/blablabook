import z, { string } from 'zod';
import { Box, Field, Input, Button, Heading, FieldErrorIcon, Flex, VStack } from '@chakra-ui/react';
import { PasswordInput } from '../components/ui/password-input.tsx';
import RegisterSchema from '../schema/register.schema.ts';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { RiArrowRightLine } from 'react-icons/ri';

//Typage Typescript
type RegisterFormValues = z.infer<typeof RegisterSchema>;

//Formulaire
const Register = () => {
  const [userInfos, setUserInfos] = useState<RegisterFormValues>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<RegisterFormValues>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormInvalid =
    Object.values(errors).some((error) => error.length > 0) ||
    Object.values(userInfos).some((value) => !value);

  // fonction de soumission du formulaire
  // en attente du back pour les responses de axios
  const handleSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/register', userInfos);
    } catch (error) {
      // if (axios.isAxiosError(error)) {
      //   const axiosError = error as AxiosError<{message?:string, errors?: Record<string, string[]}>
      // }
      // if (AxiosError.response){
      // }else if (AxiosError.request){
      // }
    } finally {
      setIsSubmitting(false);
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
    <Flex justify="center">
      <Box as="form" onSubmit={handleSubmit}>
        <VStack gap={4}>
          <Heading size="3xl">Register</Heading>
          <Field.Root invalid={!!errors.username}>
            <Field.Label>Username</Field.Label>
            <Input
              name="username"
              placeholder="Username"
              value={userInfos.username}
              onChange={handleChange}
            />
            <Field.ErrorText>
              <FieldErrorIcon />
              {errors.username}
            </Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.email}>
            <Field.Label>Email</Field.Label>
            <Input
              name="email"
              placeholder="Email"
              value={userInfos.email}
              onChange={handleChange}
            />
            <Field.ErrorText>
              <FieldErrorIcon />
              {errors.email}
            </Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.password}>
            <Field.Label>Password</Field.Label>
            <PasswordInput
              name="password"
              type="password"
              placeholder="Password"
              value={userInfos.password}
              onChange={handleChange}
            />
            <Field.ErrorText>
              <FieldErrorIcon /> {errors.password}
            </Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.confirmPassword}>
            <Field.Label>Confirm your Password</Field.Label>
            <PasswordInput
              name="confirmPassword"
              type="password"
              placeholder="Confirm your Password"
              value={userInfos.confirmPassword}
              onChange={handleChange}
            />
            <Field.ErrorText>
              <FieldErrorIcon />
              {errors.confirmPassword}
            </Field.ErrorText>
          </Field.Root>
          <Button
            disabled={isFormInvalid}
            loading={isSubmitting}
            onClick={() => setIsSubmitting(!isSubmitting)}
            loadingText="Submitting ..."
            type="submit"
          >
            Submit
            <RiArrowRightLine />
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Register;
