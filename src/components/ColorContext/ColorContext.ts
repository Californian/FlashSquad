import { DEFAULT_THEME } from "@mantine/core";
import { createContext } from "react";

const ColorContext = createContext({
  primaryColor: DEFAULT_THEME.primaryColor,
  setPrimaryColor: (v: string) => {},
});

export { ColorContext };
