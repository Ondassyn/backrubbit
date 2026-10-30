import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Burst from './Burst';

const MAX = 4;
const COLORS = ['#FFC84A', '#FFB3C1', '#A9CBFF', '#B9E8A8'];

export default function CouponWallet({ count }) {
  const prev = useRef(count);
  const first = useRef(true);
  const [evt, setEvt] = useState({ id: 0, dir: 'inc' });

  useEffect(() => {
    if (count !== prev.current) {
      setEvt((e) => ({ id: e.id + 1, dir: count < prev.current ? 'dec' : 'inc' }));
      prev.current = count;
    }
  }, [count]);
  useEffect(() => { first.current = false; }, []);

  const shown = Math.min(count, MAX);

  return (
    <div className="wallet">
      <div className="wallet-count">
        <div className="wallet-num">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.b
              key={count}
              initial={{ y: evt.dir === 'dec' ? -28 : 28, opacity: 0, scale: 0.5 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: evt.dir === 'dec' ? 28 : -28, opacity: 0, scale: 0.5 }}
              transition={{ type: 'spring', stiffness: 420, damping: 22 }}
            >
              {count}
            </motion.b>
          </AnimatePresence>
        </div>
        <span className="wallet-label">back rub<br />coupon{count === 1 ? '' : 's'}</span>
      </div>

      <div className="wallet-stack">
        {count === 0 && <div className="ticket-empty">none left 🥺</div>}
        <AnimatePresence>
          {Array.from({ length: shown }, (_, i) => (
            <motion.div
              key={i}
              className="ticket"
              style={{ '--c': COLORS[i % COLORS.length], zIndex: i }}
              initial={{ y: -70, opacity: 0, rotate: -14 }}
              animate={{ y: i * -7, x: i * 7, rotate: i % 2 ? 4 : -3, opacity: 1 }}
              exit={{ y: -110, x: 40, rotate: 24, opacity: 0, scale: 1.2, transition: { duration: 0.7 } }}
              transition={{ type: 'spring', stiffness: 240, damping: 15, delay: first.current ? i * 0.1 : 0 }}
            >
              <span className="ticket-heart">♥</span>
              <span>back rub</span>
            </motion.div>
          ))}
        </AnimatePresence>
        <Burst
          fireKey={evt.id}
          count={evt.dir === 'dec' ? 10 : 14}
          spread={evt.dir === 'dec' ? 80 : 100}
          icons={evt.dir === 'dec' ? ['💗', '💛', '♥'] : ['✨', '🎟️', '💛']}
        />
      </div>
    </div>
  );
}
