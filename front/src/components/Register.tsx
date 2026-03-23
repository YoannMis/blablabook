import z from 'zod';
import { Box, Field, Input, Button, Heading, FieldErrorIcon, Flex, VStack } from '@chakra-ui/react';
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
import { useTranslation } from 'react-i18next';

//Typage Typescript
type RegisterFormValues = z.infer<typeof RegisterSchema>;
type RegisterFormErrors = Partial<Record<keyof RegisterFormValues, string>>;

//Formulaire
const Register = () => {
  const { t } = useTranslation('auth');

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
    Object.values(userInfos).some((value) => !value);

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
          title: t('register.successTitle'),
          description: t('register.successDescription', {
            username: response.data.data.username,
          }),
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
          error.response?.data.message || t('register.defaultError');
        if (registerError) {
          toaster.create({
            title: t('register.errorTitle'),
            description: registerError,
            type: 'error',
            duration: 3000,
            closable: true,
          });
        } else {
          toaster.create({
            title: t('register.serverErrorTitle'),
            description: t('register.serverErrorDescription'),
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
      return { ...prev, [name]: '' };
    });
  };

  return (
    <PageLayout imageSrc={homeImage}>
      <Flex justify="center">
        <Box as="form" onSubmit={handleSubmit}>
          <VStack gap={4}>
            <Heading size="3xl">{t('register.title')}</Heading>
            <Field.Root invalid={!!errors.username}>
              <Field.Label>{t('register.username')}</Field.Label>
              <Input
                name="username"
                placeholder={t('register.usernamePlaceholder')}
                value={userInfos.username}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Field.ErrorText>
                <FieldErrorIcon />
                {errors.username}
              </Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.email}>
              <Field.Label>{t('register.email')}</Field.Label>
              <Input
                name="email"
                placeholder={t('register.emailPlaceholder')}
                value={userInfos.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Field.ErrorText>
                <FieldErrorIcon />
                {errors.email}
              </Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.password}>
              <Field.Label>{t('register.password')}</Field.Label>
              <PasswordInput
                name="password"
                type="password"
                placeholder={t('register.passwordPlaceholder')}
                value={userInfos.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Field.ErrorText>
                <FieldErrorIcon /> {errors.password}
              </Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.confirmPassword}>
              <Field.Label>{t('register.confirmPassword')}</Field.Label>
              <PasswordInput
                name="confirmPassword"
                type="password"
                placeholder={t('register.confirmPasswordPlaceholder')}
                value={userInfos.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Field.ErrorText>
                <FieldErrorIcon />
                {errors.confirmPassword}
              </Field.ErrorText>
            </Field.Root>
            <Button
              disabled={isFormInvalid}
              loading={isSubmitting}
              loadingText={t('register.submitting')}
              type="submit"
            >
              {t('register.submit')}
              <RiArrowRightLine />
            </Button>
            <RouterLink to="/login">{t('register.alreadyHaveAccount')}</RouterLink>
          </VStack>
        </Box>
        <Toaster />
      </Flex>
    </PageLayout>
  );
};

export default Register;
