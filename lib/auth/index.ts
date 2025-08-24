import { authOptions } from "@/app/api/auth/option";
import { getServerSession } from "next-auth/next";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  // session.user contains { name, email, image, id? } depending on NextAuth config
  return session.user;
}
