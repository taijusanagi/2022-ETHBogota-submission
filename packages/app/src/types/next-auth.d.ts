import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      address: string;
      type: string;
    };
  }
}
