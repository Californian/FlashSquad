import { LoadingOverlay } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface AuthCheckerProps {
  children: React.ReactNode;
}

const AuthChecker: React.FC<AuthCheckerProps> = ({ children }) => {
  const { status } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status]);

  return (
    <>
      {status === "loading" && <LoadingOverlay visible />}
      {(status === "authenticated" || status === "unauthenticated") && (
        <>{children}</>
      )}
    </>
  );
};

export { AuthChecker };
