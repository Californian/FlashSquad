import { useRouter } from "next/router";
import Link from "next/link";
import { Accordion, Stack, NavLink, Title, Button, Group } from "@mantine/core";
import {
  faComments,
  faHouse,
  faPeopleGroup,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { SquadAccordionLabel, SquadVisibilityModal } from "@/components";
import { gql, useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import { useDisclosure } from "@mantine/hooks";

const GetUserSquadsQuery = gql`
  query GetUserSquads {
    squads {
      id
      displayName
      description
      squadImage {
        id
        url
        altText
      }
      userSquadRelationships {
        userId
        squadId
        isHidden
      }
      nftCollection {
        id
        contractAddress
      }
      brandColor
      typeface
      createdAt
      updatedAt
    }
  }
`;

interface SquadListProps {
  screenIsThin: boolean;
}

const SquadList: React.FC<SquadListProps> = ({ screenIsThin }) => {
  const { data: sessionData } = useSession();
  const { user: currentUser } = sessionData ?? {};

  const { data: { squads } = {}, refetch: refetchSquads } = useQuery(
    GetUserSquadsQuery,
    {
      variables: { userId: currentUser?.id },
      skip: !currentUser?.id,
    },
  );

  const {
    query: { squadId },
    asPath: path,
  } = useRouter();

  const [
    squadVisibilityModalIsOpened,
    { open: openSquadVisibilityModal, close: closeSquadVisibilityModal },
  ] = useDisclosure(false);

  return (
    <>
      <SquadVisibilityModal
        userId={currentUser?.id}
        squads={squads}
        opened={squadVisibilityModalIsOpened}
        close={closeSquadVisibilityModal}
        refetchSquads={refetchSquads}
      />
      <Group position="apart">
        <Title order={3} weight={300} sx={{ margin: "1rem !important" }}>
          Squads
        </Title>
        <Button
          variant="light"
          sx={{ margin: "1rem" }}
          onClick={openSquadVisibilityModal}
        >
          Edit
        </Button>
      </Group>
      <Accordion
        chevronPosition="right"
        variant="filled"
        transitionDuration={100}
        defaultValue={squadId as string | null | undefined}
      >
        {squads
          ?.slice()
          ?.filter(
            ({ userSquadRelationships: [{ isHidden = false } = {}] = [] }) =>
              !isHidden,
          )
          ?.map(
            ({
              id,
              displayName,
              description,
              squadImage,
              brandColor,
              typeface,
              createdAt,
              updatedAt,
            }) => (
              <Accordion.Item value={id} key={id}>
                <Accordion.Control>
                  <SquadAccordionLabel
                    {...{ displayName, image: squadImage, description }}
                  />
                </Accordion.Control>
                <Accordion.Panel>
                  <Stack spacing={0} mx="-1rem">
                    <NavLink
                      icon={<FontAwesomeIcon icon={faHouse} />}
                      label="Feed"
                      component={Link}
                      href={`/squads/${id}/feed`}
                      active={path === `/squads/${id}/feed`}
                    />
                    <NavLink
                      icon={<FontAwesomeIcon icon={faPeopleGroup} />}
                      label="Members"
                      component={Link}
                      href={`/squads/${id}/members`}
                      active={path === `/squads/${id}/members`}
                    />
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            ),
          )}
      </Accordion>
    </>
  );
};

export { SquadList };
