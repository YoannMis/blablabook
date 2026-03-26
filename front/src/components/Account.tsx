import {
  Box,
  Button,
  Field,
  FieldErrorIcon,
  Flex,
  Heading,
  Input,
  VStack,
  Dialog,
  CloseButton,
  Portal,
} from '@chakra-ui/react';
import { useCurrentUser } from '../context/UserContext';
import { PageLayout } from './layouts/PageLayout';
import homeImage from '../assets/homePageImage.jpg';
import MobileMenu from './MobileMenu';
import { PasswordInput } from './ui/password-input';
import { Toaster, toaster } from './ui/toaster';
import { useNavigate } from 'react-router';
import RegisterSchema from '../schema/register.schema';
import type { RegisterFormValues } from '../types/user';
import z from 'zod';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { axiosAuth } from '../utils/axiosAuth';

const AccountPage = () => {
  const { t } = useTranslation('auth');
  const { user } = useCurrentUser();
  const { logout } = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<RegisterFormValues>({
    username: user?.username || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const isFormValid =
    Object.values(errors).every((error) => error.length === 0) &&
    Object.values(formData).every((value) => !!value.trim());

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    // Enregistrer les modifications
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      password: '',
      confirmPassword: '',
    });
  };

  const getPasswordError = (password: string, confirmPassword: string) => {
    if (!confirmPassword) return '';
    if (password != confirmPassword) return t('register.passwordMismatch');
    return '';
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFormData = {
      ...formData,
      [event.target.name]: event.target.value,
    };

    setFormData(newFormData);
    setErrors((prev) => ({
      ...prev,
      confirmPassword: getPasswordError(newFormData.password, newFormData.confirmPassword),
    }));
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
      if (name === 'confirmPassword') {
        return {
          ...prev,
          confirmPassword: getPasswordError(formData.password, value),
        };
      }
      return { ...prev, [name]: '' };
    });
  };

  const handleDeleteClick = async () => {
    if (!user?.id) {
      toaster.create({
        title: 'Erreur',
        description: 'Impossible de supprimer le compte : identifiant utilisateur manquant.',
        type: 'error',
        duration: 5000,
        closable: true,
      });
      return;
    }

    setIsDeleting(true);
    try {
      const response = await axiosAuth.delete(`/api/auth/users/${user.id}`);

      if (response.data.success) {
        logout();
        toaster.create({
          title: 'Compte supprimé',
          description: 'Votre compte a été supprimé avec succès.',
          type: 'success',
          duration: 3000,
          closable: true,
        });

        setTimeout(() => {
          navigate('/');
        }, 4000);
      } else {
        console.error('Error deleting account:', response.data.message);
      }
    } catch (error) {
      toaster.create({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la suppression du compte.',
        type: 'error',
        duration: 3000,
        closable: true,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLogoutClick = async () => {
    try {
      const response = await axiosAuth.post('/api/auth/logout');
      if (!response.data.success) {
        console.error('Error logging out:', response.data.message);
        return;
      }
      logout();
      toaster.create({
        title: 'Deconnexion',
        description: 'Vous avez bien vous deconnecté.',
        type: 'success',
        duration: 3000,
        closable: true,
      });
      setTimeout(() => {
        navigate('/');
      }, 4000);
    } catch (error) {}
  };

  return (
    <PageLayout imageSrc={homeImage} imagePosition="left" imageSize={20}>
      <Flex justify="center" align="center" mt={{ md: '20%' }}>
        <Box
          as="form"
          borderWidth={{ base: 0, md: 4 }}
          borderRadius={{ base: 0, md: 4 }}
          width={{ base: '40vh', md: '50vh' }}
          height={{ base: '100vh', md: 'auto' }}
        >
          <VStack p={{ base: 4, md: 8 }} align="start" width="100%">
            <Heading
              size={{ base: 'xl', md: '3xl' }}
              fontWeight={{ base: 'sm', md: 'md' }}
              alignSelf="center"
            >
              Mon Compte
            </Heading>
            <Field.Root invalid={!!errors.username}>
              <Field.Label>
                Nom d'utilisateur
                <Field.RequiredIndicator />
              </Field.Label>
              <Input
                type="text"
                disabled={!isEditing}
                name="username"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {isEditing && (
                <Box minH={6}>
                  <Field.ErrorText>
                    <FieldErrorIcon />
                    {errors.username}
                  </Field.ErrorText>
                </Box>
              )}
            </Field.Root>
            <Field.Root invalid={!!errors.email}>
              <Field.Label>
                Adresse email
                <Field.RequiredIndicator />
              </Field.Label>
              <Input
                type="email"
                disabled={!isEditing}
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {isEditing && (
                <Box minH={6}>
                  <Field.ErrorText>
                    <FieldErrorIcon />
                    {errors.email}
                  </Field.ErrorText>
                </Box>
              )}
            </Field.Root>
            <Field.Root invalid={!!errors.password}>
              <Field.Label>
                Mot de passe
                <Field.RequiredIndicator />
              </Field.Label>
              <PasswordInput
                type="password"
                disabled={!isEditing}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {isEditing && (
                <Box minH={6}>
                  <Field.ErrorText>
                    <FieldErrorIcon />
                    {errors.password}
                  </Field.ErrorText>
                </Box>
              )}
            </Field.Root>
            {isEditing && (
              <Field.Root invalid={!!errors.confirmPassword}>
                <Field.Label>
                  Confirmer le mot de passe
                  <Field.RequiredIndicator />
                </Field.Label>
                <PasswordInput
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {isEditing && (
                  <Box minH={6}>
                    <Field.ErrorText>
                      <FieldErrorIcon />
                      {errors.confirmPassword}
                    </Field.ErrorText>
                  </Box>
                )}
              </Field.Root>
            )}
          </VStack>
          <Flex p={{ base: 4, md: 8 }} flexDirection={'column'} gap={4}>
            {!isEditing ? (
              <>
                <Button variant={'solid'} width={'100%'} onClick={handleLogoutClick}>
                  Se deconnecter
                </Button>
                <Button variant={'solid'} width={'100%'} onClick={handleEditClick}>
                  Modifier vos informations
                </Button>
                <Dialog.Root>
                  <Dialog.Trigger asChild>
                    <Button variant={'solid'} width={'100%'} colorScheme="red">
                      Supprimer
                    </Button>
                  </Dialog.Trigger>
                  <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                      <Dialog.Content>
                        <Dialog.Header>
                          <Dialog.Title>Supprimer le compte</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                          <p>
                            Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est
                            irréversible.
                          </p>
                        </Dialog.Body>
                        <Dialog.Footer>
                          <Dialog.ActionTrigger asChild>
                            <Button>Non</Button>
                          </Dialog.ActionTrigger>
                          <Button onClick={handleDeleteClick} loading={isDeleting}>
                            Oui
                          </Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                          <CloseButton size="sm" position="absolute" top={2} right={2} />
                        </Dialog.CloseTrigger>
                      </Dialog.Content>
                    </Dialog.Positioner>
                  </Portal>
                </Dialog.Root>
              </>
            ) : (
              <>
                <Button
                  variant={'solid'}
                  width={'100%'}
                  onClick={handleSaveClick}
                  disabled={!isFormValid}
                >
                  Valider les changements
                </Button>

                <Button variant={'solid'} width={'100%'} onClick={handleCancelClick}>
                  Annuler tous changements
                </Button>
              </>
            )}
          </Flex>
        </Box>
        <Toaster />
      </Flex>
      <MobileMenu />
    </PageLayout>
  );
};
export default AccountPage;
