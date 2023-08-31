import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Popover, Center, Title, Button, useMantineTheme } from "@mantine/core";

import { SquadDetails } from "@/components";
import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";

const GetCurrentSquadQuery = gql`
  query GetCurrentSquad($squadId: Uuid) {
    squadsByPk(id: $squadId) {
      id
      displayName
      image {
        id
        url
        altText
      }
    }
  }
`;

interface AppTitleProps {
  title?: string;
  screenIsThin: boolean;
}

const AppTitle: React.FC<AppTitleProps> = ({ title, screenIsThin }) => {
  const theme = useMantineTheme();

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
  const appTitle = title ?? currentSquad?.displayName ?? "FlashSquad";

  return (
    <Popover position="bottom" withArrow shadow="lg" disabled={screenIsThin}>
      <Popover.Target>
        <Center h="100%">
          {screenIsThin ? (
            <Title
              order={1}
              size="h3"
              weight={500}
              color={theme.colors[theme.primaryColor][theme.fn.primaryShade()]}
            >
              {appTitle}
            </Title>
          ) : (
            <Button
              h="100%"
              variant="subtle"
              compact
              styles={(theme) => ({
                label: {
                  fontSize: "1.375rem",
                  fontWeight: 500,
                  color:
                    theme.colors[theme.primaryColor][theme.fn.primaryShade()],
                  verticalAlign: "center",
                },
                inner: {
                  height: "100%",
                },
                root: {
                  height: "100%",
                },
              })}
              rightIcon={
                <FontAwesomeIcon
                  size="lg"
                  icon={faCircleInfo}
                  color={theme.colors.gray[4]}
                />
              }
            >
              {appTitle}
            </Button>
          )}
        </Center>
      </Popover.Target>

      <Popover.Dropdown>
        <SquadDetails width={540} />
      </Popover.Dropdown>
    </Popover>
  );
};

export { AppTitle };
