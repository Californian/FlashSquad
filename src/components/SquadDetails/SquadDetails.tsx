import { gql, useQuery } from "@apollo/client";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Stack,
  Group,
  Anchor,
  Center,
  ActionIcon,
  Image,
  Text,
  Box,
  useMantineTheme,
} from "@mantine/core";
import { useRouter } from "next/router";
import { useRef, useState, useLayoutEffect } from "react";

interface SquadDetailsProps {
  width?: number | string;
}

const GetCurrentSquadQuery = gql`
  query GetCurrentSquad($squadId: uuid!) {
    squadsByPk(id: $squadId) {
      id
      contractAddress
      tokenId
      displayName
      description
      brandColor
      typeface
      image {
        id
        url
        altText
        description
      }
      createdAt
      updatedAt
    }
  }
`;

const SquadDetails: React.FC<SquadDetailsProps> = ({ width = "100%" }) => {
  const descriptionRef = useRef<HTMLDivElement | null>(null);
  const [descriptionIsExpanded, setDescriptionIsExpanded] = useState(false);
  const [descriptionIsExpandable, setDescriptionIsExpandable] = useState(false);

  useLayoutEffect(() => {
    if (
      descriptionRef.current &&
      descriptionRef.current.clientHeight < descriptionRef.current.scrollHeight
    ) {
      setDescriptionIsExpandable(true);
    } else {
      setDescriptionIsExpandable(false);
    }
  }, [descriptionRef]);

  const theme = useMantineTheme();

  const PHI = (1 + Math.sqrt(5)) / 2;

  const {
    query: { squadId },
  } = useRouter();

  const {
    loading: currentSquadIsLoading,
    error: currentSquadError,
    data: { squadsByPk: currentSquad } = {},
  } = useQuery(GetCurrentSquadQuery, {
    variables: { squadId },
    skip: !squadId,
  });

  return (
    <Stack
      sx={(theme) => ({
        width,
        height: "auto",
      })}
      p="md"
      pb={0}
    >
      <Group position="apart" h={128}>
        <Box sx={{ aspectRatio: `${PHI} / 1`, height: "100%" }}>
          <Image
            src={currentSquad?.image?.url}
            radius="md"
            styles={{
              root: {
                aspectRatio: `${PHI} / 1`,
                height: "100%",
                width: "auto",
              },
              imageWrapper: {
                aspectRatio: `${PHI} / 1`,
                height: "100%",
                width: "auto",
              },
              figure: {
                aspectRatio: `${PHI} / 1`,
                height: "100%",
                width: "auto",
              },
              image: {
                aspectRatio: `${PHI} / 1`,
                height: "100%",
                width: "auto",
              },
              placeholder: {
                aspectRatio: `${PHI} / 1`,
                height: "100%",
                width: "auto",
              },
            }}
          />
        </Box>

        <Group position="center" p="lg"></Group>
      </Group>
      <Text
        ref={descriptionRef}
        lineClamp={descriptionIsExpanded ? undefined : 2}
      >
        {currentSquad?.description}
      </Text>
      <Center>
        <ActionIcon
          size="xs"
          onClick={() => setDescriptionIsExpanded(!descriptionIsExpanded)}
          sx={{
            display: descriptionIsExpandable ? undefined : "none",
          }}
        >
          <FontAwesomeIcon
            size="xs"
            color={theme.colors.gray[6]}
            icon={descriptionIsExpanded ? faChevronUp : faChevronDown}
          />
        </ActionIcon>
      </Center>
    </Stack>
  );
};

export { SquadDetails };
