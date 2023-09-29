import { useRouter } from "next/router";
import Link from "next/link";
import { Accordion, Stack, NavLink } from "@mantine/core";
import {
  faComments,
  faHouse,
  faPeopleGroup,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { SquadAccordionLabel } from "@/components";
import { gql, useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";

const GetUserSquadsQuery = gql`
  query GetUserSquads {
    squads(where: { nftCollection: { nfts: { isHidden: { _eq: false } } } }) {
      id
      displayName
      description
      squadImage {
        id
        url
        altText
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

  const { data: { squads } = {} } = useQuery(GetUserSquadsQuery, {
    variables: { userId: currentUser?.id },
    skip: !currentUser?.id,
  });

  const {
    query: { squadId },
    asPath: path,
  } = useRouter();

  return (
    <Accordion
      chevronPosition="right"
      variant="filled"
      transitionDuration={100}
      defaultValue={squadId as string | null | undefined}
    >
      {squads?.map(
        ({
          id,
          displayName,
          description,
          image,
          brandColor,
          typeface,
          createdAt,
          updatedAt,
        }) => (
          <Accordion.Item value={id} key={id}>
            <Accordion.Control>
              <SquadAccordionLabel {...{ displayName, image, description }} />
            </Accordion.Control>
            <Accordion.Panel>
              <Stack
                display={screenIsThin ? "none" : undefined}
                spacing={0}
                mx="-1rem"
              >
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
  );
};

export { SquadList };
