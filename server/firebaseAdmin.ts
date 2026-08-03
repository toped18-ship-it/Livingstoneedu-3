import { initializeApp, cert, getApps, getApp, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getDatabase, Database } from "firebase-admin/database";

const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
  : `-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDA8OCi/RSFD0u2\nCQos1X+BQV7/72kSlOMnrklrrdaClbiNkK/qCMBXPR3Pb9KqyzZPA3z1Sq7W2ccm\nkSPHLFkxumWqBDa4wfcAdRZU7Y3JW3kpnWRmSDPj3fA5iua9DDZeg4vAxe1B8vle\nCrEEZSABOIODDJ+seVG4FetJQLP3nw9gySjK46I8/FKDWx3p45xUTikjA09Bhhh1\n7ywN6EZHnIQgUYvxu4l3/qOTWKYfB2pGj67ZHzs/1WSBd0p4oM+uLjbcYxjX51Gg\nHVdpDgKmQiY7iaN1MzF7cBZewWsDVX5TSZiAl5v1ch6r+VpS98Z5nRwGd4JR/dQ3\n6LrH1HGTAgMBAAECggEAMZcX3byXpBWI26paI6jiQ0oWjUivJHgBJIdO1q7RJjIu\nQ7CPDmOecC3EtjbjGkPt2wQl/3PpGU7TOY3veLdk23uxuq+nkvhDsKnnif+exETP\nEQujrQhc0fIO1vNlF+0GImfEKVGWCC/XuTydP+hv//BTGQFLHwz1nI+BsIvBVeDp\nUdoREaGTd4iHcngxhMkJXhVRkcNP8fMjKwHRRcuNa+YMWldAS91CqPgyQp6tHIqZ\nvauyWWJYGJualCYvhJcCsxe84oYMtBuUEIRdfEyWoqAJItzsNcJ7ne1JXerpoBSi\noqxkTGZUDtZEtyVgtGnHRsYc/AkEzITs8km594066QKBgQDiqXutl/NaCpiK6JZ7\n80uTFsXRcH5rhuSPKbxLtgjFCib4d1K7aOZMKXJW0lM0rwe7CwErl+qCHbxzLs7q\ntq5WjGPDZ1XKJVFlRclf46dO4u/W1gKqdwY703T0teddTdqcp5CEmT7t8BVGg+Mm\ngFv/NA2hxV1etgkkrIzOvb2YSQKBgQDZ6gjm9r7Pwoiif8JoB4fyZWyQ8kSq/dO1\nz1dS+KNygari2hFO6wCm2EAQYDJhLhr12GRJA+7UIBK1bpRovjFfZJQkUW/U4H54\naihZWszudCsoEt91//syNp06J8el9/OOgtkTxSRJLkckG+1SkEFHrW6IRaVuCE4t\nwGeNVmMS+wKBgQCT9ouUMONdXhliZJ8H3zTwmiccp9D/JJnDkz0mN3jWF+CExnAt\ngzcDdPL9FmPWuoPTaEWlTZB6zCqfDmlo80Qvn4non2ZzhZTzBXGFtTkc2Cw1FJO8\n7+IT3+AzdyPH1vDk3sYKqXdZICbjV2lLUvO7TyGu/wYKs86YMEPjGh3QcQKBgQCi\nlCAmKQs9OBb2nbjuIkhECXWRQp8Gr69HIrU02voe0S0saKOnLF9lG0vYq9yKcnp8\n1wAjFYMW0gMDR8gDyXpOgFyiJ/v2Z7MTpagK2lqwwQz9re74O44u7V4qaElkwvP8\nbBUG0ft7ecJr50YNZkC9+F/R3ZxJ1np1WeooIb5zBwKBgQCGQRsQX4GNuTf4/ijG\n6EcsvckM2LWCGn+YS9c3atdcTRpmuaTHJ5UQz03EyPleyEnHVQH+nXg4hGaMPa/a\nxxGhPq/qGZaNbw2Vb2lCms0u3B3pmF1MgQ5Of8HN6w+Gv6oYqIURa2qIdRL4i5fJ\ntaOhETrZJCuECVavgVvz8i6E6A==\n-----END PRIVATE KEY-----\n`;

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
