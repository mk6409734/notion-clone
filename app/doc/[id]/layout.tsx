import RoomProvider from "@/components/RoomProvider";
import { auth } from "@clerk/nextjs/server";

export default async function DocLayout({
  children,
  params: { id },
}: {
  children: React.ReactNode;
  params: { id: string }; // Update the type definition for params
}) {
  await auth.protect();

  return <RoomProvider roomId={id}>{children}</RoomProvider>;
}
