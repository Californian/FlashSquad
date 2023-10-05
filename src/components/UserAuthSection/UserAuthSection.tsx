import { Anchor, Avatar, Group, Text, Title } from "@mantine/core";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";

import { AuthButton } from "@/components";

interface UserAuthSectionProps {}

const UserAuthSection: React.FC<UserAuthSectionProps> = ({}) => {
  const { data, status: sessionStatus } = useSession();
  const { user: { name, imageSource } = {} } = (data || {}) as Partial<
    NonNullable<Session>
  >;

  return (
    <Group position="apart">
      {sessionStatus === "authenticated" ? (
        <Group position="left">
          <Avatar src={imageSource} radius="xl" />
          <Text>{name}</Text>
        </Group>
      ) : (
        <Text color="primary">Please sign in.</Text>
      )}
      <AuthButton />
    </Group>
  );
};

export { UserAuthSection };
