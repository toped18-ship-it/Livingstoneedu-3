import { getAdminDatabase } from "./firebaseAdmin";

interface RegisteredStore {
  name: string;
  getData: () => unknown;
  setData: (items: unknown) => void;
}

const registeredStores: RegisteredStore[] = [];
let syncSuccessLogged = false;

function encodeKey(key: string): string {
  return key
    .replaceAll(".", "_DOT_")
    .replaceAll("#", "_HASH_")
    .replaceAll("$", "_DOLLAR_")
    .replaceAll("/", "_SLASH_")
    .replaceAll("[", "_LBRACKET_")
    .replaceAll("]", "_RBRACKET_");
}

function decodeKey(key: string): string {
  return key
    .replaceAll("_RBRACKET_", "]")
    .replaceAll("_LBRACKET_", "[")
    .replaceAll("_SLASH_", "/")
    .replaceAll("_DOLLAR_", "$")
    .replaceAll("_HASH_", "#")
    .replaceAll("_DOT_", ".");
}

export function registerStore(
  name: string,
  getData: () => unknown,
  setData: (items: unknown) => void
): void {
  registeredStores.push({ name, getData, setData });
}

export async function hydrateStoresFromFirebase(): Promise<void> {
  const db = getAdminDatabase();
  if (!db) {
    console.warn("[Firebase RTDB] hydrateStores: Admin Database unavailable — skipping hydration");
    return;
  }

  await Promise.all(
    registeredStores.map(async (store) => {
      try {
        const snap = await db.ref(`live/${store.name}`).get();
        const val = snap.val();
        if (val === undefined || val === null) return;
        const current = store.getData();
        let restored = false;
        if (Array.isArray(current)) {
          const items = Array.isArray(val) ? val : Object.values(val);
          if (Array.isArray(items) && items.length > 0) { store.setData(items); restored = true; }
        } else if (current && typeof current === "object") {
          if (typeof val === "object" && val !== null) {
            const restoredObj: Record<string, unknown> = {};
            Object.entries(val as Record<string, unknown>).forEach(([k, v]) => {
              restoredObj[decodeKey(k)] = v;
            });
            store.setData(restoredObj);
            restored = true;
          }
        }
        if (restored) console.log(`[Firebase RTDB] Hydrated "${store.name}" from live/`);
      } catch (err) {
        console.error(`[Firebase RTDB] hydrate failed for "${store.name}":`, (err as any)?.message || err);
      }
    })
  );
}

export function syncStoresToFirebase(): void {
  const db = getAdminDatabase();
  if (!db) {
    console.warn("[Firebase RTDB] syncStores: Admin Database unavailable — skipping sync");
    return;
  }

  const updates: Record<string, unknown> = {};
  for (const store of registeredStores) {
    try {
      const data = store.getData();
      if (Array.isArray(data)) {
        const keyed: Record<string, unknown> = {};
        data.forEach((item) => {
          if (!item || typeof item !== "object") return;
          const rawId =
            (item as Record<string, unknown>).id ??
            (item as Record<string, unknown>).studentId ??
            (item as Record<string, unknown>).admissionNumber ??
            (item as Record<string, unknown>).code ??
            `k-${Math.random().toString(36).slice(2, 8)}`;
          keyed[encodeKey(String(rawId))] = item;
        });
        updates[store.name] = keyed;
      } else if (data && typeof data === "object") {
        const keyed: Record<string, unknown> = {};
        Object.entries(data as Record<string, unknown>).forEach(([k, v]) => {
          keyed[encodeKey(k)] = v;
        });
        updates[store.name] = keyed;
      }
    } catch (err) {
      console.error(`[Firebase RTDB] sync failed for "${store.name}":`, (err as any)?.message || err);
    }
  }

  try {
    db.ref("live").update(updates).then(() => {
      if (!syncSuccessLogged) {
        console.log("[Firebase RTDB] First successful sync —", Object.keys(updates).length, "stores written to live/");
        syncSuccessLogged = true;
      }
    }).catch((err) => {
      console.error("[Firebase RTDB] live update failed:", err?.message || err);
    });
  } catch (err) {
    console.error("[Firebase RTDB] live update threw:", (err as any)?.message || err);
  }
}