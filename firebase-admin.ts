import { initializeApp, cert, getApp, getApps, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore"; // Use firestore from firebase-admin

let app: App;
let adminDb: any;

// Only initialize Firebase Admin if we're in a server environment with the required env vars
if (
  typeof window === "undefined" &&
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY
) {
  if (getApps().length === 0) {
    app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });
  } else {
    app = getApp();
  }

  adminDb = getFirestore(app);
}

export { app as adminApp, adminDb };
