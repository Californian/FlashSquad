import {
  AppShell,
  Container,
  Title,
  useMantineTheme,
  Space,
} from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";

import {
  AppHeader,
  AppFooter,
  NavigationPanel,
  SettingsPanel,
} from "@/components";
import { useColorSchemeSwitcher } from "color-scheme-switcher";

interface AppShellProps {
  appTitle?: string;
  pageTitle?: string;
  children: React.ReactNode;
}

const FlashSquadAppShell: React.FC<AppShellProps> = ({
  appTitle,
  pageTitle,
  children,
}) => {
  const theme = useMantineTheme();
  const screenIsThinMediaQuery = theme.fn
    .smallerThan("sm")
    .replace("@media ", "");
  const screenIsWideMediaQuery = theme.fn
    .largerThan("md")
    .replace("@media ", "");

  const screenIsThin = useMediaQuery(screenIsThinMediaQuery);
  const screenIsWide = useMediaQuery(screenIsWideMediaQuery);

  const [navigationPanelIsOpen, setNavigationPanelIsOpen] = useState(false);
  const [settingsPanelIsOpen, setSettingsPanelIsOpen] = useState(false);

  // Actions which are performed when screen is resized.
  useEffect(() => {
    if (screenIsWide) {
      setNavigationPanelIsOpen(true);
      setSettingsPanelIsOpen(true);
    } else if (screenIsThin) {
      setNavigationPanelIsOpen(false);
      setSettingsPanelIsOpen(false);
    } else {
      setNavigationPanelIsOpen(true);
      setSettingsPanelIsOpen(false);
    }
  }, [screenIsThin, screenIsWide]);

  // Only allow one side panel to be open at a time if the screen is thin.
  useEffect(() => {
    if (screenIsThin && navigationPanelIsOpen) {
      setSettingsPanelIsOpen(false);
    }
  }, [navigationPanelIsOpen]);
  useEffect(() => {
    if (screenIsThin && settingsPanelIsOpen) {
      setNavigationPanelIsOpen(false);
    }
  }, [settingsPanelIsOpen]);

  const router = useRouter();

  // Close panels, as appropriate, when navigating to a new page.
  useEffect(() => {
    const handleRouteChange = () => {
      if (screenIsThin) {
        setNavigationPanelIsOpen(false);
        setSettingsPanelIsOpen(false);
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);

    // When the component is unmounted, unsubscribe from the event with the
    // `off` method.
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router]);

  // Properties for shell header and footer.
  const shellProps = {
    screenIsThin,
    navigationPanelIsOpen,
    settingsPanelIsOpen,
    setNavigationPanelIsOpen,
    setSettingsPanelIsOpen,
  };

  const { colorSchemeIsLight } = useColorSchemeSwitcher();

  return (
    <AppShell
      padding="md"
      header={<AppHeader {...{ ...shellProps, appTitle }} />}
      footer={<AppFooter {...shellProps} />}
      navbar={
        <NavigationPanel
          screenIsThin={screenIsThin}
          navigationPanelIsOpen={navigationPanelIsOpen}
        />
      }
      aside={
        <SettingsPanel
          screenIsThin={screenIsThin}
          settingsPanelIsOpen={settingsPanelIsOpen}
        />
      }
      styles={(theme) => ({
        main: {
          backgroundColor: colorSchemeIsLight ? "white" : "black",
        },
      })}
    >
      <Container size="xs" p="sm" h="100%">
        {pageTitle ? (
          <>
            <Title order={1} weight={350}>
              {pageTitle}
            </Title>

            <Space h="lg" />
          </>
        ) : (
          <></>
        )}

        {children}
      </Container>
    </AppShell>
  );
};

export { FlashSquadAppShell };
