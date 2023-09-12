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
  Divider,
  FileButton,
  Group,
  Space,
  Stack,
  Tabs,
  Text,
  Textarea,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCallback, useContext, useEffect, useState } from "react";

import {
  UserAuthSection,
  ColorSchemeToggle,
  SettingsTabsList,
  ColorContext,
  ImageUploadButton,
} from "@/components";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

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
  mutation SetProfileImage($userId: uuid!, $profileImageId: uuid!) {
    updateUsersByPk(
      pkColumns: { id: $userId }
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
      externalId
      bio
      profileImage {
        id
        url
        altText
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      userSquadRelationships {
        userId
        squadId
        isAdmin
        createdAt
        updatedAt
        squad {
          id
          displayName
          description
          brandColor
          typeface
          image {
            id
            url
            altText
            description
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
        }
      }
    }
  }
`;

const GetCurrentSquadQuery = gql`
  query GetCurrentSquad($squadId: uuid!) {
    squadsByPk(id: $squadId) {
      id
      contractAddress
      tokenId
      displayName
      description
      brandColor
      typeface
      image {
        id
        url
        altText
        description
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

const UpdateUserBioMutation = gql`
  mutation UpdateUserBio($userId: uuid!, $bio: String!) {
    updateUsersByPk(pkColumns: { id: $userId }, _set: { bio: $bio }) {
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

  const { primaryColor, setPrimaryColor } = useContext(ColorContext);

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

  const handleProfileImageSelect = useCallback(
    async (url: string, fileName: string) => {
      const {
        data: {
          insertImagesOne: { id: profileImageId },
        },
      } = await createImage({
        variables: { url, altText: fileName },
      });
      await setProfileImage({ variables: { userId, profileImageId } });
      currentUserRefetch();
    },
    [userId],
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
      currentSquadRefetch();
    },
    [squadId],
  );

  const [
    updateUserBio,
    {
      loading: updateUserBioIsLoading,
      error: updateUserBioError,
      data: updateUserBioData,
    },
  ] = useMutation(UpdateUserBioMutation);

  const form = useForm({
    initialValues: {
      userBio: currentUser?.bio,
    },
  });

  useEffect(() => {
    if (!form?.values?.userBio) {
      form.setValues({
        userBio: currentUser?.bio,
      });
    }
  }, [currentUser]);

  return (
    <Aside
      p="md"
      width={settingsPanelIsOpen ? { sm: 200, lg: 300 } : { base: 0 }}
      display={settingsPanelIsOpen ? undefined : "none"}
      sx={{ zIndex: 99 }}
    >
      <Aside.Section grow my="-1rem">
        <Tabs defaultValue="user" inverted={screenIsThin} h="100%" pb="2rem">
          {screenIsThin ? undefined : (
            <SettingsTabsList shouldShowSquad={!!squadId} />
          )}

          <Tabs.Panel value="squad" pt="xs" h="100%" pb="2rem">
            <Stack
              mt="1rem"
              align="flex-end"
              h="100%"
              justify={screenIsThin ? "flex-end" : "flex-start"}
            >
              <Title order={3} weight="300">
                Squad Image
              </Title>

              <ImageUploadButton
                buttonId="squad"
                url={currentSquad?.image?.url}
                handleSelect={handleSquadImageSelect}
                borderRadius={theme.radius.lg}
                minHeight="100px"
                maxHeight="150px"
                aspectRatio={`${PHI} / 1`}
              />

              <Space />
              <Title order={3} weight="300">
                Squad Color
              </Title>
              <Group position="right" spacing="xs" maw={300}>
                {Object.keys(theme.colors).map((color) => (
                  <ColorSwatch
                    key={color}
                    color={theme.colors[color][theme.fn.primaryShade()]}
                    component="button"
                    onClick={() => setPrimaryColor(color)}
                  >
                    {color === primaryColor && (
                      <FontAwesomeIcon icon={faCheck} />
                    )}
                  </ColorSwatch>
                ))}
              </Group>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="user" pt="xl" h="100%" pb="2rem">
            <Stack
              mt="1rem"
              align="flex-end"
              justify={screenIsThin ? "flex-end" : "flex-start"}
              h="100%"
            >
              <Title order={3} weight="300" align="right">
                Profile Picture
              </Title>
              <Group position="center">
                <ImageUploadButton
                  buttonId="profile"
                  url={currentUser?.profileImage?.url}
                  handleSelect={handleProfileImageSelect}
                  borderRadius="100%"
                  minHeight="100px"
                  maxHeight="150px"
                  aspectRatio={`1 / 1`}
                />
              </Group>

              {userBioIsInEditMode ? (
                <form
                  style={{ maxWidth: 300, width: "100%", height: "7rem" }}
                  onSubmit={form.onSubmit((values) => {
                    form.setValues(values);
                    updateUserBio({
                      variables: {
                        userId,
                        bio: form.values.userBio,
                      },
                    });
                    currentUserRefetch();
                    setUserBioIsInEditMode(false);
                  })}
                >
                  <Group position="apart">
                    <ActionIcon type="submit" size="xl">
                      <FontAwesomeIcon icon={faCheck} />
                    </ActionIcon>
                    <Title order={3} weight="300" align="right">
                      Bio
                    </Title>
                  </Group>
                  <Box h="7rem">
                    <Textarea
                      minRows={7}
                      maxRows={7}
                      placeholder="Your bio here..."
                      {...form.getInputProps("userBio")}
                    />
                  </Box>
                </form>
              ) : (
                <>
                  <Group position="apart">
                    <ActionIcon
                      size="xl"
                      onClick={() => setUserBioIsInEditMode(true)}
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </ActionIcon>
                    <Title order={3} weight="300" align="right">
                      Bio
                    </Title>
                  </Group>
                  {!!currentUser?.bio ? (
                    <Text align="right">{currentUser?.bio}</Text>
                  ) : (
                    <Text
                      align="right"
                      italic
                      weight={200}
                      h="7rem"
                      maw={300}
                      w="100%"
                      sx={{ overflowWrap: "break-word" }}
                    >
                      You haven't written a bio yet!
                    </Text>
                  )}
                </>
              )}

              <Title order={3} weight="300" align="right">
                Light/Dark Mode
              </Title>
              <Group position="right">
                <ColorSchemeToggle />
              </Group>
            </Stack>
          </Tabs.Panel>

          {screenIsThin ? (
            <SettingsTabsList shouldShowSquad={!!squadId} />
          ) : undefined}
        </Tabs>
      </Aside.Section>

      <Divider my="lg" mx="-1rem" display={screenIsThin ? "none" : undefined} />

      <Aside.Section>
        <UserAuthSection />
      </Aside.Section>
    </Aside>
  );
};

export { SettingsPanel };
