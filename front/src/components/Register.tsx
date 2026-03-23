import z from 'zod';
import {
  Box,
  Field,
  Input,
  Button,
  Heading,
  FieldErrorIcon,
  Flex,
  VStack,
  AbsoluteCenter,
} from '@chakra-ui/react';
import { PasswordInput } from './ui/password-input';
import RegisterSchema from '../schema/register.schema';
import axios from 'axios';
import { useState } from 'react';
import { RiArrowRightLine } from 'react-icons/ri';
import type { RegisterErrorResponse, RegisterResponse } from '@/types/api.type';
import { Toaster, toaster } from './ui/toaster';
import { PageLayout } from './layouts/PageLayout';
import homeImage from '../assets/homePageImage.jpg';
import { Link as RouterLink, useNavigate } from 'react-router';
import MobileMenu from './MobileMenu';

//Typage Typescript
type RegisterFormValues = z.infer<typeof RegisterSchema>;
type RegisterFormErrors = Partial<Record<keyof RegisterFormValues, string>>;

//Formulaire
const Register = () => {
  const [userInfos, setUserInfos] = useState<RegisterFormValues>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<RegisterFormErrors>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormInvalid =
    Object.values(errors).some((error) => error.length > 0) ||
    Object.values(userInfos).some((value) => !value) ||
    (userInfos.confirmPassword && userInfos.password !== userInfos.confirmPassword);

  // fonction de soumission du formulaire
  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post<RegisterResponse>(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        userInfos,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      // Traitement de la résponse
      if (response.data.success && response.data.data) {
        console.log('User created', response.data.data);
        toaster.create({
          title: 'Inscription Success',
          description: `You have successfully registered ${response.data.data.username}`,
          type: 'success',
          duration: 3000,
          closable: true,
        });

        // Vider le formulaire
        setUserInfos({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        });

        // Redirection vers la page de connexion
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        console.error('User creation failed', response.data.message);
      }
    } catch (error) {
      console.log('error', error);
      // Traitement des erreurs
      if (axios.isAxiosError<RegisterErrorResponse>(error)) {
        const registerError =
          error.response?.data.message || 'An error occurred during registration';
        if (registerError) {
          toaster.create({
            title: 'Register Error',
            description: registerError,
            type: 'error',
            duration: 3000,
            closable: true,
          });
        } else {
          toaster.create({
            title: 'Server Error',
            description: 'The server is not reachable',
            type: 'error',
            duration: 3000,
            closable: true,
          });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUserInfos = {
      ...userInfos,
      [event.target.name]: event.target.value,
    };

    setUserInfos(newUserInfos);
    // Vérification en temps réel pour confirmPassword
    if (event.target.name === 'password' || event.target.name === 'confirmPassword') {
      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          newUserInfos.password !== newUserInfos.confirmPassword &&
          newUserInfos.confirmPassword !== ''
            ? 'Passwords do not match'
            : '',
      }));
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    // Sert à créer une validation pour un champ individuel
    const miniSchema = z.object({
      [name]: RegisterSchema.shape[name as keyof RegisterFormValues],
    });

    const result = miniSchema.safeParse({ [name]: value });

    setErrors((prev) => {
      if (!result.success) {
        const flattened = z.flattenError(result.error);
        return {
          ...prev,
          [name]: flattened.fieldErrors[name as keyof RegisterFormValues]?.[0] ?? '',
        };
      }
      // Vérification en temps réel pour confirmPassword
      if (name === 'confirmPassword' && value !== userInfos.password) {
        return {
          ...prev,
          [name]: 'Passwords do not match',
        };
      }
      return { ...prev, [name]: '' };
    });
  };

  return (
    <PageLayout imageSrc={homeImage} imagePosition="left" imageSize="25%">
      <AbsoluteCenter pt={{ base: '25%', md: '10%' }} pl={{ md: '25%' }}>
        <Flex justify="center">
          <Box
            as="form"
            onSubmit={handleSubmit}
            borderWidth={{ base: 0, md: 4 }}
            borderRadius={{ base: 0, md: 4 }}
            width={{ base: '35vh', md: '50vh' }}
          >
            <VStack p={{ base: 4, md: 8 }}>
              <Heading size="3xl">Register</Heading>
              <Field.Root invalid={!!errors.username}>
                <Field.Label>Username</Field.Label>
                <Input
                  name="username"
                  placeholder="Username"
                  value={userInfos.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Box minH={6}>
                  <Field.ErrorText>
                    <FieldErrorIcon />
                    {errors.username}
                  </Field.ErrorText>
                </Box>
              </Field.Root>

              <Field.Root invalid={!!errors.email}>
                <Field.Label>Email</Field.Label>
                <Input
                  name="email"
                  placeholder="Email"
                  value={userInfos.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Box minH={6}>
                  <Field.ErrorText>
                    <FieldErrorIcon />
                    {errors.email}
                  </Field.ErrorText>
                </Box>
              </Field.Root>

              <Field.Root invalid={!!errors.password}>
                <Field.Label>Password</Field.Label>
                <PasswordInput
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={userInfos.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Box minH={6}>
                  <Field.ErrorText>
                    <FieldErrorIcon />
                    {errors.password}
                  </Field.ErrorText>
                </Box>
              </Field.Root>

              <Field.Root invalid={!!errors.confirmPassword}>
                <Field.Label>Confirm your Password</Field.Label>
                <PasswordInput
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your Password"
                  value={userInfos.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Box minH={6}>
                  <Field.ErrorText>
                    <FieldErrorIcon />
                    {errors.confirmPassword}
                  </Field.ErrorText>
                </Box>
              </Field.Root>
              <Button
                disabled={isFormInvalid}
                loading={isSubmitting}
                loadingText="Submitting ..."
                type="submit"
                width={{ base: '30vh', md: '40vh' }}
              >
                Submit
                <RiArrowRightLine />
              </Button>
              <RouterLink to="/login">Already have an account ?</RouterLink>
            </VStack>
          </Box>
          <Toaster />
        </Flex>
      </AbsoluteCenter>
      <MobileMenu />
    </PageLayout>
  );
};

export default Register;
