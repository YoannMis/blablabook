import z from 'zod';
import { Box, Field, Input, Button, Heading, FieldErrorIcon, Flex, VStack } from '@chakra-ui/react';
import { PasswordInput } from '../components/ui/password-input';
import LoginSchema from '../schema/login.schema';
import axios from 'axios';
import { useState } from 'react';
import { RiArrowRightLine } from 'react-icons/ri';
import { IoMailOutline } from 'react-icons/io5';
import { TbPasswordUser } from 'react-icons/tb';
import { Toaster, toaster } from './ui/toaster';
import { PageLayout } from './layouts/PageLayout';
import homeImage from '../assets/homePageImage.jpg';
import { Link as RouterLink, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

//Typage Typescript
type LoginFormValues = z.infer<typeof LoginSchema>;
type LoginErrorResponse = Partial<Record<keyof LoginFormValues, string>>;

//Formulaire
const Login = () => {
  const { t } = useTranslation('auth');

  const [userInfos, setUserInfos] = useState<LoginFormValues>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<LoginErrorResponse>({
    email: '',
    password: '',
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
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        userInfos,
        { headers: { 'Content-Type': 'application/json', withCredentials: true } }
      );
      // Traitement de la résponse
      if (response.data.success && response.data.data) {
        console.log('User created', response.data.data);
        toaster.create({
          title: t('login.successTitle'),
          description: t('login.successDescription'),
          type: 'success',
          duration: 3000,
          closable: true,
        });

        // Vider le formulaire
        setUserInfos({
          email: '',
          password: '',
        });

        // Redirection vers la page d'accueil
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        console.error('Logging in failed', response.data.message);
      }
    } catch (error) {
      console.log('error', error);
      // Traitement des erreurs
      if (axios.isAxiosError<LoginErrorResponse>(error)) {
        const loginError = error.response?.data || t('login.defaultError');
        if (loginError) {
          toaster.create({
            title: t('login.errorTitle'),
            description: loginError,
            type: 'error',
            duration: 3000,
            closable: true,
          });
        } else {
          toaster.create({
            title: t('login.serverErrorTitle'),
            description: t('login.serverErrorDescription'),
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
      [name]: LoginSchema.shape[name as keyof LoginFormValues],
    });

    const result = miniSchema.safeParse({ [name]: value });

    setErrors((prev) => {
      if (!result.success) {
        const flattened = z.flattenError(result.error);
        return {
          ...prev,
          [name]: flattened.fieldErrors[name as keyof LoginFormValues]?.[0] ?? '',
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
            <Heading size="3xl">{t('login.title')}</Heading>

            <Field.Root invalid={!!errors.email}>
              <Field.Label>
                <IoMailOutline />
                {t('login.email')}
              </Field.Label>
              <Input
                name="email"
                placeholder={t('login.emailPlaceholder')}
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
              <Field.Label>
                <TbPasswordUser />
                {t('login.password')}
              </Field.Label>
              <PasswordInput
                name="password"
                type="password"
                placeholder={t('login.passwordPlaceholder')}
                value={userInfos.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Field.ErrorText>
                <FieldErrorIcon /> {errors.password}
              </Field.ErrorText>
            </Field.Root>

            <Button
              disabled={isFormInvalid}
              loading={isSubmitting}
              loadingText={t('login.submitting')}
              type="submit"
            >
              {t('login.submit')}
              <RiArrowRightLine />
            </Button>
            <RouterLink to="/register">{t('login.noAccount')}</RouterLink>
          </VStack>
        </Box>
        <Toaster />
      </Flex>
    </PageLayout>
  );
};

export default Login;
