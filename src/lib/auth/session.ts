import { auth } from "./config";

export interface Session {
  userId: string;
}

export async function getServerSession(): Promise<Session | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  return { userId: session.user.id };
}
