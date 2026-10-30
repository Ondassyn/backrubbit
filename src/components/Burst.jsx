import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// Particle burst. Fires whenever `fireKey` changes (or on mount with fireOnMount).
export default function Burst({ fireKey, count = 12, spread = 90, icons = ['♥'], fireOnMount = false }) {
  const [ps, setPs] = useState([]);
  const prev = useRef(fireOnMount ? null : fireKey);

  useEffect(() => {
    if (prev.current === fireKey) return;
    prev.current = fireKey;
    const id = Date.now();
    setPs(
      Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2 + Math.random() * 0.6;
        const d = spread * (0.55 + Math.random() * 0.7);
        return {
          k: `${id}-${i}`,
          x: Math.cos(a) * d,
          y: Math.sin(a) * d - 24,
          r: Math.random() * 90 - 45,
          s: 0.8 + Math.random() * 0.9,
          ic: icons[i % icons.length],
        };
      })
    );
    const t = setTimeout(() => setPs([]), 1500);
    return () => clearTimeout(t);
  }, [fireKey]);

  return (
    <div className="burst" aria-hidden>
      {ps.map((p) => (
        <motion.span
          key={p.k}
          className="burst-p"
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: p.s, rotate: p.r }}
          transition={{ duration: 1.15, ease: 'easeOut' }}
        >
          {p.ic}
        </motion.span>
      ))}
    </div>
  );
}
