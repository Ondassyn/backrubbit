import { useState } from 'react';
import { motion } from 'framer-motion';
import { HUSBAND_PIN } from '../config';
import Rabbit from './Rabbit';
import { Heart, Gift } from './Icons';

export default function RolePicker({ onPick }) {
  const [askPin, setAskPin] = useState(false);
  const [pin, setPin] = useState('');
  const [bad, setBad] = useState(false);

  const husband = () => (HUSBAND_PIN ? setAskPin(true) : onPick('husband'));
  const check = (e) => {
    e.preventDefault();
    if (pin === HUSBAND_PIN) onPick('husband');
    else { setBad(true); setPin(''); }
  };

  return (
    <main className="picker">
      <div className="blend"><Rabbit pose="wave" /></div>
      <h1>Who's holding this phone?</h1>
      {!askPin ? (
        <div className="picks">
          <motion.button className="pick" whileTap={{ scale: 0.96 }} onClick={() => onPick('wife')}>
            <Heart width={26} height={26} />
            <span>I get the back rubs</span>
          </motion.button>
          <motion.button className="pick alt" whileTap={{ scale: 0.96 }} onClick={husband}>
            <Gift width={26} height={26} />
            <span>I give the back rubs</span>
          </motion.button>
        </div>
      ) : (
        <form className="pin" onSubmit={check}>
          <input className="input" type="password" inputMode="numeric" autoFocus placeholder="PIN" value={pin}
            onChange={(e) => { setPin(e.target.value); setBad(false); }} />
          {bad && <p className="err">Wrong PIN.</p>}
          <button className="btn primary">Continue</button>
          <button type="button" className="btn ghost" onClick={() => setAskPin(false)}>Back</button>
        </form>
      )}
    </main>
  );
}
