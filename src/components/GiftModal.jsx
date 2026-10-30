import { AnimatePresence, motion } from 'framer-motion';
import Burst from './Burst';
import { Heart } from './Icons';

export default function GiftModal({ grant, onClose }) {
  return (
    <AnimatePresence>
      {grant && (
        <motion.div className="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            className="gift"
            initial={{ scale: 0.5, y: 80, rotate: -6 }}
            animate={{ scale: 1, y: 0, rotate: 0 }}
            exit={{ scale: 0.8, y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 16 }}
          >
            <Burst fireKey={1} fireOnMount count={24} spread={160} icons={['💛', '✨', '🎟️', '💖']} />
            <motion.div
              className="gift-emoji"
              animate={{ rotate: [0, -12, 12, -8, 8, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.9 }}
            >
              🎁
            </motion.div>
            <h2>A gift from your husband</h2>
            <div className="gift-n">+{grant.n} <small>back rub coupon{grant.n > 1 ? 's' : ''}</small></div>
            {grant.note && <p className="gift-note">“{grant.note}”</p>}
            <button className="btn primary big" onClick={onClose}><Heart /> Yay!</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
