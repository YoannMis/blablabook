import z, { set } from 'zod';
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
  Checkbox,
  Link,
} from '@chakra-ui/react';
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
import MobileMenu from './MobileMenu';

//Typage Typescript
type LoginFormValues = z.infer<typeof LoginSchema>;
type LoginErrorResponse = Partial<Record<keyof LoginFormValues, string>>;

//Formulaire
const Login = () => {
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
  const [checked, setChecked] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const isFormInvalid =
    Object.values(errors).some((error) => error.length > 0) ||
    Object.values(userInfos).some((value) => !value) ||
    !checked;

  // fonction de soumission du formulaire
  // en attente du back pour les responses de axios
  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        { ...userInfos, rememberMe },
        { headers: { 'Content-Type': 'application/json', withCredentials: true } }
      );
      // Traitement de la résponse
      if (response.data.success && response.data.data) {
        console.log('User created', response.data.data);
        toaster.create({
          title: 'Login Success',
          description: `You have successfully Logged in`,
          type: 'success',
          duration: 3000,
          closable: true,
        });

        // Vider le formulaire
        setUserInfos({
          email: '',
          password: '',
        });

        // Redirection vers la page de connexion
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        console.error('Logging in failed', response.data.message);
      }
    } catch (error) {
      // Gestion des erreurs (y compris les erreurs lancées par le backend)
      if (axios.isAxiosError(error)) {
        // Erreur HTTP (ex: 401, 500)
        const errorMessage = error.response?.data?.message || error.message;
        toaster.create({
          title: 'Login Error',
          description:
            errorMessage === 'INVALID_CREDENTIALS' ? 'Invalid email or password' : errorMessage,
          type: 'error',
          duration: 3000,
          closable: true,
        });
      } else if (error instanceof Error) {
        // Erreur lancée manuellement (ex: throw new Error)
        toaster.create({
          title: 'Login Error',
          description:
            error.message === 'INVALID_CREDENTIALS'
              ? 'Invalid email or password'
              : 'An unexpected error occurred',
          type: 'error',
          duration: 3000,
          closable: true,
        });
      } else {
        // Erreur inattendue
        toaster.create({
          title: 'Server Error',
          description: 'The server is not reachable',
          type: 'error',
          duration: 3000,
          closable: true,
        });
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
            <VStack gap={4} p={{ base: 4, md: 8 }}>
              <Heading size="3xl">Connection</Heading>

              <Field.Root invalid={!!errors.email}>
                <Field.Label>
                  <IoMailOutline />
                  Email
                </Field.Label>
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
                <Field.Label>
                  <TbPasswordUser />
                  Password
                </Field.Label>
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
              <Checkbox.Root
                checked={rememberMe}
                onCheckedChange={(e) => setRememberMe(!!e.checked)}
              >
                <Checkbox.HiddenInput name="rememberMe" />
                <Checkbox.Control />
                <Checkbox.Label>Remember me</Checkbox.Label>
              </Checkbox.Root>

              <Checkbox.Root checked={checked} onCheckedChange={(e) => setChecked(!!e.checked)}>
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>
                  I agree to the{' '}
                  <Link colorPalette="teal" href="https://google.com">
                    terms and conditions
                  </Link>
                </Checkbox.Label>
              </Checkbox.Root>

              <Button
                disabled={isFormInvalid && !checked}
                loading={isSubmitting}
                loadingText="Logging in ..."
                type="submit"
                width={{ base: '30vh', md: '40vh' }}
              >
                Login
                <RiArrowRightLine />
              </Button>
              <RouterLink to="/register">You don't have an account ?</RouterLink>
            </VStack>
          </Box>
          <Toaster />
        </Flex>
      </AbsoluteCenter>
      <MobileMenu />
    </PageLayout>
  );
};

export default Login;
