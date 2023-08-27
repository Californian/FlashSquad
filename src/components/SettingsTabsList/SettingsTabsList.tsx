import { faPeopleGroup, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tabs } from "@mantine/core";

interface SettingsTabsListProps {
  shouldShowSquad: boolean;
}

const SettingsTabsList: React.FC<SettingsTabsListProps> = ({
  shouldShowSquad,
}) => {
  return (
    <Tabs.List position="right" mx="-1rem">
      {shouldShowSquad ? (
        <Tabs.Tab
          value="squad"
          rightSection={<FontAwesomeIcon icon={faPeopleGroup} />}
        >
          Squad
        </Tabs.Tab>
      ) : (
        <></>
      )}
      <Tabs.Tab value="user" rightSection={<FontAwesomeIcon icon={faUser} />}>
        User
      </Tabs.Tab>
    </Tabs.List>
  );
};

export { SettingsTabsList };
