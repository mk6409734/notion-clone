import RoomProvider from "@/components/RoomProvider";
import { auth } from "@clerk/nextjs/server";

export default async function DocLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>; // Update the type definition for params
}) {
  const id = (await params).id;
  await auth.protect();

  return <RoomProvider roomId={id}>{children}</RoomProvider>;
}
