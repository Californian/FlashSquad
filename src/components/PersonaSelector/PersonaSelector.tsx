import { Avatar, Group, Select, Text } from "@mantine/core";
import { forwardRef } from "react";

interface PersonaSelectorProps {
  currentPersonaId: string;
  handlePersonaSelect: (personaId: string) => Promise<void>;
  personas: any;
}

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  image: string;
  label: string;
  description: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ image, label, description, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar src={image} />
        <div>
          <Text size="sm">{label}</Text>
          <Text size="xs" opacity={0.65}>
            {description}
          </Text>
        </div>
      </Group>
    </div>
  ),
);

const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  personas,
  handlePersonaSelect,
  currentPersonaId,
}) => {
  return (
    <Select
      itemComponent={SelectItem}
      placeholder="Choose a persona"
      value={currentPersonaId}
      onChange={handlePersonaSelect}
      maxDropdownHeight={280}
      data={(personas ?? []).map(
        ({
          id,
          displayName,
          nft: { tokenId },
          profileImage: { url: profileImageUrl },
        }) => ({
          value: id,
          label: displayName ?? tokenId,
          image: profileImageUrl,
        }),
      )}
    />
  );
};

export { PersonaSelector };
