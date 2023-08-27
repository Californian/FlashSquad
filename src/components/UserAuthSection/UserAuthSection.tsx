import { Anchor, Avatar, Group } from "@mantine/core";

import { AuthButton } from "@/components";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";

interface UserAuthSectionProps {}

const UserAuthSection: React.FC<UserAuthSectionProps> = ({}) => {
  const { data, status } = useSession();
  const { user: { walletAddress, name, imageSource } = {} } = (data ||
    {}) as Partial<NonNullable<Session>>;
  const isLoading = status === "loading";

  return (
    <Group position="apart">
      <Group position="left">
        <Avatar src={imageSource} radius="xl" />
        <Anchor component={Link} href={`/users/${walletAddress}`}>
          {isLoading ? "Loading..." : name}
        </Anchor>
      </Group>
      <AuthButton />
    </Group>
  );
};

export { UserAuthSection };
