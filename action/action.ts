"use server";

import { adminDb } from "@/firebase-admin";
import { liveblocks } from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";

export async function createNewDocument() {
  await auth.protect();

  const { sessionClaims } = await auth();

  if (!sessionClaims?.email) {
    throw new Error("Email is missing in session claims.");
  }

  const docCollectionRef = adminDb.collection("documents");
  const docRef = await docCollectionRef.add({
    title: "New Doc",
  });

  await adminDb
    .collection("users")
    .doc(sessionClaims.email as string)
    .collection("rooms")
    .doc(docRef.id)
    .set({
      userId: sessionClaims.email,
      role: "owner",
      createdAt: new Date(),
      roomId: docRef.id,
    });

  return { docId: docRef.id };
}

export async function deleteDocument(roomId: string) {
  await auth.protect();

  try {
    // delete the document refernce itself
    await adminDb.collection("documents").doc(roomId).delete();
    const query = await adminDb
      .collectionGroup("rooms")
      .where("roomId", "==", roomId)
      .get();

    const batch = adminDb.batch();

    // delete the room reference in the user's collections for every user in the room
    query.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    // delete the room in liveblocks
    await liveblocks.deleteRoom(roomId);

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function inviteUserToDocument(roomId: string, email: string) {
  // const { userId } = await auth();

  // if (!userId) {
  //   // Handle unauthorized access (e.g., redirect to login or show an error)
  //   throw new Error("Unauthorized access. Please log in.");
  // }
  await auth.protect();
  try {
    await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .set({ userId: email, role: "editor", createdAt: new Date(), roomId });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export const removeUserFromDocument = async (roomId: string, email: string) => {
  await auth.protect();
  try {
    await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .delete();
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
};
