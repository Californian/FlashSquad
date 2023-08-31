import {
  ActionIcon,
  Flex,
  Group,
  Header,
  MediaQuery,
  useMantineTheme,
} from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faGear } from "@fortawesome/free-solid-svg-icons";

import { AppTitle } from "@/components";
import { useColorSchemeSwitcher } from "color-scheme-switcher";

interface AppHeaderProps {
  screenIsThin: boolean;
  navigationPanelIsOpen: boolean;
  settingsPanelIsOpen: boolean;
  setNavigationPanelIsOpen: (v: boolean) => void;
  setSettingsPanelIsOpen: (v: boolean) => void;
  appTitle?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  screenIsThin,
  navigationPanelIsOpen,
  settingsPanelIsOpen,
  setNavigationPanelIsOpen,
  setSettingsPanelIsOpen,
  appTitle,
}) => {
  const theme = useMantineTheme();
  const { colorSchemeIsLight } = useColorSchemeSwitcher();

  return (
    <Header
      height={screenIsThin ? 48 : 64}
      p="xs"
      sx={{
        backgroundColor: colorSchemeIsLight ? "white" : "black",
      }}
    >
      <Flex justify={screenIsThin ? "center" : "space-between"} align="center">
        <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
          <Group position="left" display={screenIsThin ? "none" : undefined}>
            <ActionIcon
              size="xl"
              variant={navigationPanelIsOpen ? "light" : "subtle"}
              onClick={() => setNavigationPanelIsOpen(!navigationPanelIsOpen)}
              color={theme.colors[theme.primaryColor][theme.fn.primaryShade()]}
            >
              <FontAwesomeIcon icon={faBars} />
            </ActionIcon>
          </Group>
        </MediaQuery>

        <Group position="center" grow h="100%">
          <AppTitle title={appTitle} screenIsThin={screenIsThin} />
        </Group>

        <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
          <Group position="right">
            <ActionIcon
              size="xl"
              variant={settingsPanelIsOpen ? "light" : "subtle"}
              onClick={() => setSettingsPanelIsOpen(!settingsPanelIsOpen)}
              color={theme.colors[theme.primaryColor][theme.fn.primaryShade()]}
            >
              <FontAwesomeIcon icon={faGear} />
            </ActionIcon>
          </Group>
        </MediaQuery>
      </Flex>
    </Header>
  );
};

export { AppHeader };
