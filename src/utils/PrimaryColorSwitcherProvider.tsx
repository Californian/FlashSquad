import { PrimaryColorSwitcherContext } from "@/utils";
import { DEFAULT_THEME } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";

interface PrimaryColorSwitcherProviderProps {
  /**
   * Sets the default primary color.
   * */
  defaultPrimaryColor?: string;
  /**
   * Function to be run whenever the primary color is changed.
   *
   * This can be used to call any functions specific to the theme provider so
   * changes are reflected in the UI.
   */
  setPrimaryColorCallback?: (v: string) => void;
  children: React.ReactNode;
}

const PrimaryColorSwitcherProvider: React.FC<
  PrimaryColorSwitcherProviderProps
> = ({
  defaultPrimaryColor = DEFAULT_THEME.primaryColor,
  setPrimaryColorCallback,
  children,
}) => {
  const [primaryColor, setPrimaryColor] = useLocalStorage<string>({
    key: "primary-color",
    defaultValue: defaultPrimaryColor,
  });

  // Call callback, if it is provided, with primary color setter.
  const setPrimaryColorWithCallback = (value: string) => {
    setPrimaryColor(value);
    if (setPrimaryColorCallback) {
      setPrimaryColorCallback(value);
    }
  };

  const providerValues = {
    primaryColor: primaryColor ?? DEFAULT_THEME.primaryColor,
    setPrimaryColor: setPrimaryColorWithCallback,
  };

  return (
    <PrimaryColorSwitcherContext.Provider value={providerValues}>
      {children}
    </PrimaryColorSwitcherContext.Provider>
  );
};

export { PrimaryColorSwitcherProvider };
