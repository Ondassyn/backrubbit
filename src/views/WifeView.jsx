import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import { effective, requestBackrub, useBunny, useNow } from '../hooks/useBunny';
import Rabbit from '../components/Rabbit';
import SpeechBubble from '../components/SpeechBubble';
import CouponWallet from '../components/CouponWallet';
import RestingSign from '../components/RestingSign';
import GiftModal from '../components/GiftModal';
import NotifyBanner from '../components/NotifyBanner';
import { Heart, Swap } from '../components/Icons';
import { pushTo } from '../hooks/useNotifications';

const SEEN_KEY = 'bb_seen_grant';

export default function WifeView({ notify, onSwitch }) {
  const [s, error] = useBunny();
  const now = useNow(15000);
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState('wave'); // arrive → wave → ask
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [seen, setSeen] = useState(() => localStorage.getItem(SEEN_KEY));
  const ctl = useAnimationControls();
  const prevEff = useRef(null);

  const eff = s ? effective(s, now) : 'idle';
  const coupons = s?.coupons ?? 0;
  const grant = s?.lastGrant;
  const giftOpen = !!grant && grant.id !== seen;
  const shownCoupons = giftOpen ? Math.max(0, coupons - grant.n) : coupons; // coupons "drop in" after gift is opened

  // rabbit walks out to nap / walks back in when awake
  useEffect(() => {
    if (!ready || !s) return;
    const prev = prevEff.current;
    prevEff.current = eff;
    if (eff === 'resting') {
      if (prev === null) ctl.set({ x: '130%', opacity: 0, y: 0 });
      else ctl.start({ x: '130%', opacity: 0, transition: { duration: 1.5, ease: 'easeInOut' } });
    } else if (prev === 'resting') {
      ctl.set({ x: '-130%', opacity: 0, y: 0 });
      ctl.start({ x: 0, opacity: 1, transition: { duration: 1.5, ease: 'easeOut' } });
      setPhase('arrive');
    } else if (prev === null) {
      ctl.start({ x: 0, y: 0, opacity: 1, transition: { type: 'spring', stiffness: 160, damping: 14 } });
    }
  }, [eff, ready, !!s]);

  // wave → ask timeline
  useEffect(() => {
    if (!ready || !s || eff !== 'idle') return;
    if (phase === 'arrive') {
      const t = setTimeout(() => setPhase('wave'), 1500);
      return () => clearTimeout(t);
    }
    if (phase === 'wave') {
      const t = setTimeout(() => setPhase('ask'), 4800);
      return () => clearTimeout(t);
    }
  }, [ready, !!s, eff, phase]);

  const pose = eff === 'idle' && phase === 'wave' ? 'wave' : eff === 'idle' && phase === 'ask' ? 'notebook' : 'walk';
  const walking = pose === 'walk';

  const line =
    !ready || !s || eff === 'resting' || phase === 'arrive'
      ? null
      : eff === 'requested'
      ? "I'm on my way! Get cozy, my magic hands are warming up 🐾"
      : phase === 'wave'
      ? 'Hello, my lovely lady, how are you? 💛'
      : coupons > 0
      ? 'Do you want to make an appointment for back rubs?'
      : "Oh no, you're out of coupons! Maybe sweet-talk your husband? 🥕";

  const onRequest = async () => {
    setBusy(true);
    setMsg('');
    try {
      await requestBackrub();
      pushTo(s.subs?.husband, '🐰 Back rub requested!', 'She is waiting. Hop to it! 💆‍♀️');
    } catch {
      setMsg("Couldn't book it. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  const closeGift = () => {
    localStorage.setItem(SEEN_KEY, grant.id);
    setSeen(grant.id);
  };

  return (
    <main className={`scene ${eff === 'resting' ? 'night' : ''}`}>
      <div className="night-sky" aria-hidden />
      <header className="top">
        <div className="brand">🐰 BackRubbit</div>
        <button className="icon-btn" onClick={onSwitch} aria-label="Switch who this phone belongs to"><Swap width={18} height={18} /></button>
      </header>
      <NotifyBanner notify={notify} />

      <section className="stage">
        <div className="bubble-slot">
          <SpeechBubble text={line} />
        </div>

        <motion.div className="rabbit-wrap" initial={{ opacity: 0, y: 30 }} animate={ctl}>
          <motion.div
            animate={walking ? { y: [0, -6, 0] } : { y: 0 }}
            transition={walking ? { repeat: Infinity, duration: 0.55, ease: 'easeInOut' } : { duration: 0.2 }}
          >
            <Rabbit pose={pose} onReady={() => setReady(true)} />
          </motion.div>
        </motion.div>

        {eff === 'requested' && (
          <div className="paws" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <motion.span key={i} animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.6, delay: i * 0.35 }}>🐾</motion.span>
            ))}
          </div>
        )}
        {eff === 'resting' && <RestingSign until={s.restUntil.toMillis()} now={now} />}
      </section>

      <section className="dock">
        <AnimatePresence>
          {eff === 'idle' && phase === 'ask' && coupons > 0 && (
            <motion.button
              key="cta"
              className="btn primary big"
              initial={{ y: 40, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRequest}
              disabled={busy}
            >
              <Heart /> Yes, I want a back rub
            </motion.button>
          )}
        </AnimatePresence>
        {eff === 'requested' && <p className="hint">🐾 Your husband has been notified ♥</p>}
        {msg && <p className="err">{msg}</p>}
        {error && <p className="err">Can't reach the burrow ({error.code}). Check the secret id in config.</p>}
        {s && <CouponWallet count={shownCoupons} />}
      </section>

      <GiftModal grant={giftOpen ? grant : null} onClose={closeGift} />
    </main>
  );
}
