import { useEffect, useState } from 'react';
import { doc, onSnapshot, runTransaction, setDoc, increment, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { COUPLE_ID } from '../config';

const ref = doc(db, 'couples', COUPLE_ID);
const EMPTY = { coupons: 0, status: 'idle' };

export function useBunny() {
  const [s, setS] = useState(null);
  const [error, setError] = useState(null);
  useEffect(
    () =>
      onSnapshot(
        ref,
        (snap) => setS({ ...EMPTY, ...(snap.exists() ? snap.data({ serverTimestamps: 'estimate' }) : {}) }),
        setError
      ),
    []
  );
  return [s, error];
}

export function useNow(ms = 15000) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(t);
  }, [ms]);
  return now;
}

// 'idle' | 'requested' | 'resting'
export function effective(s, now) {
  if (s.status === 'requested') return 'requested';
  if (s.status === 'resting' && s.restUntil?.toMillis() > now) return 'resting';
  return 'idle';
}

export const savePushSub = (role, json) =>
  setDoc(ref, { subs: { [role]: JSON.stringify(json) } }, { merge: true });

// ---- wife ----
export function requestBackrub() {
  return runTransaction(db, async (tx) => {
    const d = (await tx.get(ref)).data();
    if (!d || !(d.coupons >= 1)) throw new Error('no-coupons');
    tx.update(ref, { coupons: d.coupons - 1, status: 'requested', requestedAt: serverTimestamp() });
  });
}

// ---- husband ----
export function grantCoupons(s, n, note) {
  return setDoc(
    ref,
    {
      coupons: increment(n),
      status: s.status === 'requested' ? 'requested' : 'idle', // also wakes sleeping bunny
      lastGrant: { id: crypto.randomUUID(), n, note: note?.trim() || null, at: Date.now() },
    },
    { merge: true }
  );
}
export const adjustCoupons = (delta) => setDoc(ref, { coupons: increment(delta) }, { merge: true });
export const finishBackrub = (hours) =>
  setDoc(
    ref,
    { status: 'resting', restUntil: Timestamp.fromMillis(Date.now() + hours * 3600e3), finishedAt: serverTimestamp() },
    { merge: true }
  );
export const wakeBunny = () => setDoc(ref, { status: 'idle' }, { merge: true });
