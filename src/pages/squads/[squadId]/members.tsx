import {
  Card,
  Text,
  Center,
  Group,
  Title,
  ActionIcon,
  Space,
  Avatar,
  Flex,
  Stack,
  Box,
} from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faEthereum, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { gql, useQuery } from "@apollo/client";

import { FlashSquadAppShell } from "@/components";
import { useRouter } from "next/router";

const GetSquadMembersQuery = gql`
  query GetSquadMembers($squadId: uuid!) {
    squadsByPk(id: $squadId) {
      id
      displayName
      description
      brandColor
      squadImage {
        id
        altText
        url
      }
      nftCollection {
        id
        network
        contractAddress
        nfts {
          id
          tokenId
          persona {
            id
            displayName
            bio
            profileImage {
              id
              altText
              description
              url
            }
          }
          wallet {
            id
            address
            ensName
          }
        }
      }
    }
  }
`;

const SquadMembersPage = () => {
  const {
    query: { squadId },
  } = useRouter();

  const {
    data: { squadsByPk: { nftCollection: { nfts = [] } = {} } = {} } = {},
  } = useQuery(GetSquadMembersQuery, {
    variables: { squadId },
    skip: !squadId,
  });

  return (
    <FlashSquadAppShell pageTitle="Members">
      {nfts.map(
        ({
          tokenId,
          persona: {
            id: personaId,
            displayName,
            bio,
            profileImage: {
              url: profileImageUrl,
              altText: profileImageAltText,
            },
          },
        }) => (
          <Box key={personaId}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Flex
                mih={50}
                w="100%"
                gap="md"
                justify="flex-start"
                align="center"
                direction="row"
                wrap="nowrap"
              >
                <Avatar
                  src={profileImageUrl}
                  alt={profileImageAltText}
                  size="md"
                  radius="md"
                >
                  <FontAwesomeIcon icon={faUser} />
                </Avatar>

                <Stack w="100%">
                  <Group position="apart" mb="xs" h="100%" w="100%">
                    <Center>
                      <Title order={2} weight={300}>
                        {displayName ?? tokenId}
                      </Title>
                    </Center>
                  </Group>

                  <Text>{bio}</Text>
                </Stack>
              </Flex>
            </Card>

            <Space h="md" />
          </Box>
        ),
      )}
    </FlashSquadAppShell>
  );
};

export default SquadMembersPage;
