import { Navbar, Stack, Anchor, Divider, NavLink } from "@mantine/core";

import { SquadList, SquadDetails } from "@/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useRouter } from "next/router";

interface NavigationPanelProps {
  screenIsThin: boolean;
  navigationPanelIsOpen: boolean;
}

const NavigationPanel: React.FC<NavigationPanelProps> = ({
  screenIsThin,
  navigationPanelIsOpen,
}) => {
  const router = useRouter();

  return (
    <Navbar
      p="md"
      width={navigationPanelIsOpen ? { sm: 200, lg: 300 } : { base: 0 }}
      display={navigationPanelIsOpen ? undefined : "none"}
      sx={{ zIndex: 99 }}
    >
      <Navbar.Section
        grow
        display={screenIsThin ? "none" : undefined}
        mx="-1rem"
        mt="-1rem"
      >
        <SquadList screenIsThin={screenIsThin} />
        <NavLink
          icon={<FontAwesomeIcon icon={faComments} />}
          label="Messages"
          component={Link}
          href={`/messages`}
          active={router.pathname === "/messages"}
        />
      </Navbar.Section>
      <Divider my="lg" mx="-1rem" display={screenIsThin ? "none" : undefined} />
      <Navbar.Section>
        <Anchor href="#">Terms of Service</Anchor>
      </Navbar.Section>
      <Divider my="lg" mx="-1rem" display={screenIsThin ? undefined : "none"} />
      <Navbar.Section grow display={screenIsThin ? undefined : "none"}>
        <Stack align="flex-end" justify="flex-end" h="100%">
          <SquadDetails width="100%" />
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
};

export { NavigationPanel };
