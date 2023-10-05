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
import { useEffect, useState } from "react";
import { Button, LoadingOverlay } from "@mantine/core";
import { useRouter } from "next/router";

interface AuthButtonProps {
  fullWidth?: boolean;
}

const AuthButton: React.FC<AuthButtonProps> = ({ fullWidth = false }) => {
  const { signMessageAsync } = useSignMessage();
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  const { data: session, status } = useSession();
  const sessionIsLoading = status === "loading";
  const [loginIsLoading, setLoginIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      const callbackUrl = "/";
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
      await signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature,
        callbackUrl,
      });
      setLoginIsLoading(false);
    } catch (error) {
      window.alert(error);
    }
  };

  const router = useRouter();

  useEffect(() => {
    if (isConnected && !session) {
      handleLogin();
    }
  }, [isConnected]);

  return (
    <>
      <LoadingOverlay visible={loginIsLoading} />
      <Button
        fullWidth={fullWidth}
        disabled={sessionIsLoading}
        onClick={async () => {
          setLoginIsLoading(true);

          if (!sessionIsLoading) {
            if (session?.user) {
              disconnect();
              await signOut({ redirect: false });
              await router.push("/");
              router.reload();
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
    </>
  );
};

export { AuthButton };
