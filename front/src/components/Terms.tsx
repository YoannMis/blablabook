import { Box, Heading, Text, Stack, List, Icon, Button } from '@chakra-ui/react';

import { FaBook } from 'react-icons/fa';
import { PageLayout } from './layouts/PageLayout';

import homeImage from '../assets/homePageImage.jpg';
import MobileMenu from './MobileMenu';
import { Link as RouterLink } from 'react-router';

const Terms = () => {
  return (
    <PageLayout imageSrc={homeImage}>
      <Box my={8} px={{ base: 4, md: 8 }} py={8} borderRadius="lg" boxShadow="md">
        <Stack gap={6}>
          {/* En-tête */}
          <Box textAlign="center" textDecoration={'underline'}>
            <Icon as={FaBook} boxSize={10} color="blue.500" mb={2} />
            <Heading size={{ base: '2xl', md: '4xl' }} fontWeight={{ base: 'sm', md: 'md' }} mb={2}>
              Conditions Générales d’Utilisation
            </Heading>
            <Text fontWeight={{ base: 'sm', md: 'md' }}>Application Blablabook</Text>
          </Box>

          {/* Article 1 */}
          <Box>
            <Heading
              textDecoration={'underline'}
              size={{ base: 'xl', md: '3xl' }}
              fontWeight={{ base: 'sm', md: 'md' }}
              mb={2}
            >
              Article 1 – Objet
            </Heading>
            <Text>
              Les présentes Conditions Générales d’Utilisation (CGU) ont pour objet de définir les
              modalités et conditions d’utilisation du site{' '}
              <Text as="span" fontWeight="semibold">
                Blablabook
              </Text>
              . L’utilisation du site implique l’acceptation pleine et entière des présentes CGU.
            </Text>
          </Box>

          {/* Article 2 */}
          <Box>
            <Heading
              textDecoration={'underline'}
              size={{ base: 'xl', md: '3xl' }}
              fontWeight={{ base: 'sm', md: 'md' }}
              mb={2}
            >
              Article 2 – Éditeur du site
            </Heading>
            <Text mb={2}>
              Le site Blablabook est édité dans le cadre d’un{' '}
              <Text as="span" fontWeight="semibold">
                projet pédagogique réalisé par un groupe de travail
              </Text>
              . Aucune structure juridique formelle (société ou association déclarée) n’est
              constituée à ce jour.
            </Text>
            <Text>Pour toute question, vous pouvez contacter :</Text>
            <Text mt={1}>
              📧 Email :{' '}
              <Text as="span" fontStyle="italic">
                [à compléter]
              </Text>
            </Text>
          </Box>

          {/* Article 3 */}
          <Box>
            <Heading
              textDecoration={'underline'}
              size={{ base: 'xl', md: '3xl' }}
              fontWeight={{ base: 'sm', md: 'md' }}
              mb={2}
            >
              Article 3 – Hébergement
            </Heading>
            <Text>
              Le site est hébergé à titre provisoire par une plateforme d’hébergement de type cloud
              (ex : Vercel ou équivalent). Les informations précises d’hébergement pourront être
              mises à jour ultérieurement.
            </Text>
          </Box>

          {/* Article 4 */}
          <Box>
            <Heading
              textDecoration={'underline'}
              size={{ base: 'xl', md: '3xl' }}
              fontWeight={{ base: 'sm', md: 'md' }}
              mb={2}
            >
              Article 4 – Description du service
            </Heading>
            <Text mb={2}>Blablabook est une application permettant :</Text>
            <List.Root pl={4}>
              <List.Item>de consulter une base de données de livres ;</List.Item>
              <List.Item>de rechercher des ouvrages ;</List.Item>
              <List.Item>de constituer une bibliothèque personnelle ;</List.Item>
              <List.Item>de marquer des livres comme lus ou à lire.</List.Item>
            </List.Root>
            <Text mt={3}>
              Les données relatives aux livres (titres, descriptions, images) proviennent
              exclusivement de l’API fournie par Google Books API. Le site ne modifie pas ces
              contenus.
            </Text>
          </Box>

          {/* Article 5 */}
          <Box>
            <Heading
              textDecoration={'underline'}
              size={{ base: 'xl', md: '3xl' }}
              fontWeight={{ base: 'sm', md: 'md' }}
              mb={2}
            >
              Article 5 – Accès au service
            </Heading>
            <Text mb={2}>
              Le site est accessible gratuitement à tout utilisateur disposant d’un accès à
              Internet.
            </Text>
            <List.Root pl={4}>
              <List.Item>
                L’accès à certaines fonctionnalités (bibliothèque personnelle) nécessite la création
                d’un compte.
              </List.Item>
              <List.Item>La consultation des livres peut être accessible sans compte.</List.Item>
            </List.Root>
            <Text mt={3}>L’éditeur ne garantit pas un accès continu et sans interruption.</Text>
          </Box>

          {/* Article 6 */}
          <Box>
            <Heading
              textDecoration={'underline'}
              size={{ base: 'xl', md: '3xl' }}
              fontWeight={{ base: 'sm', md: 'md' }}
              mb={2}
            >
              Article 6 – Conditions d’inscription
            </Heading>
            <Text mb={2}>Pour créer un compte, l’utilisateur doit :</Text>
            <List.Root pl={4}>
              <List.Item>fournir une adresse email valide ;</List.Item>
              <List.Item>ne pas usurper l’identité d’un tiers.</List.Item>
            </List.Root>
            <Text mt={3}>
              L’utilisateur est responsable de la confidentialité de ses identifiants.
            </Text>
          </Box>

          {/* Article 7 */}
          <Box>
            <Heading
              textDecoration={'underline'}
              size={{ base: 'xl', md: '3xl' }}
              fontWeight={{ base: 'sm', md: 'md' }}
              mb={2}
            >
              Article 7 – Données personnelles
            </Heading>
            <Text mb={2}>Le site collecte uniquement les données suivantes :</Text>
            <List.Root pl={4}>
              <List.Item>adresse email.</List.Item>
            </List.Root>
            <Text mt={3}>Aucune donnée sensible n’est collectée.</Text>
            <Text mt={3}>Des cookies strictement techniques peuvent être utilisés pour :</Text>
            <List.Root pl={4}>
              <List.Item>assurer le fonctionnement du service ;</List.Item>
              <List.Item>maintenir la session utilisateur.</List.Item>
            </List.Root>
            <Text mt={3}>Aucun tracking ni analyse comportementale n’est réalisé.</Text>
          </Box>

          {/* Article 8 */}
          <Box>
            <Heading
              textDecoration={'underline'}
              size={{ base: 'xl', md: '3xl' }}
              fontWeight={{ base: 'sm', md: 'md' }}
              mb={2}
            >
              Article 8 – Propriété intellectuelle
            </Heading>
            <Text mb={2}>
              Les contenus affichés (livres, images, descriptions) proviennent de Google Books API
              et restent la propriété de leurs ayants droit. L’application Blablabook ne revendique
              aucun droit sur ces contenus.
            </Text>
            <Text>
              L’utilisateur dispose uniquement d’un droit d’usage personnel et non commercial.
            </Text>
          </Box>

          {/* Article 9 */}
          <Box>
            <Heading
              textDecoration={'underline'}
              size={{ base: 'xl', md: '3xl' }}
              fontWeight={{ base: 'sm', md: 'md' }}
              mb={2}
            >
              Article 9 – Utilisation du service
            </Heading>
            <Text mb={2}>L’utilisateur s’engage à ne pas :</Text>
            <List.Root pl={4}>
              <List.Item>utiliser le site de manière frauduleuse ;</List.Item>
              <List.Item>tenter d’accéder de manière non autorisée aux systèmes ;</List.Item>
              <List.Item>détourner le service de son usage normal ;</List.Item>
              <List.Item>porter atteinte à la sécurité ou à l’intégrité du site.</List.Item>
            </List.Root>
            <Text mt={3}>
              Tout manquement peut entraîner la suspension ou la suppression du compte.
            </Text>
          </Box>

          {/* Article 10 */}
          <Box>
            <Heading
              textDecoration={'underline'}
              size={{ base: 'xl', md: '3xl' }}
              fontWeight={{ base: 'sm', md: 'md' }}
              mb={2}
            >
              Article 10 – Gestion des comptes
            </Heading>
            <Text mb={2}>
              L’utilisateur peut demander la suppression de son compte à tout moment.
            </Text>
            <Text>
              L’éditeur se réserve le droit de suspendre ou supprimer un compte, et de refuser
              l’accès au service sans préavis en cas de non-respect des présentes CGU.
            </Text>
          </Box>

          {/* Article 11 */}
          <Box>
            <Heading
              textDecoration={'underline'}
              size={{ base: 'xl', md: '3xl' }}
              fontWeight={{ base: 'sm', md: 'md' }}
              mb={2}
            >
              Article 11 – Responsabilité
            </Heading>
            <Text mb={2}>Le site est fourni « tel quel », sans garantie.</Text>
            <List.Root pl={4}>
              <List.Item>
                L’éditeur ne saurait être tenu responsable des interruptions de service (notamment
                liées à l’API Google Books API) ;
              </List.Item>
              <List.Item>des bugs ou dysfonctionnements ;</List.Item>
              <List.Item>de la perte éventuelle de données ;</List.Item>
              <List.Item>de l’indisponibilité temporaire ou permanente du service.</List.Item>
            </List.Root>
            <Text mt={3}>
              L’utilisateur reconnaît utiliser le service sous sa seule responsabilité.
            </Text>
          </Box>

          {/* Article 12 */}
          <Box>
            <Heading
              textDecoration={'underline'}
              size={{ base: 'xl', md: '3xl' }}
              fontWeight={{ base: 'sm', md: 'md' }}
              mb={2}
            >
              Article 12 – Évolution du service
            </Heading>
            <Text>
              Le site peut être modifié, suspendu ou interrompu à tout moment, sans préavis. Aucune
              garantie de continuité n’est assurée, notamment dans le cadre d’un projet pédagogique.
            </Text>
          </Box>

          {/* Article 13 */}
          <Box>
            <Heading
              textDecoration={'underline'}
              size={{ base: 'xl', md: '3xl' }}
              fontWeight={{ base: 'sm', md: 'md' }}
              mb={2}
            >
              Article 13 – Modification des CGU
            </Heading>
            <Text>
              Les présentes CGU peuvent être modifiées à tout moment. Les utilisateurs seront
              informés en cas de modification substantielle.
            </Text>
          </Box>

          {/* Article 14 */}
          <Box>
            <Heading
              textDecoration={'underline'}
              size={{ base: 'xl', md: '3xl' }}
              fontWeight={{ base: 'sm', md: 'md' }}
              mb={2}
            >
              Article 14 – Droit applicable
            </Heading>
            <Text>
              Les présentes CGU sont régies par le droit français. En cas de litige, et à défaut de
              résolution amiable, les juridictions françaises seront compétentes.
            </Text>
          </Box>
          <Button asChild width="100%" variant="solid">
            <RouterLink to="/register">Retour</RouterLink>
          </Button>
        </Stack>
      </Box>
      <MobileMenu />
    </PageLayout>
  );
};

export default Terms;
