import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Card,
  Text,
  Center,
  Group,
  Image,
  ActionIcon,
  Space,
  Divider,
  Affix,
  rem,
  Avatar,
  useMantineTheme,
  Title,
} from "@mantine/core";
import { faUser, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { gql, useQuery } from "@apollo/client";

import { FlashSquadAppShell } from "@/components";
import { useMediaQuery } from "@mantine/hooks";

const GetSquadPostsQuery = gql`
  query GetSquadPosts($squadId: uuid!, $limit: Int = 20) {
    posts(
      where: { squadId: { _eq: $squadId } }
      orderBy: { updatedAt: DESC }
      limit: $limit
    ) {
      id
      body
      postImageRelationships {
        image {
          id
          url
          altText
          description
          createdAt
          updatedAt
        }
      }
      author {
        id
        externalId
        displayName
        profileImage {
          id
          url
          altText
        }
        postsAggregate {
          aggregate {
            count(columns: id)
          }
        }
      }
      comments {
        id
        body
        createdAt
        updatedAt
      }
      commentsAggregate {
        aggregate {
          count(columns: id)
        }
      }
      createdAt
      updatedAt
    }
  }
`;

const FeedPage = () => {
  const {
    query: { squadId },
  } = useRouter();

  const { data: { posts } = {} } = useQuery(GetSquadPostsQuery, {
    variables: { squadId },
  });

  const theme = useMantineTheme();
  const screenIsThinMediaQuery = theme.fn
    .smallerThan("sm")
    .replace("@media ", "");
  const screenIsThin = useMediaQuery(screenIsThinMediaQuery);

  return (
    <FlashSquadAppShell squadId={squadId}>
      {posts?.length > 0 ? (
        posts?.map(
          (
            {
              id,
              body,
              postImageRelationships: [
                {
                  image: {
                    id: imageId,
                    url: postImageUrl,
                    altText: postImageAltText,
                    description,
                  } = {},
                } = {},
              ] = [],
              author: {
                displayName,
                externalId,
                profileImage: {
                  url: authorProfileImageUrl,
                  altText: authorProfileImageAltText,
                } = {},
                postsAggregate: { aggregate: { count: numPosts } = {} } = {},
              } = {},
              comments,
              commentsAggregate: {
                aggregate: { count: numComments } = {},
              } = {},
              createdAt,
              updatedAt,
            } = {},
            ind: number,
          ) => (
            <div key={id}>
              <>
                <Group position="apart" mt="sm">
                  <Group position="center" mb="xs" sx={{ height: "100%" }}>
                    <ActionIcon variant="light" color="blue" radius="md">
                      <Avatar src={authorProfileImageUrl} radius="xl">
                        <FontAwesomeIcon icon={faUser} />
                      </Avatar>
                    </ActionIcon>
                    <Center>
                      <Text>{displayName}</Text>
                    </Center>
                  </Group>

                  <Group position="center" mb="xs" sx={{ height: "100%" }}>
                    <Text c="dimmed">{new Date(createdAt).toISOString()}</Text>
                  </Group>
                </Group>{" "}
                <Space h="md" />
                {postImageUrl ? (
                  <>
                    <Card.Section>
                      <Image
                        src={postImageUrl}
                        height={160}
                        alt="Norway"
                        radius="md"
                      />
                    </Card.Section>
                    <Space h="md" />
                  </>
                ) : (
                  <></>
                )}
                <Text size="md">{body}</Text>
                <Group position="apart" mt="sm">
                  <Group position="center" mb="xs" sx={{ height: "100%" }}>
                    <Group
                      position="center"
                      mb="0px"
                      spacing={0}
                      sx={{ height: "100%" }}
                    >
                      <ActionIcon
                        variant="light"
                        color="gray"
                        radius="md"
                        onClick={() => { } /*toggleLike(ind)*/}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <mask
                            id="mask0_66_1147"
                            maskUnits="userSpaceOnUse"
                            x="0"
                            y="-1"
                            width="24"
                            height="25"
                          >
                            <rect
                              y="-0.000244141"
                              width="24"
                              height="24"
                              fill="#D9D9D9"
                            />
                          </mask>
                          <g mask="url(#mask0_66_1147)">
                            <path
                              d="M6 13.9997C6 15.0074 6.24071 15.9453 6.72212 16.8132C7.20354 17.6812 7.86541 18.3812 8.70775 18.9132C8.63338 18.7722 8.58017 18.6315 8.54812 18.4911C8.51606 18.3507 8.50002 18.2036 8.50002 18.0497C8.50002 17.5869 8.58881 17.151 8.76637 16.7421C8.94394 16.3331 9.19875 15.9626 9.5308 15.6305L12 13.2017L14.4788 15.6305C14.8109 15.9626 15.0641 16.3331 15.2384 16.7421C15.4128 17.151 15.5 17.5869 15.5 18.0497C15.5 18.2036 15.4839 18.3507 15.4519 18.4911C15.4198 18.6315 15.3666 18.7722 15.2922 18.9132C16.1346 18.3812 16.7965 17.6812 17.2779 16.8132C17.7593 15.9453 18 15.0074 18 13.9997C18 13.1664 17.8458 12.3789 17.5375 11.6372C17.2292 10.8956 16.7833 10.2331 16.2 9.64974C15.8667 9.86641 15.5167 10.0289 15.15 10.1372C14.7833 10.2456 14.4083 10.2997 14.025 10.2997C12.9852 10.2997 12.0862 9.95808 11.3279 9.27474C10.5695 8.59141 10.1352 7.74334 10.025 6.73052C9.375 7.2741 8.8 7.84173 8.3 8.43339C7.8 9.02506 7.37916 9.62827 7.0375 10.243C6.69583 10.8578 6.4375 11.4818 6.2625 12.1151C6.0875 12.7485 6 13.3767 6 13.9997ZM12 15.2997L10.575 16.6997C10.3917 16.8831 10.25 17.0914 10.15 17.3247C10.05 17.5581 10 17.7997 10 18.0497C10 18.5831 10.1958 19.0414 10.5875 19.4247C10.9792 19.8081 11.45 19.9997 12 19.9997C12.55 19.9997 13.0208 19.8081 13.4125 19.4247C13.8042 19.0414 14 18.5831 14 18.0497C14 17.7831 13.95 17.5372 13.85 17.3122C13.75 17.0872 13.6083 16.8831 13.425 16.6997L12 15.2997ZM11.5 3.89404V6.29974C11.5 7.00744 11.7439 7.60104 12.2317 8.08054C12.7195 8.56003 13.3173 8.79977 14.025 8.79977C14.3314 8.79977 14.6234 8.74208 14.901 8.62669C15.1785 8.51131 15.4333 8.34144 15.6654 8.11709L16.1058 7.67287C17.1596 8.34722 17.9888 9.24689 18.5932 10.3719C19.1977 11.4969 19.5 12.7062 19.5 13.9997C19.5 16.092 18.773 17.8651 17.3192 19.3189C15.8654 20.7728 14.0923 21.4997 12 21.4997C9.9077 21.4997 8.13463 20.7728 6.6808 19.3189C5.22695 17.8651 4.50002 16.092 4.50002 13.9997C4.50002 12.0677 5.12951 10.2088 6.38847 8.42287C7.64744 6.63697 9.35127 5.12736 11.5 3.89404Z"
                              fill={true ? "#FFB323" : "#979C9E" /*isLiked*/}
                            />
                          </g>
                        </svg>
                      </ActionIcon>
                      <Center>
                        <Text fz="xs" c="dimmed">
                          {0 /*numLikes*/}
                        </Text>
                      </Center>
                    </Group>
                    <Group
                      position="center"
                      mb="0px"
                      spacing={0}
                      sx={{ height: "100%" }}
                    >
                      <ActionIcon variant="light" radius="md">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9.75391 9.99976H14.2549M9.75686 13.9998H12.7604M20 11.9998C20.0032 13.242 19.713 14.4674 19.1529 15.5762C18.4889 16.9049 17.468 18.0225 16.2046 18.8038C14.9413 19.585 13.4854 19.9992 12 19.9997C10.9775 20.0024 9.96645 19.8062 9.0224 19.4244C8.62628 19.2642 8.19625 19.1912 7.77496 19.2625L5.72923 19.4804C5.03226 19.5547 4.44455 18.9668 4.51894 18.2699L4.73722 16.2248C4.80858 15.8035 4.73551 15.3735 4.57531 14.9774C4.19352 14.0333 3.99736 13.0222 4.00003 11.9998C4.0006 10.5144 4.41472 9.05845 5.19599 7.79511C5.97727 6.53177 7.09484 5.5109 8.42354 4.84684C9.53235 4.28678 10.7578 3.99654 12 3.99978H12.4706C14.4323 4.10801 16.2852 4.93603 17.6745 6.32529C19.0637 7.71455 19.8917 9.56744 20 11.5292V11.9998Z"
                            stroke={
                              true ? "#48a7f8" : "#979C9E" /*isCommented*/
                            }
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </ActionIcon>
                      <Center>
                        <Text fz="xs" c="dimmed">
                          {numComments}
                        </Text>
                      </Center>
                    </Group>
                  </Group>

                  <Group
                    position="center"
                    mb="xs"
                    sx={{ height: "100%" }}
                  ></Group>
                </Group>
              </>
              {ind !== posts.length - 1 ? (
                <>
                  <Space h="xs" />
                  <Divider my="sm" mx="-2rem" size="xs" />
                  <Space h="xs" />
                </>
              ) : (
                <></>
              )}
            </div>
          ),
        )
      ) : (
        <Title order={2} weight={400}>
          This squad has no posts; click the + button to create one!
        </Title>
      )}
      <Affix
        position={{
          bottom: screenIsThin ? 120 : 60,
          right: screenIsThin ? 20 : 360,
        }}
        zIndex={90}
      >
        <ActionIcon
          variant="filled"
          radius="xl"
          size="xxl"
          color="primary"
          component={Link}
          href={`/squads/${squadId}/compose`}
        >
          <FontAwesomeIcon icon={faPlus} />
        </ActionIcon>
      </Affix>
    </FlashSquadAppShell>
  );
};

export default FeedPage;
