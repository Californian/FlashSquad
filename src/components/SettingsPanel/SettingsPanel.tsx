import {
  faCheck,
  faFileUpload,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ActionIcon,
  Aside,
  BackgroundImage,
  Box,
  ColorSwatch,
  DEFAULT_THEME,
  Divider,
  FileButton,
  Group,
  Space,
  Stack,
  Tabs,
  Text,
  Textarea,
  Title,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  UserAuthSection,
  ColorSchemeToggle,
  SettingsTabsList,
  ColorContext,
  ImageUploadButton,
  PersonaSelector,
} from "@/components";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { usePrimaryColorSwitcher } from "@/utils";

interface SettingsPanelProps {
  settingsPanelIsOpen: boolean;
  screenIsThin: boolean;
}

const PHI = (1 + Math.sqrt(5)) / 2;

const CreateImageMutation = gql`
  mutation CreateImage($url: String!, $altText: String!) {
    insertImagesOne(object: { url: $url, altText: $altText }) {
      id
      url
      altText
      createdAt
      updatedAt
    }
  }
`;

const SetProfileImageMutation = gql`
  mutation SetProfileImage($personaId: uuid!, $profileImageId: uuid!) {
    updatePersonasByPk(
      pkColumns: { id: $personaId }
      _set: { profileImageId: $profileImageId }
    ) {
      id
      createdAt
      updatedAt
    }
  }
`;

const GetCurrentUserQuery = gql`
  query GetCurrentUser($userId: uuid!) {
    usersByPk(id: $userId) {
      id
      createdAt
      updatedAt
    }
  }
`;

const GetCurrentPersonaQuery = gql`
  query GetCurrentPersona($userId: uuid!, $squadId: uuid!) {
    userSquadRelationships(
      where: { userId: { _eq: $userId }, squadId: { _eq: $squadId } }
    ) {
      id
      userId
      squadId
      currentPersona {
        id
        displayName
        bio
        profileImage {
          id
          url
          altText
          createdAt
          updatedAt
        }
      }
    }
  }
`;

const SetCurrentPersonaMutation = gql`
  mutation SetCurrentPersona(
    $userId: uuid!
    $squadId: uuid!
    $personaId: uuid!
  ) {
    insertUserSquadRelationshipsOne(
      object: {
        userId: $userId
        squadId: $squadId
        currentPersonaId: $personaId
      }
      onConflict: {
        constraint: user_squad_relationships_user_id_squad_id_key
        updateColumns: currentPersonaId
      }
    ) {
      id
    }
  }
`;

const GetCurrentSquadQuery = gql`
  query GetCurrentSquad($squadId: uuid!) {
    squadsByPk(id: $squadId) {
      id
      displayName
      description
      brandColor
      typeface
      squadImage {
        id
        url
        altText
        description
      }
      nftCollection {
        id
        contractAddress
        nfts {
          id
          tokenId
          persona {
            id
            displayName
            bio
            profileImage {
              id
              url
            }
            nft {
              tokenId
            }
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

const SetSquadImageMutation = gql`
  mutation SetSquadImage($squadId: uuid!, $squadImageId: uuid!) {
    updateSquadsByPk(
      pkColumns: { id: $squadId }
      _set: { squadImageId: $squadImageId }
    ) {
      id
      createdAt
      updatedAt
    }
  }
`;

const UpdateSquadBrandColorMutation = gql`
  mutation UpdateSquadBrandColor($squadId: uuid!, $brandColor: String!) {
    updateSquadsByPk(
      pkColumns: { id: $squadId }
      _set: { brandColor: $brandColor }
    ) {
      id
      brandColor
      createdAt
      updatedAt
    }
  }
`;

const UpdatePersonaBioMutation = gql`
  mutation UpdatePersonaBio($personaId: uuid!, $bio: String!) {
    updatePersonasByPk(pkColumns: { id: $personaId }, _set: { bio: $bio }) {
      id
      bio
      createdAt
      updatedAt
    }
  }
`;

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settingsPanelIsOpen,
  screenIsThin,
}) => {
  const { data: sessionData } = useSession();
  const { user: { id: userId = "" } = {} } = sessionData ?? {};

  const {
    query: { squadId },
  } = useRouter();

  const [userBioIsInEditMode, setUserBioIsInEditMode] = useState(false);
  const theme = useMantineTheme();

  const { primaryColor, setPrimaryColor } = usePrimaryColorSwitcher();

  const {
    loading: currentUserIsLoading,
    error: currentUserError,
    data: { usersByPk: currentUser } = {},
    refetch: currentUserRefetch,
  } = useQuery(GetCurrentUserQuery, {
    variables: { userId },
    skip: !userId,
  });

  useEffect(() => {
    if (userId) {
      currentUserRefetch({ userId });
    }
  }, [userId]);

  const {
    data: {
      userSquadRelationships: [{ currentPersona = {} } = {}] = [{}],
    } = {},
    loading: currentPersonaIsLoading,
    refetch: currentPersonaRefetch,
  } = useQuery(GetCurrentPersonaQuery, {
    variables: { userId, squadId },
    skip: !userId || !squadId,
  });

  const [
    setCurrentPersona,
    {
      loading: setCurrentPersonaIsLoading,
      error: setCurrentPersonaError,
      data: setCurrentPersonaData,
    },
  ] = useMutation(SetCurrentPersonaMutation);

  const [
    createImage,
    {
      loading: createImageIsLoading,
      error: createImageError,
      data: createImageData,
    },
  ] = useMutation(CreateImageMutation);

  const [
    setProfileImage,
    {
      loading: setProfileImageIsLoading,
      error: setProfileImageError,
      data: setProfileImageData,
    },
  ] = useMutation(SetProfileImageMutation);

  const handlePersonaSelect = useCallback(
    async (personaId: string) => {
      await setCurrentPersona({ variables: { userId, squadId, personaId } });
      currentPersonaRefetch({ userId, squadId });
    },
    [userId, squadId],
  );

  const currentPersonaIdRef = useRef(currentPersona?.id);

  useEffect(() => {
    currentPersonaIdRef.current = currentPersona?.id;
  }, [currentPersona]);

  const handleProfileImageSelect = useCallback(
    async (url: string, fileName: string) => {
      const {
        data: {
          insertImagesOne: { id: profileImageId },
        },
      } = await createImage({
        variables: { url, altText: fileName },
      });
      await setProfileImage({
        variables: {
          personaId: currentPersonaIdRef?.current,
          profileImageId,
        },
      });
      currentPersonaRefetch({ userId, squadId });
    },
    [currentPersonaIdRef, createImage, setProfileImage, currentUserRefetch],
  );

  const {
    loading: currentSquadIsLoading,
    error: currentSquadError,
    data: { squadsByPk: currentSquad } = {},
    refetch: currentSquadRefetch,
  } = useQuery(GetCurrentSquadQuery, {
    variables: { squadId },
    skip: !squadId,
  });

  useEffect(() => {
    (async () => {
      if (
        !currentPersonaIsLoading &&
        !setCurrentPersonaIsLoading &&
        !currentPersona?.id &&
        !!currentSquad?.nftCollection?.nfts[0]?.persona?.id
      ) {
        await setCurrentPersona({
          variables: {
            userId,
            squadId,
            personaId: currentSquad?.nftCollection?.nfts[0]?.persona?.id,
          },
        });
        await currentPersonaRefetch();
      }
    })();
  }, [
    currentPersonaIsLoading,
    setCurrentPersonaIsLoading,
    currentPersona,
    currentSquad,
    setCurrentPersona,
  ]);

  const [
    setSquadImage,
    {
      loading: setSquadImageIsLoading,
      error: setSquadImageError,
      data: setSquadImageData,
    },
  ] = useMutation(SetSquadImageMutation);

  const handleSquadImageSelect = useCallback(
    async (url: string, fileName: string) => {
      const {
        data: {
          insertImagesOne: { id: squadImageId },
        },
      } = await createImage({ variables: { url, altText: fileName } });
      await setSquadImage({
        variables: { squadId, squadImageId },
      });
      currentSquadRefetch({ squadId });
    },
    [squadId, createImage, setSquadImage, currentSquadRefetch],
  );

  const [updateSquadBrandColor, { loading: updateSquadBrandColorIsLoading }] =
    useMutation(UpdateSquadBrandColorMutation);

  const handleSquadColorSelect = useCallback(
    (color: string) => async () => {
      setPrimaryColor(color);
      await updateSquadBrandColor({
        variables: { squadId, brandColor: color },
      });
      currentSquadRefetch();
    },
    [setPrimaryColor],
  );

  useEffect(() => {
    (async () => {
      if (!currentSquadIsLoading && !updateSquadBrandColorIsLoading) {
        if (!!currentSquad?.brandColor) {
          setPrimaryColor(currentSquad?.brandColor);
        } else {
          handleSquadColorSelect(DEFAULT_THEME.primaryColor)();
        }
      }
    })();
  }, [
    currentSquadIsLoading,
    updateSquadBrandColorIsLoading,
    currentSquad,
    setPrimaryColor,
    handleSquadColorSelect,
  ]);

  const [
    updatePersonaBio,
    {
      loading: updatePersonaBioIsLoading,
      error: updatePersonaBioError,
      data: updatePersonaBioData,
    },
  ] = useMutation(UpdatePersonaBioMutation);

  const form = useForm({
    initialValues: {
      userBio: currentPersona?.bio,
    },
  });

  useEffect(() => {
    form.setValues({
      userBio: currentPersona?.bio,
    });
  }, [currentPersona]);

  return (
    <Aside
      p="md"
      width={settingsPanelIsOpen ? { sm: 300, lg: 300 } : { base: 0 }}
      display={settingsPanelIsOpen ? undefined : "none"}
      sx={{ zIndex: 99 }}
    >
      <Aside.Section
        grow
        my="-1rem"
        sx={{
          overflowY: "scroll",
          overflowX: "hidden",
          direction: screenIsThin ? "ltr" : "rtl",
        }}
      >
        <Tabs defaultValue="user" h="100%" pb="1.5rem">
          <SettingsTabsList shouldShowSquad={!!squadId} />

          <Tabs.Panel value="squad" pt="xs" h="100%" pb="1.5rem">
            <Stack mt="1rem" h="100%">
              <Title order={3} weight="300">
                Squad Image
              </Title>

              <ImageUploadButton
                buttonId="squad"
                url={currentSquad?.squadImage?.url}
                handleSelect={handleSquadImageSelect}
                borderRadius={theme.radius.lg}
                minHeight="100px"
                maxHeight="150px"
                aspectRatio={`${PHI} / 1`}
              />

              <Space h="1.5rem" />

              <Title order={3} weight="300">
                Squad Color
              </Title>
              <Group spacing="xs" maw={300}>
                {Object.keys(theme.colors).map((color) => (
                  <Tooltip key={color} label={color}>
                    <ColorSwatch
                      color={theme.colors[color][theme.fn.primaryShade()]}
                      component="button"
                      onClick={handleSquadColorSelect(color)}
                    >
                      {color === primaryColor && (
                        <FontAwesomeIcon icon={faCheck} />
                      )}
                    </ColorSwatch>
                  </Tooltip>
                ))}
              </Group>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="user" pt="xl" h="100%" pb="1.5rem">
            <Stack mt="-1rem" h="100%">
              <Title order={3} weight="300">
                Persona
              </Title>
              <PersonaSelector
                currentPersonaId={currentPersona?.id}
                personas={currentSquad?.nftCollection?.nfts?.map(
                  ({ persona }) => persona,
                )}
                handlePersonaSelect={handlePersonaSelect}
              />

              <Space h="1.5rem" />

              <Title order={3} weight="300">
                Profile Picture
              </Title>
              <Group>
                <ImageUploadButton
                  buttonId="profile"
                  url={currentPersona?.profileImage?.url}
                  handleSelect={handleProfileImageSelect}
                  borderRadius="100%"
                  minHeight="100px"
                  maxHeight="150px"
                  aspectRatio={`1 / 1`}
                />
              </Group>

              <Space h="1.5rem" />

              {userBioIsInEditMode ? (
                <form
                  style={{ maxWidth: 300, width: "100%" }}
                  onSubmit={form.onSubmit(async (values) => {
                    form.setValues(values);
                    setUserBioIsInEditMode(false);
                    await updatePersonaBio({
                      variables: {
                        personaId: currentPersona?.id,
                        bio: form.values.userBio,
                      },
                    });
                    currentUserRefetch();
                  })}
                >
                  <Group position="apart">
                    <Title order={3} weight="300">
                      Bio
                    </Title>
                    <ActionIcon type="submit" size="xl">
                      <FontAwesomeIcon icon={faCheck} />
                    </ActionIcon>
                  </Group>
                  <Box>
                    <Textarea
                      minRows={3}
                      placeholder="Your bio here..."
                      {...form.getInputProps("userBio")}
                      styles={{
                        input: {
                          textAlign: screenIsThin ? "left" : "right",
                          direction: "ltr",
                        },
                      }}
                    />
                  </Box>
                </form>
              ) : (
                <>
                  <Group position="apart">
                    <Title order={3} weight="300">
                      Bio
                    </Title>
                    <ActionIcon
                      size="xl"
                      onClick={() => setUserBioIsInEditMode(true)}
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </ActionIcon>
                  </Group>
                  {!!currentPersona?.bio ? (
                    <Text
                      sx={{
                        textAlign: screenIsThin ? "left" : "right",
                        direction: "ltr",
                      }}
                    >
                      {currentPersona?.bio}
                    </Text>
                  ) : (
                    <Text
                      italic
                      weight={200}
                      maw={300}
                      w="100%"
                      sx={{
                        overflowWrap: "break-word",
                        textAlign: screenIsThin ? "left" : "right",
                        direction: "ltr",
                      }}
                    >
                      You haven't written a bio yet!
                    </Text>
                  )}
                </>
              )}

              <Space h="1.5rem" />

              <Title order={3} weight="300">
                Light/Dark Mode
              </Title>
              <Group>
                <ColorSchemeToggle />
              </Group>
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Aside.Section>

      <Divider my="lg" mx="-1rem" />

      <Aside.Section>
        <UserAuthSection />
      </Aside.Section>
    </Aside>
  );
};

export { SettingsPanel };
