import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function SpeechBubble({ text }) {
  const chars = useMemo(() => Array.from(text || ''), [text]);
  const [n, setN] = useState(0);

  useEffect(() => {
    setN(0);
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setN(i);
      if (i >= chars.length) clearInterval(t);
    }, 28);
    return () => clearInterval(t);
  }, [chars]);

  return (
    <AnimatePresence mode="wait">
      {text && (
        <motion.div
          key={text}
          className="bubble"
          initial={{ scale: 0.6, opacity: 0, y: 14 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, transition: { duration: 0.18 } }}
          transition={{ type: 'spring', stiffness: 380, damping: 20 }}
        >
          {chars.slice(0, n).join('')}
          <span className="bubble-rest">{chars.slice(n).join('')}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
