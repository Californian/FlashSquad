import { ReactNode, useMemo } from "react";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  from,
  HttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { useSession } from "next-auth/react";

interface ApolloProviderWrapperProps {
  children: ReactNode;
}

const ApolloProviderWrapper: React.FC<ApolloProviderWrapperProps> = ({
  children,
}) => {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
  });

  const { data } = useSession();

  const authMiddleware = setContext(async (_operation, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${data?.token}`,
      },
    };
  });

  const graphqlClient = new ApolloClient({
    link: from([authMiddleware, httpLink]),
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={graphqlClient}>{children}</ApolloProvider>;
};

export { ApolloProviderWrapper };
