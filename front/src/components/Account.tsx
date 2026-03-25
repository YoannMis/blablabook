import { Box, Button, Field, Flex, Heading, Input, Spacer, VStack } from '@chakra-ui/react';
import { useCurrentUser } from '../context/UserContext';
import { PageLayout } from './layouts/PageLayout';
import homeImage from '../assets/homePageImage.jpg';
import MobileMenu from './MobileMenu';
import { PasswordInput } from './ui/password-input';

const AccountPage = () => {
  const { user } = useCurrentUser();

  // return <div>Bienvenue {user?.username}, je suis la Account Page !</div>;
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
            <Field.Root>
              <Field.Label>
                Nom d'utilisateur
                <Field.RequiredIndicator />
              </Field.Label>
              <Input type="text" disabled={true} name="username" value={user?.username} />
            </Field.Root>
            <Field.Root>
              <Field.Label>
                Adresse email
                <Field.RequiredIndicator />
              </Field.Label>
              <Input type="email" disabled={true} name="email" value={user?.email} />
            </Field.Root>
            <Field.Root>
              <Field.Label>
                Mot de passe
                <Field.RequiredIndicator />
              </Field.Label>
              <PasswordInput
                type="password"
                disabled={true}
                name="password"
                value={user?.password}
              />
            </Field.Root>
          </VStack>
          <Flex p={{ base: 4, md: 8 }} flexDirection={'column'} gap={4}>
            <Button variant={'solid'} width={'100%'}>
              Modifier
            </Button>
            <Spacer />
            <Button variant={'solid'} width={'100%'}>
              Supprimer
            </Button>
          </Flex>
        </Box>
      </Flex>
      <MobileMenu />
    </PageLayout>
  );
};

export default AccountPage;
