import { gql, useMutation } from "@apollo/client";
import { Checkbox, Modal, Title } from "@mantine/core";
import { useCallback } from "react";

interface SquadVisibilityModalProps {
  userId: string;
  squads: any[];
  opened: boolean;
  close: () => void;
  refetchSquads: () => void;
}

const CreateUserSquadRelationshipMutation = gql`
  mutation CreateUserSquadRelationship(
    $userId: uuid!
    $squadId: uuid!
    $isHidden: Boolean!
  ) {
    insertUserSquadRelationshipsOne(
      object: { userId: $userId, squadId: $squadId, isHidden: $isHidden }
      onConflict: {
        constraint: user_squad_relationships_user_id_squad_id_key
        updateColumns: isHidden
      }
    ) {
      id
      isHidden
    }
  }
`;

const SquadVisibilityModal: React.FC<SquadVisibilityModalProps> = ({
  userId,
  squads,
  opened,
  close,
  refetchSquads,
}) => {
  const [createUserSquadRelationship] = useMutation(
    CreateUserSquadRelationshipMutation,
  );

  const handleCheckChange = useCallback(
    (squadId: string) =>
      async ({ currentTarget: { checked } }) => {
        await createUserSquadRelationship({
          variables: { userId, squadId, isHidden: !checked },
        });
        refetchSquads();
      },
    [userId],
  );

  return (
    <Modal opened={opened} onClose={close} title="Squads to Display">
      <>
        {(squads ?? []).map(
          ({
            id,
            displayName,
            nftCollection: { contractAddress },
            userSquadRelationships: [{ isHidden = false } = {}] = [{}],
          }) => (
            <Checkbox
              key={id}
              m="1rem"
              checked={!isHidden}
              label={displayName ?? contractAddress}
              onChange={handleCheckChange(id)}
            />
          ),
        )}
      </>
    </Modal>
  );
};

export { SquadVisibilityModal };
