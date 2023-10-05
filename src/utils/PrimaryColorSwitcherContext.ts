import { createGenericContext } from "color-scheme-switcher";

const [PrimaryColorSwitcherContext, usePrimaryColorSwitcher] =
  createGenericContext<{
    primaryColor: string;
    setPrimaryColor: (v: string) => void;
    setPrimaryColorCallback?: (v: string) => void;
  }>();

export { PrimaryColorSwitcherContext, usePrimaryColorSwitcher };
