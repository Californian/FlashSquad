import {
  faBars,
  faPeopleGroup,
  faHouse,
  faComments,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  MediaQuery,
  Footer,
  Group,
  ActionIcon,
  useMantineTheme,
} from "@mantine/core";
import { useColorSchemeSwitcher } from "color-scheme-switcher";
import Link from "next/link";

interface AppFooterProps {
  screenIsThin: boolean;
  navigationPanelIsOpen: boolean;
  settingsPanelIsOpen: boolean;
  setNavigationPanelIsOpen: (v: boolean) => void;
  setSettingsPanelIsOpen: (v: boolean) => void;
}

const AppFooter: React.FC<AppFooterProps> = ({
  screenIsThin,
  navigationPanelIsOpen,
  settingsPanelIsOpen,
  setNavigationPanelIsOpen,
  setSettingsPanelIsOpen,
}) => {
  const theme = useMantineTheme();
  const { colorSchemeIsLight } = useColorSchemeSwitcher();

  return (
    <MediaQuery largerThan="sm" styles={{ display: "none" }}>
      <Footer
        p="md"
        height={screenIsThin ? 100 : 0}
        sx={{ backgroundColor: colorSchemeIsLight ? "white" : "black" }}
      >
        <Group position="apart">
          <Group position="left">
            <ActionIcon
              size="xl"
              onClick={() => setNavigationPanelIsOpen(!navigationPanelIsOpen)}
              color={
                theme.colors[theme.primaryColor][theme.fn.primaryShade() - 4]
              }
            >
              <FontAwesomeIcon icon={faBars} />
            </ActionIcon>
          </Group>
          <Group position="center" spacing="xl" sx={{ height: "100%" }}>
            <ActionIcon
              size="xl"
              radius="xl"
              component={Link}
              href="/squad"
              color={theme.colors[theme.primaryColor][theme.fn.primaryShade()]}
              p={0}
            >
              <svg
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.1593 19.5C20.1593 19.5 20.499 18.748 20.499 18C20.499 16.8403 19.999 16 18.999 15.5M16.499 10.8893C17.6763 10.3749 18.4991 9.20022 18.4991 7.83333C18.4991 6.46645 17.6763 5.29172 16.499 4.77735M14.199 7.83333C14.199 9.67428 12.7067 11.1667 10.8657 11.1667C9.02476 11.1667 7.53238 9.67428 7.53238 7.83333C7.53238 5.99238 9.02476 4.5 10.8657 4.5C12.7067 4.5 14.199 5.99238 14.199 7.83333ZM10.7615 14.8125C13.947 14.8125 15.9298 16.2075 16.8735 17.1016C17.3121 17.5171 17.3445 18.1673 17.0483 18.6938C16.7682 19.1918 16.2413 19.5 15.6699 19.5H6.08748C5.50006 19.5 4.95832 19.1832 4.67033 18.6712C4.37964 18.1544 4.39541 17.5184 4.81226 17.0967C5.69631 16.2025 7.58186 14.8125 10.7615 14.8125Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </ActionIcon>
            <ActionIcon
              size="xxl"
              radius="100px"
              component={Link}
              href="/feed"
              color={theme.colors[theme.primaryColor][theme.fn.primaryShade()]}
              p={0}
            >
              <svg
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.50001 11C4.50001 10.3705 4.7964 9.77771 5.30001 9.4L11.3 4.9C12.0111 4.36667 12.9889 4.36667 13.7 4.9L19.7 9.4C20.2036 9.77771 20.5 10.3705 20.5 11V17C20.5 18.6569 19.1569 20 17.5 20H7.5C5.84314 20 4.5 18.6569 4.5 17L4.50001 11Z"
                  fill="white"
                  stroke="white"
                  strokeWidth="1.5"
                />
              </svg>
            </ActionIcon>
            <ActionIcon
              size="xl"
              radius="xl"
              component={Link}
              href="/messages"
              color={theme.primaryColor}
              p={0}
            >
              <svg
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.5 12C20.5032 13.2422 20.213 14.4676 19.6529 15.5765C18.9889 16.9052 17.968 18.0227 16.7046 18.804C15.4413 19.5853 13.9854 19.9994 12.5 20C11.4775 20.0026 10.4664 19.8065 9.5224 19.4247C9.12628 19.2645 8.69625 19.1914 8.27496 19.2628L6.22923 19.4807C5.53226 19.5549 4.94455 18.9671 5.01894 18.2701L5.23722 16.225C5.30858 15.8038 5.23551 15.3737 5.07531 14.9776C4.69352 14.0336 4.49736 13.0225 4.50003 12C4.5006 10.5146 4.91472 9.05869 5.69599 7.79536C6.47727 6.53202 7.59484 5.51114 8.92354 4.84708C10.0324 4.28702 11.2578 3.99679 12.5 4.00003H12.9706C14.9323 4.10825 16.7852 4.93627 18.1745 6.32553C19.5637 7.7148 20.3917 9.56768 20.5 11.5294V12Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </ActionIcon>
          </Group>
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
        </Group>
      </Footer>
    </MediaQuery>
  );
};

export { AppFooter };
