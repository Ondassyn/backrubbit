const { onDocumentWritten } = require('firebase-functions/v2/firestore');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { getMessaging } = require('firebase-admin/messaging');

initializeApp();
const DEAD = ['messaging/registration-token-not-registered', 'messaging/invalid-registration-token'];

async function push(role, title, body) {
  const url = process.env.APP_URL;
  const snap = await getFirestore().collection('users').where('role', '==', role).get();
  const items = snap.docs.flatMap((d) => (d.data().tokens || []).map((token) => ({ token, ref: d.ref })));
  if (!items.length) return;
  const res = await getMessaging().sendEachForMulticast({
    tokens: items.map((i) => i.token),
    notification: { title, body },
    webpush: {
      fcmOptions: { link: url },
      notification: { icon: `${url}/icon-192.png`, badge: `${url}/icon-192.png` },
    },
  });
  await Promise.all(
    res.responses.map((r, i) =>
      !r.success && DEAD.includes(r.error?.code)
        ? items[i].ref.update({ tokens: FieldValue.arrayRemove(items[i].token) })
        : null
    )
  );
}

exports.onBunnyChange = onDocumentWritten('state/main', async (ev) => {
  const b = ev.data.before.exists ? ev.data.before.data() : {};
  const a = ev.data.after.exists ? ev.data.after.data() : null;
  if (!a) return;

  if (a.status === 'requested' && b.status !== 'requested') {
    await push('husband', '🐰 Back rub requested!', 'She is waiting. Hop to it! 💆‍♀️');
  }
  if (a.lastGrant?.id && a.lastGrant.id !== b.lastGrant?.id) {
    const g = a.lastGrant;
    await push('wife', '🎟️ New back rub coupon!', g.note || `Your husband sent you ${g.n} coupon${g.n > 1 ? 's' : ''} ♥`);
  }
});
