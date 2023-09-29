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
import { MantineProvider, TypographyStylesProvider } from "@mantine/core";
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
  /* TODO: Re-integrate this.
  const [primaryColor, setPrimaryColor] = useLocalStorage<MantineColor>({
    key: "primary-color",
    defaultValue: DEFAULT_THEME.primaryColor,
  });
  */
  const [lastVisitedSquad, setLastVisitedSquad] = useLocalStorage<string>({
    key: "last-visited-squad",
  });

  const defaultColorSchemeIsLight = false;
  const [colorScheme, setColorScheme] = useState<"light" | "dark">(
    defaultColorSchemeIsLight ? "light" : "dark",
  );

  const setColorSchemeIsLightCallback = (colorSchemeIsLight: boolean) => {
    setColorScheme(colorSchemeIsLight ? "light" : "dark");
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
        <MantineProvider
          theme={{
            colorScheme,
            primaryColor: "bright-blue",
            primaryShade: { light: 3, dark: 5 },
            loader: "dots",
            colors: {
              "bright-blue": [
                "#0B042F",
                "#16085E",
                "#210C8D",
                "#2B10BC",
                "#3614EB",
                "#5A3EEF",
                "#7F69F2",
                "#A393F6",
                "#C7BDF9",
                "#EBE8FD",
              ],
            },
            globalStyles: (theme) => ({
              body: {
                backgroundColor:
                  theme.colors[theme.primaryColor][theme.fn.primaryShade() + 3],
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
