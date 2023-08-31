import { getCsrfToken, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { Prism } from "@mantine/prism";
import { useLocalStorage } from "@mantine/hooks";

import { UserAuthSection } from "@/components";

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

  const { data: sessionData } = useSession();
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
    if (status === "authenticated") {
      const firstSquadId = squads?.[0]?.id;
      if (lastVisitedSquadId) {
        router.push(`/squads/${lastVisitedSquadId}/feed`);
      } else if (firstSquadId) {
        setLastVisitedSquadId(firstSquadId);
        router.push(`/squads/${firstSquadId}/feed`);
      }
    }
  }, [lastVisitedSquadId, squads]);

  if (isLoading) return;

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <Prism language="json">{JSON.stringify(error.message)}</Prism>
      ) : (
        <UserAuthSection/>
      )}
    </>
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
