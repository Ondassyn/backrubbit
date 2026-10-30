import { motion } from 'framer-motion';

export default function RestingSign({ until, now }) {
  const left = Math.max(0, until - now);
  const h = Math.floor(left / 3600e3);
  const m = Math.ceil((left % 3600e3) / 60e3);
  const eta = h > 0 ? `${h}h ${m}m` : `${m} min`;

  return (
    <motion.div
      className="resting"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1, duration: 0.9 }}
    >
      <svg viewBox="0 0 260 210" width="260" role="img" aria-label="Bunny burrow with a sleeping sign">
        {[[40, 30], [90, 55], [200, 26], [160, 70], [230, 88]].map(([x, y], i) => (
          <motion.circle key={i} cx={x} cy={y} r="2.2" fill="#FFF3C4"
            animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.5 }} />
        ))}
        <path d="M58 24a24 24 0 1 0 22 34a19 19 0 1 1-22-34z" fill="#FFE9A8" />
        <ellipse cx="120" cy="190" rx="112" ry="13" fill="#3C2F63" opacity=".55" />
        <path d="M22 190Q22 92 118 92Q214 92 214 190Z" fill="#8A6A4F" />
        <path d="M22 190Q22 92 118 92Q214 92 214 190Z" fill="none" stroke="#6E523B" strokeWidth="4" />
        <path d="M84 190Q84 128 118 128Q152 128 152 190Z" fill="#2A1A10" />
        <ellipse cx="102" cy="176" rx="7" ry="3" fill="#FFC84A" opacity=".8" />
        <path d="M30 186q4-16 8 0m6 0q3-12 7 0" stroke="#7FBF6A" strokeWidth="3" fill="none" strokeLinecap="round" />
        <rect x="200" y="112" width="6" height="80" rx="3" fill="#A0672F" />
        <g transform="rotate(-4 218 128)">
          <rect x="176" y="98" width="86" height="46" rx="10" fill="#C98842" />
          <text x="219" y="118" textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight="600" fontSize="15" fill="#FFF3DC">Shhh…</text>
          <text x="219" y="135" textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight="500" fontSize="12" fill="#FFF3DC">bunny naps</text>
        </g>
        {['z', 'Z', 'z'].map((c, i) => (
          <motion.text key={i} x="112" y="118" fontFamily="Fredoka, sans-serif" fontWeight="700" fontSize={14 + i * 4}
            fill="#FFF3C4" animate={{ x: [112, 130 + i * 8], y: [118, 52 - i * 6], opacity: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 1, ease: 'easeOut' }}>
            {c}
          </motion.text>
        ))}
      </svg>
      <p className="resting-eta">Back in {eta}</p>
    </motion.div>
  );
}
