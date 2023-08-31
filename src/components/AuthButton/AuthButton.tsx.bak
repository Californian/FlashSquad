import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";
import { SiweMessage } from "siwe";
import {
  useAccount,
  useConnect,
  useNetwork,
  useSignMessage,
  useDisconnect,
} from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MouseEvent, useEffect } from "react";
import { Button } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";

interface AuthButtonProps { }

const AuthButton: React.FC<AuthButtonProps> = ({ }) => {
  const { signMessageAsync } = useSignMessage();
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const callbackUrl = "/protected";
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: "Sign in to FlashSquad with Ethereum.",
        uri: window.location.origin,
        version: "1",
        chainId: chain?.id,
        nonce: await getCsrfToken(),
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });
      signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature,
        callbackUrl,
      });
    } catch (error) {
      window.alert(error);
    }
  };

  useEffect(() => {
    if (isConnected && !session) {
      handleLogin();
    }
  }, [isConnected]);

  return (
    <Button
      disabled={isLoading}
      onClick={() => {
        if (!isLoading) {
          if (session?.user) {
            disconnect();
            signOut();
          } else {
            if (!isConnected) {
              connect();
            } else {
              handleLogin();
            }
          }
        }
      }}
    >
      {typeof session?.user === "undefined" ? "Sign In" : "Sign Out"}
    </Button>
  );
};

export { AuthButton };
