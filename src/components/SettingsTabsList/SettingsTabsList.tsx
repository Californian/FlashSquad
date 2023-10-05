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
    <Tabs.List>
      <Tabs.Tab
        value="user"
        icon={<FontAwesomeIcon style={{ marginLeft: "0.5em" }} icon={faUser} />}
      >
        User
      </Tabs.Tab>
      {shouldShowSquad ? (
        <Tabs.Tab
          value="squad"
          icon={
            <FontAwesomeIcon
              style={{ marginLeft: "0.5em" }}
              icon={faPeopleGroup}
            />
          }
        >
          Squad
        </Tabs.Tab>
      ) : (
        <></>
      )}
    </Tabs.List>
  );
};

export { SettingsTabsList };
