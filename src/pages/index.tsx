import { getCsrfToken, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import {
  Container,
  Text,
  Paper,
  LoadingOverlay,
  Title,
  Group,
  Stack,
  Center,
  Space,
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
    if (sessionStatus === "authenticated" && currentUser?.id) {
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
      <Center h="100%">
        <Paper shadow="xl" radius="md" p={100} color="primary">
          <Stack>
            <Title
              order={2}
              weight={300}
              italic
              color="dimmed"
              sx={{ margin: "0 !important" }}
            >
              welcome to
            </Title>
            <Title order={1} weight={400} sx={{ marginTop: "0 !important" }}>
              FlashSquad
            </Title>
            <Space />
            <Space />
            <LoadingOverlay visible={isLoading} />
            {error ? (
              <>
                <UserAuthSection />
                <Prism language="json">{JSON.stringify(error.message)}</Prism>
              </>
            ) : (
              <Group position="center">
                <AuthButton fullWidth />
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
