import { getCsrfToken, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import {
  Container,
  Loader,
  Text,
  Paper,
  LoadingOverlay,
  Title,
  Group,
  Stack,
  Center,
} from "@mantine/core";
import { Prism } from "@mantine/prism";
import { useLocalStorage } from "@mantine/hooks";

import { AuthButton, UserAuthSection } from "@/components";

const GetUserSquadsQuery = gql`
  query GetUserSquads($userId: uuid!) {
    squads(
      where: {
        userSquadRelationships: {
          userId: { _eq: $userId }
          isHidden: { _eq: false }
        }
      }
    ) {
      id
    }
  }
`;

export default function HomePage() {
  const [lastVisitedSquadId, setLastVisitedSquadId] = useLocalStorage<string>({
    key: "last-visited-squad",
  });

  const { data: sessionData, status: sessionStatus } = useSession();
  const { user: currentUser } = sessionData ?? {};

  const {
    data: { squads } = {},
    loading: isLoading,
    error,
  } = useQuery(GetUserSquadsQuery, {
    variables: { userId: currentUser?.id },
    skip: !currentUser?.id || !!lastVisitedSquadId,
  });

  const router = useRouter();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      const firstSquadId = squads?.[0]?.id;
      if (lastVisitedSquadId) {
        router.push(`/squads/${lastVisitedSquadId}/feed`);
      } else if (firstSquadId) {
        setLastVisitedSquadId(firstSquadId);
        router.push(`/squads/${firstSquadId}/feed`);
      }
    }
  }, [lastVisitedSquadId, squads, sessionStatus]);

  return (
    <Container size="xs" p="sm" h="100vh">
      <Center>
        <Paper shadow="xl" radius="lg" p="lg">
          <Stack>
            <Title fw={350}>Welcome to FlashSquad</Title>
            <LoadingOverlay visible={isLoading} />
            {error ? (
              <>
                <UserAuthSection />
                <Prism language="json">{JSON.stringify(error.message)}</Prism>
              </>
            ) : (
              <Group position="center">
                <AuthButton />
                {sessionStatus === "authenticated" && !isLoading && (
                  <Text>You'll need an NFT to get started!</Text>
                )}
              </Group>
            )}
          </Stack>
        </Paper>
      </Center>
    </Container>
  );
}

// TODO Abstract this to get CSRF token on every page.
export async function getServerSideProps(context: any) {
  return {
    props: {
      csrfToken: (await getCsrfToken(context)) ?? {},
    },
  };
}
