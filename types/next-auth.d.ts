import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    token: string;
    user: {
      id: string;
      walletAddress: string;
      name: string;
      imageSource: string;
      emailAddress: string;
      role: string;
      [key: string]: string;
    };
  }
}
