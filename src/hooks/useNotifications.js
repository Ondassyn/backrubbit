import { useCallback, useEffect, useState } from 'react';
import { savePushSub } from './useBunny';
import { PUSH_WORKER_URL, VAPID_PUBLIC_KEY } from '../config';

const b64ToBytes = (b64) => {
  const s = (b64 + '='.repeat((4 - (b64.length % 4)) % 4)).replace(/-/g, '+').replace(/_/g, '/');
  return Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
};

async function subscribe(role) {
  const reg = await navigator.serviceWorker.ready;
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToBytes(VAPID_PUBLIC_KEY) });
  }
  await savePushSub(role, sub.toJSON());
}

// Send a push to the other phone via the free Cloudflare worker. Fire-and-forget.
export function pushTo(rawSub, title, body) {
  if (!PUSH_WORKER_URL || !rawSub) return;
  fetch(PUSH_WORKER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subscription: JSON.parse(rawSub), title, body }),
  }).catch(() => {});
}

// status: off | checking | unsupported | ios-install | default | granted | denied
export function useNotifications(role) {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    if (!role) return;
    (async () => {
      if (!PUSH_WORKER_URL || !VAPID_PUBLIC_KEY) return setStatus('off');
      const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
      if (/iphone|ipad|ipod/i.test(navigator.userAgent) && !standalone) return setStatus('ios-install');
      if (!('Notification' in window) || !('PushManager' in window)) return setStatus('unsupported');
      setStatus(Notification.permission);
      if (Notification.permission === 'granted') await subscribe(role);
    })().catch((e) => console.warn('push', e));
  }, [role]);

  const enable = useCallback(async () => {
    const p = await Notification.requestPermission();
    setStatus(p);
    if (p === 'granted') await subscribe(role);
  }, [role]);

  return { status, enable };
}
