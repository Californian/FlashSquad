import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { Secret } from "next-auth/jwt";
import { ApolloClient } from "@apollo/client";

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default async function auth(req: any, res: any) {
  const providers = [
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials) {
        const { SiweMessage } = await import("siwe");

        try {
          const siwe = new SiweMessage(
            JSON.parse(credentials?.message || "{}"),
          );

          if (typeof process.env.NEXTAUTH_URL === "undefined") {
            throw new Error("NEXTAUTH_URL is not defined.");
          }

          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL);

          const result = await siwe.verify({
            signature: credentials?.signature || "",
            domain: nextAuthUrl.host,
            nonce: await getCsrfToken({ req }),
          });

          if (result.success) {
            return {
              id: siwe.address ?? "",
            } as User;
          }
          return { id: "" };
        } catch (e) {
          return { id: "" };
        }
      },
    }),
  ];

  const upsertSquads = async (
    graphqlClient: ApolloClient<any>,
    address: string,
    walletId: string,
  ) => {
    const { gql } = await import("@apollo/client");

    const GetNFTsByWalletAddressQuery = gql`
      query GetNFTsByWalletAddress($address: String!, $numNfts: Int = 3) {
        ethereum {
          walletByAddress(address: $address) {
            address
            ensName
            walletNFTs {
              edges {
                node {
                  nft {
                    tokenId
                    name
                    description
                    metadata
                    collection {
                      address
                      name
                      externalUrl
                      description
                      image {
                        url
                        mimeType
                      }
                      twitterUsername
                      bannerImage {
                        url
                        mimeType
                      }
                      ... on ERC1155Collection {
                        nfts(first: $numNfts) {
                          totalCount
                          edges {
                            node {
                              tokenId
                              name
                              metadata
                              uploads {
                                url
                                mimeType
                              }
                              externalUrl
                              description
                              animationUrl
                              wallets {
                                edges {
                                  node {
                                    address
                                    ensName
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                      ... on ERC721Collection {
                        nfts(first: $numNfts) {
                          totalCount
                          edges {
                            node {
                              tokenId
                              name
                              metadata
                              uploads {
                                url
                                mimeType
                              }
                              externalUrl
                              description
                              animationUrl
                              wallet {
                                address
                                ensName
                              }
                            }
                          }
                        }
                      }
                    }
                    ... on ERC1155NFT {
                      uploads {
                        url
                        mimeType
                      }
                      metadata
                    }
                    ... on ERC721NFT {
                      uploads {
                        url
                        mimeType
                      }
                      metadata
                    }
                    uploads {
                      mimeType
                      url
                    }
                  }
                }
              }
            }
          }
        }
        polygon {
          walletByAddress(address: $address) {
            address
            ensName
            walletNFTs {
              edges {
                node {
                  nft {
                    tokenId
                    contractAddress
                    name
                    description
                    metadata
                    collection {
                      address
                      name
                      externalUrl
                      description
                      twitterUsername
                      image {
                        url
                        mimeType
                      }
                      bannerImage {
                        url
                        mimeType
                      }
                      ... on ERC1155Collection {
                        nfts(first: $numNfts) {
                          totalCount
                          edges {
                            node {
                              tokenId
                              name
                              metadata
                              uploads {
                                url
                                mimeType
                              }
                              externalUrl
                              description
                              animationUrl
                              wallets {
                                edges {
                                  node {
                                    address
                                    ensName
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                      ... on ERC721Collection {
                        nfts(first: $numNfts) {
                          totalCount
                          edges {
                            node {
                              tokenId
                              name
                              metadata
                              uploads {
                                url
                                mimeType
                              }
                              externalUrl
                              description
                              animationUrl
                              wallet {
                                address
                                ensName
                              }
                            }
                          }
                        }
                      }
                    }
                    ... on ERC1155NFT {
                      uploads {
                        url
                        mimeType
                      }
                      metadata
                    }
                    ... on ERC721NFT {
                      uploads {
                        url
                        mimeType
                      }
                      metadata
                    }
                    uploads {
                      mimeType
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const CreateOrUpdateSquadsMutation = gql`
      mutation CreateOrUpdateSquads($squadObjects: [SquadsInsertInput!]!) {
        insertSquads(
          objects: $squadObjects
          onConflict: {
            constraint: squads_nft_collection_id_key
            updateColumns: [displayName, description]
          }
        ) {
          returning {
            id
            displayName
            description
            brandColor
            squadImage {
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
    `;

    const { data: nftsData } = await graphqlClient.query({
      query: GetNFTsByWalletAddressQuery,
      variables: { address },
    });

    console.log(JSON.stringify(nftsData, undefined, 2));

    const nftEdges = [
      ...nftsData?.ethereum?.walletByAddress?.walletNFTs?.edges.map(
        (edge: any) => ({ network: "ethereum", ...edge }),
      ),
      ...nftsData?.polygon?.walletByAddress?.walletNFTs?.edges.map(
        (edge: any) => ({ network: "polygon", ...edge }),
      ),
    ];

    const squadObjects = nftEdges?.map(
      ({
        network,
        node: {
          nft: {
            tokenId: userNftTokenId = "",
            name: userNftDisplayName = "",
            description: userNftDescription = "",
            metadata: {
              image: userNftImageUrl = "",
              name: userNftImageAltText = "",
              description: userNftImageDescription = "",
              background_color: brandColor = "",
            } = {},
            collection: {
              name: collectionName = "",
              address: contractAddress = "",
              description: collectionDescription = "",
              //image: [{ url: squadImageUrl = "" } = {}] = [],
              nfts: { totalCount: numNfts = 0, edges: nfts = [] } = {},
            } = {},
          } = {},
        } = {},
      } = {}) => ({
        displayName: collectionName || contractAddress || "",
        description: collectionDescription || "",
        brandColor,
        /*
        image: !!squadImageUrl
          ? {
            data: {
              url: squadImageUrl.replace(
                /^ipfs:\/\//i,
                "https://ipfs.io/ipfs/",
              ),
              altText: squadImageUrl.split("/")[-1],
            },
          }
          : undefined,
        */
        nftCollection: {
          data: {
            contractAddress,
            network: network,
            nfts: {
              data: [
                {
                  tokenId: userNftTokenId.toString(),
                  walletId,
                  persona: {
                    data: {
                      displayName: userNftDisplayName,
                      bio: userNftDescription,
                      profileImage: {
                        data: {
                          url: userNftImageUrl,
                          altText: userNftImageAltText,
                          description: userNftImageDescription,
                        },
                      },
                    },
                    onConflict: {
                      constraint: "personas_nft_id_key",
                      updateColumns: ["nftId"],
                    },
                  },
                },
                ...nfts.map(
                  ({
                    node: {
                      tokenId,
                      name: displayName,
                      description: bio,
                      metadata: {
                        image: nftImageUrl = "",
                        name: nftImageAltText = "",
                        description: nftImageDescription = "",
                      } = {},
                    },
                  }) => ({
                    tokenId: tokenId.toString(),
                    walletId,
                    persona: {
                      data: {
                        displayName,
                        bio,
                        profileImage: {
                          data: {
                            url: nftImageUrl,
                            altText: nftImageAltText,
                            description: nftImageDescription,
                          },
                        },
                      },
                      onConflict: {
                        constraint: "personas_nft_id_key",
                        updateColumns: ["nftId"],
                      },
                    },
                  }),
                ),
              ],
              onConflict: {
                constraint: "nfts_nft_collection_id_token_id_key",
                updateColumns: ["nftCollectionId", "walletId"],
              },
            },
          },
          onConflict: {
            constraint: "nft_collections_network_contract_address_key",
            updateColumns: ["network", "contractAddress"],
          },
        },
      }),
    );

    console.log(JSON.stringify(squadObjects, undefined, 2));

    graphqlClient.mutate({
      mutation: CreateOrUpdateSquadsMutation,
      variables: {
        squadObjects,
      },
    });
  };

  return await NextAuth(req, res, {
    providers,
    session: {
      strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async session({ session, token }: { session: any; token: any }) {
        const jsonwebtoken = await import("jsonwebtoken");
        const { ApolloClient, InMemoryCache, from, HttpLink, gql } =
          await import("@apollo/client");
        const { setContext } = await import("@apollo/client/link/context");
        const { loadErrorMessages, loadDevMessages } = await import(
          "@apollo/client/dev"
        );

        if (process.env.NODE_ENV === "development") {
          // Adds messages only in development environments.
          loadDevMessages();
          loadErrorMessages();
        }

        const GetWalletByWalletAddressQuery = gql`
          query GetWalletByWalletAddress($address: String!) {
            ethereum {
              walletByAddress(address: $address) {
                address
                ensName
              }
            }
          }
        `;

        // TODO: Allow update of ensName without creating a new user.
        const CreateOrUpdateUserMutation = gql`
          mutation CreateOrUpdateUserByWalletAddress(
            $address: String!
            $ensName: String!
          ) {
            insertUsersOne(
              object: {
                name: $ensName
                wallet: {
                  data: { address: $address, ensName: $ensName }
                  onConflict: {
                    constraint: wallets_address_key
                    updateColumns: [ensName]
                  }
                }
              }
              onConflict: {
                constraint: users_wallet_id_key
                updateColumns: [walletId]
              }
            ) {
              id
              name
              walletId
              createdAt
              updatedAt
            }
          }
        `;

        const { sub } = token;

        session.user.walletAddress = sub;

        const httpLink = new HttpLink({
          uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
        });

        const authMiddleware = setContext(async (_operation, { headers }) => {
          return {
            headers: {
              ...headers,
              "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
              "x-hasura-role": "user-admin",
            },
          };
        });

        const graphqlClient = new ApolloClient({
          link: from([authMiddleware, httpLink]),
          cache: new InMemoryCache(),
        });

        const { data: userChainData } = await graphqlClient.query({
          query: GetWalletByWalletAddressQuery,
          variables: { address: sub },
        });

        const ensName = userChainData?.ethereum?.walletByAddress?.ensName;
        session.user.name = ensName;

        // TODO Rearrange associations to get per-squad user personas.
        const ensAvatarUrl = "";

        const { data: userData } = await graphqlClient.mutate({
          mutation: CreateOrUpdateUserMutation,
          variables: {
            address: sub,
            ensName,
          },
        });

        console.log(userData);

        const {
          insertUsersOne: { id: userId, walletId },
        } = userData;

        session.user.id = userId;

        const encodedToken = jsonwebtoken.sign(
          {
            ...token,
            "https://hasura.io/jwt/claims": {
              "x-hasura-default-role": "user",
              "x-hasura-allowed-roles": ["user"],
              "x-hasura-user_id": userId,
              "x-hasura-user-id": userId,
            },
          },
          process.env.HASURA_JWT_SECRET as Secret,
          { algorithm: "HS256" },
        );
        session.token = encodedToken;

        upsertSquads(graphqlClient, sub, walletId);

        return session;
      },
    },
  });
}
