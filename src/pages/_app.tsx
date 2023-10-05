import { useEffect, useState } from "react";
import NextApp, { AppContext } from "next/app";
import type { AppProps } from "next/app";
// TODO: Set and get cookie for color scheme and other visual aspects so
// pageloads after the first are less jittery.
// Alternately, read from local storage in SSR call.
// All of this might be better handled with Apollo.
// import { getCookie, setCookie } from "cookies-next";
import { getCookie } from "cookies-next";
import Head from "next/head";
import {
  DEFAULT_THEME,
  MantineColor,
  MantineProvider,
  TypographyStylesProvider,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";
import { ColorSchemeSwitcherProvider } from "color-scheme-switcher";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { mainnet, polygon, optimism } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { InjectedConnector } from "wagmi/connectors/injected";

import { ApolloProviderWrapper, AuthChecker } from "@/components";
import { useRouter } from "next/router";
import { PrimaryColorSwitcherProvider } from "@/utils";

export const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism],
  [publicProvider()],
);

const config = createConfig({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  publicClient,
});

const App = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{
  session: Session;
}>) => {
  const [_lastVisitedSquad, setLastVisitedSquad] = useLocalStorage<string>({
    key: "last-visited-squad",
  });

  const defaultColorSchemeIsLight = false;
  const [colorScheme, setColorScheme] = useState<"light" | "dark">(
    defaultColorSchemeIsLight ? "light" : "dark",
  );

  const setColorSchemeIsLightCallback = (colorSchemeIsLight: boolean) => {
    setColorScheme(colorSchemeIsLight ? "light" : "dark");
  };

  const [primaryColor, setPrimaryColor] = useState<string>(
    DEFAULT_THEME.primaryColor,
  );

  const setPrimaryColorCallback = (primaryColor: string) => {
    setPrimaryColor(primaryColor);
  };

  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      const squadId = url?.split("squads").at(-1)?.split("/").at(1);

      if (
        squadId?.match(
          /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
        )
      ) {
        setLastVisitedSquad(squadId);
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router]);

  return (
    <>
      <Head>
        <title>FlashSquad</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link rel="shortcut icon" href="/favicon.svg" />
      </Head>

      <ColorSchemeSwitcherProvider
        defaultColorSchemeIsLight={defaultColorSchemeIsLight}
        setColorSchemeIsLightCallback={setColorSchemeIsLightCallback}
      >
        <PrimaryColorSwitcherProvider
          setPrimaryColorCallback={setPrimaryColorCallback}
        >
          <MantineProvider
            theme={{
              colorScheme,
              primaryColor,
              loader: "dots",
              colors: {
                brown: [
                  "#EFEBE9",
                  "#D7CCC8",
                  "#BCAAA4",
                  "#A1887F",
                  "#8D6E63",
                  "#795548",
                  "#6D4C41",
                  "#5D4037",
                  "#4E342E",
                  "#3E2723",
                ],
              },
              globalStyles: (theme) => ({
                body: {
                  backgroundColor:
                    theme.colors[theme.primaryColor][
                      theme.fn.primaryShade() + 3
                    ],
                },
              }),
              components: {
                ActionIcon: {
                  sizes: {
                    xxl: (theme) => ({
                      root: {
                        fontSize: "1.75rem",
                        height: "4rem",
                        width: "4rem",
                        padding: theme.spacing.xl,
                      },
                    }),
                  },
                },
                Button: {
                  defaultProps: {
                    radius: "xl",
                  },
                },
                Overlay: {
                  defaultProps: {
                    blur: 3,
                  },
                },
                Title: {
                  styles: {
                    root: {
                      margin: "0 !important",
                    },
                  },
                },
              },
            }}
            withGlobalStyles
            withNormalizeCSS
          >
            <TypographyStylesProvider>
              <WagmiConfig config={config}>
                <SessionProvider session={session}>
                  <ApolloProviderWrapper>
                    <AuthChecker>
                      <Component {...pageProps} />
                    </AuthChecker>
                  </ApolloProviderWrapper>
                  <Notifications />
                </SessionProvider>
              </WagmiConfig>
            </TypographyStylesProvider>
          </MantineProvider>
        </PrimaryColorSwitcherProvider>
      </ColorSchemeSwitcherProvider>
    </>
  );
};

App.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  return {
    ...appProps,
    colorScheme: getCookie("mantine-color-scheme", appContext.ctx) || "dark",
  };
};

export default App;
