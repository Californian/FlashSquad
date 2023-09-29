import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ActionIcon,
  Center,
  Group,
  Stack,
  Textarea,
  Text,
  Button,
  Modal,
  Avatar,
  LoadingOverlay,
  Container,
} from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faUser } from "@fortawesome/free-solid-svg-icons";
import { useDebouncedState, useDisclosure } from "@mantine/hooks";

import {
  FlashSquadAppShell,
  FlashSquadMarkdown,
  ImageUploadButton,
} from "@/components";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const GetCurrentUserQuery = gql`
  query GetCurrentUser($userId: uuid!) {
    usersByPk(id: $userId) {
      id
      currentPersona {
        id
        displayName
        profileImage {
          id
          url
          altText
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
    }
  }
`;

const CreatePostMutation = gql`
  mutation CreatePost(
    $body: String!
    $authorId: uuid!
    $squadId: uuid!
    $postImageData: PostImageRelationshipsArrRelInsertInput
  ) {
    insertPostsOne(
      object: {
        body: $body
        authorId: $authorId
        squadId: $squadId
        postImageRelationships: $postImageData
      }
    ) {
      id
      body
      authorId
      createdAt
      updatedAt
      postImageRelationships {
        image {
          id
          url
          description
          altText
          createdAt
          updatedAt
        }
      }
    }
  }
`;

const FeedPage = () => {
  const router = useRouter();
  const {
    query: { squadId },
  } = router;

  const [content, setContent] = useDebouncedState("", 200);

  const [opened, { open, close }] = useDisclosure(false);

  const { data: sessionData } = useSession();
  const { user: sessionUser } = sessionData ?? {};

  const { data: { usersByPk: currentUser } = {} } = useQuery(
    GetCurrentUserQuery,
    {
      variables: { userId: sessionUser?.id },
      skip: !sessionUser?.id,
    },
  );

  const [postImageUrl, setPostImageUrl] = useState<string | undefined>();
  const [postImageAltText, setPostImageAltText] = useState<
    string | undefined
  >();

  const handlePostImageSelect = useCallback((url: string, fileName: string) => {
    setPostImageUrl(url);
    setPostImageAltText(fileName);
  }, []);

  const [
    createPost,
    { loading: createPostIsLoading, error, data: createPostData },
  ] = useMutation(CreatePostMutation);

  useEffect(() => {
    if (!createPostIsLoading && createPostData) {
      router.push(`/squads/${squadId}/feed`);
    }
  }, [createPostIsLoading]);

  return (
    <FlashSquadAppShell>
      <LoadingOverlay visible={createPostIsLoading} />
      <Stack justify="space-between" h="100%">
        <Stack justify="flex-start" h="100%">
          <Group position="apart">
            <Group position="left">
              <Avatar
                src={currentUser?.currentPersona?.profileImage?.url}
                radius="xl"
              >
                <FontAwesomeIcon icon={faUser} />
              </Avatar>
              <Center>
                <Text>{currentUser?.currentPersona?.displayName}</Text>
              </Center>
            </Group>
            <Group position="right">
              <Text c="dimmed">{500 - content.length} / 500</Text>
            </Group>
          </Group>

          <Textarea
            styles={{
              input: {
                backgroundColor: "#000000",
                border: 0,
                padding: 0,
                height: "100%",
              },
              root: { height: "100%" },
              wrapper: { height: "100%" },
            }}
            placeholder="Start typing..."
            onChange={({ target: { value } }) => setContent(value)}
          />

          <Container
            fluid
            sx={{ height: "100%", textAlign: "left", margin: 0 }}
          >
            <FlashSquadMarkdown body={content} />
          </Container>
        </Stack>

        <Stack justify="flex-end">
          <Group position="apart">
            <Group position="apart" spacing="xl">
              <Group position="left" sx={{ height: "100%" }}>
                <ActionIcon
                  variant="subtle"
                  ml="-1rem"
                  color="blue"
                  radius="md"
                  size="xl"
                  onClick={open}
                >
                  <FontAwesomeIcon icon={faClose} />
                </ActionIcon>
              </Group>

              <Group position="left" sx={{ height: "100%" }}>
                <ImageUploadButton
                  buttonId="compose"
                  url={postImageUrl || ""}
                  handleSelect={handlePostImageSelect}
                  borderRadius="100%"
                  minHeight="100px"
                  maxHeight="150px"
                  aspectRatio={`1 / 1`}
                />
              </Group>
            </Group>
            <Group position="right" sx={{ height: "100%" }}>
              <Button
                onClick={() => {
                  createPost({
                    variables: {
                      body: content,
                      authorId: currentUser?.currentPersona?.id,
                      squadId,
                      postImageData: postImageUrl
                        ? {
                            data: [
                              {
                                image: {
                                  data: {
                                    url: postImageUrl,
                                    altText: postImageAltText,
                                  },
                                },
                              },
                            ],
                          }
                        : undefined,
                    },
                  });
                }}
              >
                Post
              </Button>
            </Group>
          </Group>
        </Stack>
      </Stack>
      <>
        <Modal
          opened={opened}
          onClose={close}
          title="Are you sure you want to cancel this post?"
          centered
          withCloseButton={false}
        >
          <Group position="center">
            <Button variant="subtle" onClick={close} color="gray">
              No
            </Button>
            <Button
              variant="filled"
              component={Link}
              href={`/squads/${squadId}/feed`}
            >
              Yes
            </Button>
          </Group>
        </Modal>
      </>
    </FlashSquadAppShell>
  );
};

export default FeedPage;
