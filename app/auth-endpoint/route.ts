import { adminDb } from "@/firebase-admin";
import { liveblocks } from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { message: "Unauthorized access. Please log in." },
      { status: 401 }
    );
  }

  const { sessionClaims } = await auth();

  // Validate that sessionClaims.email exists and is a string
  if (
    !sessionClaims ||
    typeof sessionClaims.email !== "string" ||
    sessionClaims.email.trim() === ""
  ) {
    return NextResponse.json(
      { message: "Invalid session claims: email is missing or not a string." },
      { status: 400 }
    );
  }

  const { room } = await req.json();

  if (!adminDb) {
    return NextResponse.json(
      {
        message:
          "Firebase Admin not initialized. Please check your environment variables.",
      },
      { status: 500 }
    );
  }

  const session = liveblocks.prepareSession(sessionClaims.email, {
    userInfo: {
      name:
        typeof sessionClaims.fullName === "string"
          ? sessionClaims.fullName
          : "Anonymous",
      email: sessionClaims.email,
      avatar:
        typeof sessionClaims.image === "string" ? sessionClaims.image : "",
    },
  });

  const usersInRoom = await adminDb
    .collectionGroup("rooms")
    .where("userId", "==", sessionClaims.email)
    .get();

  const userInRoom = usersInRoom.docs.find((doc: any) => doc.id === room);

  if (userInRoom?.exists) {
    session.allow(room, session.FULL_ACCESS);
    const { body, status } = await session.authorize();

    return new Response(body, { status });
  } else {
    return NextResponse.json(
      { message: "You are not in this room" },
      { status: 403 }
    );
  }
}
