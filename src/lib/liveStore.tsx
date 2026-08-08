import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ref, onValue } from "firebase/database";
import { rtdb } from "./firebase";

/**
 * Client-side live data bus.
 *
 * Every admin panel change is persisted to the backend API and then broadcast two ways:
 *  1. instantly in this tab via `notifyDataChanged()` -> window event -> REST refetch;
 *  2. to every open tab/device via the backend's `live/*` Firebase RTDB sync (5s).
 * `useLiveData` views automatically re-render whenever the store updates.
 */

export const LIVE_DATA_EVENT = "app:data-changed";

interface LiveEntry {
  data: any;
  version: number;
}

interface StoreConfig {
  path: string;
  decode: (payload: any) => any;
}

const FEMALE_AVATAR = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80";
const MALE_AVATAR = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80";
const STORE_AVATAR =
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80";

const STORE_CONFIG: Record<string, StoreConfig> = {
  students: {
    path: "/api/students",
    decode: (payload: any) =>
      (payload?.data || []).map((s: any) => ({
        avatar: s.avatar || (s.gender === "Female" ? FEMALE_AVATAR : MALE_AVATAR),
        ...s,
      })),
  },
  teachers: {
    path: "/api/teachers",
    decode: (payload: any) =>
      (payload?.data || []).map((t: any) => ({
        avatar: t.avatar || STORE_AVATAR,
        phone: t.phone || "+234 800 000 0000",
        ...t,
      })),
  },
  questionBank: {
    path: "/api/question-bank",
    decode: (payload: any) => payload?.data || [],
  },
  libraryBooks: {
    path: "/api/library/books",
    decode: (payload: any) => payload?.data || [],
  },
  emailSubscribers: {
    path: "/api/gmail/subscribers",
    decode: (payload: any) => payload?.data || [],
  },
  attendanceRegister: {
    path: "/api/attendance/registers",
    decode: (payload: any) => payload?.data || [],
  },
  teacherLessons: {
    path: "/api/teacher/lesson-notes",
    decode: (payload: any) => payload?.data || [],
  },
  teacherExams: {
    path: "/api/teacher/exams",
    decode: (payload: any) => payload?.data || [],
  },
};

/** Snapshot shape written by the server into RTDB `live/<store>` */
function decodeSnapshot(name: string, val: any): any[] {
  if (val === null || val === undefined) return [];
  const items = Array.isArray(val) ? val : Object.values(val);
  const cfg = STORE_CONFIG[name];
  return cfg ? cfg.decode({ data: items }) : items;
}

const StoreContext = createContext<{ entries: Record<string, LiveEntry> } | null>(null);

export const LiveDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<Record<string, LiveEntry>>({});
  const entriesRef = useRef<Record<string, LiveEntry>>({});
  const hashesRef = useRef<Record<string, string>>({});

  const commit = useCallback((name: string, data: any) => {
    const key = JSON.stringify(data);
    if (hashesRef.current[name] === key) return;
    hashesRef.current[name] = key;
    const prev = entriesRef.current[name];
    entriesRef.current = {
      ...entriesRef.current,
      [name]: { data, version: (prev?.version ?? 0) + 1 },
    };
    setEntries(entriesRef.current);
  }, []);

  const loadFromApi = useCallback(
    async (name: string) => {
      const cfg = STORE_CONFIG[name];
      if (!cfg) return;
      try {
        const res = await fetch(cfg.path);
        const payload = await res.json();
        commit(name, cfg.decode(payload));
      } catch (err) {
        console.warn(`LiveStore: failed to fetch ${cfg.path}`, err);
      }
    },
    [commit]
  );

  // Initial REST load + realtime RTDB subscription for every configured store
  useEffect(() => {
    const unsubs: (() => void)[] = [];
    Object.keys(STORE_CONFIG).forEach((name) => {
      loadFromApi(name);
      try {
        const dbRef = ref(rtdb, `live/${name}`);
        unsubs.push(
          onValue(dbRef, (snap) => {
            commit(name, decodeSnapshot(name, snap.val()));
          })
        );
      } catch (err) {
        console.warn(`LiveStore: RTDB subscription failed for "${name}":`, err);
      }
    });
    return () => unsubs.forEach((un) => un());
  }, [loadFromApi, commit]);

  // Reroute same-tab changes (and other tabs) into the live bus
  useEffect(() => {
    const handler = (e: Event) => {
      const names = (e as CustomEvent<{ names?: string[] }>).detail?.names;
      const targets = names && names.length ? names : Object.keys(STORE_CONFIG);
      targets.forEach((n) => loadFromApi(n));
    };
    window.addEventListener(LIVE_DATA_EVENT, handler);
    return () => window.removeEventListener(LIVE_DATA_EVENT, handler);
  }, [loadFromApi]);

  const value = useMemo(() => ({ entries }), [entries]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

/** Subscribe a view to a live store. Re-renders on every server-side/broadcast change. */
export function useLiveData<T = any>(name: string): { data: T[]; version: number } {
  const ctx = useContext(StoreContext);
  const entry = ctx?.entries[name];
  return {
    data: (entry?.data as T[]) || [],
    version: entry?.version ?? 0,
  };
}

/** Broadcast that one or more stores changed; every subscribed view refetches immediately. */
export function notifyDataChanged(names: string[]): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(LIVE_DATA_EVENT, { detail: { names } }));
}

/** Run `handler` whenever any store in the app changes (e.g. self-contained dashboards). */
export function useGlobalRefresh(handler: () => void, enabled = true): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;
  useEffect(() => {
    if (!enabled) return;
    const listener = () => handlerRef.current();
    window.addEventListener(LIVE_DATA_EVENT, listener);
    return () => window.removeEventListener(LIVE_DATA_EVENT, listener);
  }, [enabled]);
}