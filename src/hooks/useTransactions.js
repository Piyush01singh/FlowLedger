import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "../firebase";

const LOCAL_PREFIX = "flowledger:transactions:";

const toDateValue = (tx) => {
  if (tx.date) {
    const parsed = new Date(tx.date).getTime();
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  if (typeof tx.createdAt === "string") {
    const parsed = new Date(tx.createdAt).getTime();
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  if (tx.createdAt && typeof tx.createdAt.seconds === "number") {
    return tx.createdAt.seconds * 1000;
  }
  return 0;
};

const sortTransactions = (items) =>
  [...items].sort((a, b) => toDateValue(b) - toDateValue(a) || a.title.localeCompare(b.title));

const localStorageKey = (uid) => `${LOCAL_PREFIX}${uid}`;

const cleanTransactionInput = (payload) => ({
  title: payload.title.trim(),
  amount: Number.parseFloat(payload.amount) || 0,
  type: payload.type === "income" ? "income" : "expense",
  category: payload.category.trim(),
  date: payload.date,
  note: payload.note?.trim() || ""
});

const createLocalId = () => `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export function useTransactions(user) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const usingFirebase = Boolean(isFirebaseConfigured && db && user?.uid && user.uid !== "demo-user");
  const mode = useMemo(() => (usingFirebase ? "firebase" : "local"), [usingFirebase]);

  useEffect(() => {
    if (!user?.uid) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setError("");
    setLoading(true);

    if (usingFirebase) {
      const txCollection = collection(db, "users", user.uid, "transactions");
      const txQuery = query(txCollection, orderBy("date", "desc"));

      const unsubscribe = onSnapshot(
        txQuery,
        (snapshot) => {
          const rows = snapshot.docs.map((entry) => {
            const data = entry.data();
            return {
              id: entry.id,
              ...data,
              amount: Number(data.amount) || 0
            };
          });
          setTransactions(rows);
          setLoading(false);
        },
        () => {
          setError("Unable to sync transactions from Firestore.");
          setLoading(false);
        }
      );

      return unsubscribe;
    }

    try {
      const raw = localStorage.getItem(localStorageKey(user.uid));
      const parsed = raw ? JSON.parse(raw) : [];
      setTransactions(sortTransactions(parsed));
    } catch {
      setError("Local data could not be loaded.");
      setTransactions([]);
    }
    setLoading(false);
  }, [usingFirebase, user?.uid]);

  const updateLocalState = useCallback(
    (updater) => {
      if (!user?.uid) {
        return;
      }
      setTransactions((prev) => {
        const next = sortTransactions(updater(prev));
        localStorage.setItem(localStorageKey(user.uid), JSON.stringify(next));
        return next;
      });
    },
    [user?.uid]
  );

  const addTransaction = useCallback(
    async (payload) => {
      const clean = cleanTransactionInput(payload);

      if (usingFirebase) {
        await addDoc(collection(db, "users", user.uid, "transactions"), {
          ...clean,
          createdAt: serverTimestamp()
        });
        return;
      }

      updateLocalState((prev) => [
        {
          id: createLocalId(),
          ...clean,
          createdAt: new Date().toISOString()
        },
        ...prev
      ]);
    },
    [updateLocalState, user?.uid, usingFirebase]
  );

  const editTransaction = useCallback(
    async (txId, payload) => {
      const clean = cleanTransactionInput(payload);

      if (usingFirebase) {
        await updateDoc(doc(db, "users", user.uid, "transactions", txId), clean);
        return;
      }

      updateLocalState((prev) => prev.map((tx) => (tx.id === txId ? { ...tx, ...clean } : tx)));
    },
    [updateLocalState, user?.uid, usingFirebase]
  );

  const removeTransaction = useCallback(
    async (txId) => {
      if (usingFirebase) {
        await deleteDoc(doc(db, "users", user.uid, "transactions", txId));
        return;
      }
      updateLocalState((prev) => prev.filter((tx) => tx.id !== txId));
    },
    [updateLocalState, user?.uid, usingFirebase]
  );

  return {
    transactions,
    loading,
    error,
    mode,
    addTransaction,
    editTransaction,
    removeTransaction
  };
}
