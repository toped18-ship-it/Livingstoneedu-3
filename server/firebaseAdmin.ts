import { initializeApp, cert, getApps, getApp, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getDatabase, Database } from "firebase-admin/database";

const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
  : `-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDLJdvisbLJCjEg\nIuPsKHSBvvXTPtSEaSyVsVKYS81Q3rTlJAs2hK7jbmjSUKXinju9+kN48Y5Ajv4z\nGTdQbRxDRmJFPToHt8ZhQKTRlFHFNbB2+xirBFeeu6dBLByNwqxDGvKz0Q2+8yhI\nO3h/jHIBtzJ8WYYplknXJWgnNoErqLoy7TTHKGj81lsSy+HWHbb4Hysae6hnslWT\nSHNP9W++NwljLGD0Dor3vTZsmFW22iHVANFWlOUoIO7NRqtBnsWhnvckEwSaPVSM\nFt6HuR3vjR9Xh9erlf4Dw5C2uQue90FjeU+ZurJcGACC6gqp2ORJ8KSs+R18hxVa\nJZ5CI8FlAgMBAAECggEAGgaDoQs66F6R5JgTsxGLu4OHYsTN3RjMSXEqL7CmYRHn\nAuQXO6jL7v8aFreWSO4UoUYKltf7bXHkRw+X8onH8SZ3OH+bi5mTpKnvc5oYz7cN\nIHESu/YWc5N+3e6UyeSCxSYSqc7CgBAOvRJBYbXQdT/PC/c8JN/IHfQA3+UvrzP3\n9O8y+aKVWVqYVpCmQMs5JGImRnSjZ3dagDn3JTL/Xhwl+5PJMk2uHNQvQ2qFOT0u\nhmh1D47Yg0KLGwjJ+RILIFWQeFkl41CtxvMzw9a2yW5WMfrbJvaZsOruooMKVYB7\nFPmzGhBae2lKHCjqWusFR9Jv4M92Cd4TT1Tw5fISgQKBgQD0RG2iG0swaYRKaGMM\nKoQspQjwyAWa1PByAieHJpVGhfbMeLn57wpad8XDznoyBLNkgU5moe139PDSRwTN\nWlkFuYnZH2kez2GYw6+x2otKSqsHt98LhGGEiQy9sBNWeAnd1qWbg4lh/fMZ2Rqj\n0uHJKoRB456811FI2D14kT+mSQKBgQDU59DsxsU5rNAASYp4sMyVb2dfvwqMC6kS\nDCzFpZcmIwtNohGpjC95PDUJQQF1axh6I08Ihm7VafpgKmwoPnmzJmJqy+bPlMAi\n+YYxN+WqqP7jDEvTyAVBROjXvQ144slFIw+08piZjXkCTgB53vkNId8KQ7OwfZGZ\n2ZcoKggSPQKBgHtA8AUFOqpiA9O72oawCWOxntJIS7O10OHmPmXOzTH5tO+11znL\nKXE+0HaeAECu6IpFSPc2q+mEmeOw3DZ2aUcfOPRrChL216tKyqO2v+QryyMo344j\nLUXAFcK9TvSpu2jJv2S6OZ9NkdYwG2YgqbdlEblhjp6BE03rdxEYUYKpAoGBAJeH\ndhdPUUe/SzspHDjR/InPBFAM9EDAe9CwgZ0aQf2Oq5jRZKi7cX5j74tqjNM5Ke6j\n+rgilfemueB/0QLDlHKBO0KvZNMRF77MwUl+cyOHrAGE2uMcVUEi/mWt1EzZfE6M\nqb0rfJitLBcL1SLoI3HJTalMjjNq65oIV6DqaVwxAoGAScAutFDk1LNjX19n3Ny9\nLtZW3aVTQYe4yRxCPKyTK8JAclqw4DEg0MpZXxddsDK7/0A5ZQGS8wDqG47trQWV\nm/9Xl+Qg/wm400J13yNPMVGgxXFMyicTbO5R7s0mCJFBYt+7hoYcqvo2eTVqbB8V\ncc9oLZE9//S7bWNjWT8gBEA=\n-----END PRIVATE KEY-----\n`;

const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk-fbsvc@livingstoneedu-1ef57.iam.gserviceaccount.com";
const projectId = process.env.FIREBASE_PROJECT_ID || "livingstoneedu-1ef57";
const databaseURL = process.env.FIREBASE_DATABASE_URL || "https://livingstoneedu-1ef57-default-rtdb.firebaseio.com/";

let firebaseAdminApp: App | null = null;

export function getFirebaseAdmin(): App | null {
  if (!firebaseAdminApp) {
    if (getApps().length > 0) {
      firebaseAdminApp = getApp();
    } else {
      try {
        firebaseAdminApp = initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey,
          }),
          databaseURL,
        });
        console.log("Firebase Admin SDK initialized successfully for project:", projectId);
      } catch (err) {
        console.error("Failed to initialize Firebase Admin SDK:", err);
      }
    }
  }
  return firebaseAdminApp;
}

export function getAdminAuth(): Auth | null {
  const app = getFirebaseAdmin();
  return app ? getAuth(app) : null;
}

export function getAdminDatabase(): Database | null {
  const app = getFirebaseAdmin();
  return app ? getDatabase(app) : null;
}
