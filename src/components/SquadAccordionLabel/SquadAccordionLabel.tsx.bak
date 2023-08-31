import { faPeopleGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Group, Avatar, Text } from "@mantine/core";

interface SquadAccordionLabelProps {
  displayName: string;
  image: { url: string };
  description: string;
}

const SquadAccordionLabel: React.FC<SquadAccordionLabelProps> = ({
  displayName,
  image,
  description,
}) => {
  return (
    <Group noWrap>
      <Avatar src={image?.url} radius="xl" size="lg">
        <FontAwesomeIcon icon={faPeopleGroup} />
      </Avatar>
      <div>
        <Text>{displayName}</Text>
      </div>
    </Group>
  );
};

export { SquadAccordionLabel };
