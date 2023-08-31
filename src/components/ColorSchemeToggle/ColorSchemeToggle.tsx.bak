import { useContext, useEffect, useState } from "react";
import { Group, Stack, Switch, Text, useMantineTheme } from "@mantine/core";
import {
  faComputer,
  faM,
  faMagicWandSparkles,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useColorSchemeSwitcher } from "color-scheme-switcher";

const ColorSchemeToggle = () => {
  const {
    colorSchemeIsLight,
    colorSchemeIsManual,
    colorSchemeFollowsSun,
    setColorSchemeIsLight,
    setColorSchemeIsManual,
    setColorSchemeFollowsSun,
  } = useColorSchemeSwitcher();

  const theme = useMantineTheme();
  const gray4 = theme.colors.gray[4];

  const AutomaticLabel = ({ size = "lg" as any, color = gray4 }) => (
    <FontAwesomeIcon {...{ size, color }} icon={faMagicWandSparkles} />
  );
  const ManualLabel = ({ size = "lg" as any, color = gray4 }) => (
    <FontAwesomeIcon {...{ size, color }} icon={faM} />
  );

  const LightModeLabel = ({ size = "lg" as any, color = gray4 }) => (
    <FontAwesomeIcon {...{ size, color }} icon={faSun} />
  );

  const DarkModeLabel = ({ size = "lg" as any, color = gray4 }) => (
    <FontAwesomeIcon {...{ size, color }} icon={faMoon} />
  );

  const FollowsSystemLabel = ({ size = "lg" as any, color = gray4 }) => (
    <FontAwesomeIcon {...{ size, color }} icon={faComputer} />
  );

  const FollowsSunLabel = ({ size = "lg" as any, color = gray4 }) => (
    <FontAwesomeIcon {...{ size, color }} icon={faSun} />
  );

  return (
    <Stack align="flex-end" justify="center">
      <Group align="flex-end" spacing="0.2rem">
        <Text sx={{ lineHeight: "2" }}>
          {colorSchemeIsManual ? "Manual" : "Automatic"}
        </Text>
        <Switch
          checked={colorSchemeIsManual}
          color="red"
          onClick={() => setColorSchemeIsManual(!colorSchemeIsManual)}
          size="lg"
          onLabel={<AutomaticLabel />}
          offLabel={<ManualLabel />}
          thumbIcon={
            colorSchemeIsManual ? (
              <ManualLabel size="xl" color={theme.colors.red[3]} />
            ) : (
              <AutomaticLabel size="xl" color={theme.colors.cyan[6]} />
            )
          }
          sx={(theme) => ({
            thumb: {
              border: 0,
              backgroundColor: theme.colors.gray[5],
            },
            label: {
              backgroundColor: theme.colors.cyan[6],
            },
          })}
        />
      </Group>

      {colorSchemeIsManual ? (
        <Group align="flex-end" spacing="0.2rem">
          <Text sx={{ lineHeight: "2" }}>
            {colorSchemeIsLight ? "Light" : "Dark"}
          </Text>
          <Switch
            checked={colorSchemeIsLight}
            color="yellow"
            onClick={() => setColorSchemeIsLight(!colorSchemeIsLight)}
            size="lg"
            onLabel={<DarkModeLabel />}
            offLabel={<LightModeLabel />}
            thumbIcon={
              colorSchemeIsLight ? (
                <LightModeLabel color={theme.colors.yellow[3]} />
              ) : (
                <DarkModeLabel color={theme.colors.blue[6]} />
              )
            }
            sx={(theme) => ({
              thumb: {
                border: 0,
                backgroundColor: theme.colors.gray[5],
              },
              label: {
                backgroundColor: theme.colors.blue[6],
              },
            })}
          />
        </Group>
      ) : (
        <Group align="flex-end" spacing="0.2rem">
          <Text sx={{ lineHeight: "2" }}>
            {colorSchemeFollowsSun ? "Follow Sun" : "Follow System"}
          </Text>
          <Switch
            checked={colorSchemeFollowsSun}
            color="green"
            onClick={() => setColorSchemeFollowsSun(!colorSchemeFollowsSun)}
            size="lg"
            onLabel={<FollowsSystemLabel />}
            offLabel={<FollowsSunLabel />}
            thumbIcon={
              colorSchemeFollowsSun ? (
                <FollowsSunLabel color={theme.colors.green[6]} />
              ) : (
                <FollowsSystemLabel color={theme.colors.grape[3]} />
              )
            }
            sx={(theme) => ({
              thumb: {
                border: 0,
                backgroundColor: theme.colors.gray[5],
              },
              label: {
                backgroundColor: theme.colors.grape[6],
              },
            })}
          />
        </Group>
      )}
    </Stack>
  );
};

export { ColorSchemeToggle };
