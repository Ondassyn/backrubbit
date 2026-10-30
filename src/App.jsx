import { useState } from 'react';
import { useNotifications } from './hooks/useNotifications';
import RolePicker from './components/RolePicker';
import WifeView from './views/WifeView';
import HusbandView from './views/HusbandView';

const KEY = 'bb_role';

export default function App() {
  const [role, setRoleState] = useState(() => localStorage.getItem(KEY));
  const setRole = (r) => {
    if (r) localStorage.setItem(KEY, r);
    else localStorage.removeItem(KEY);
    setRoleState(r);
  };
  const notify = useNotifications(role);
  const onSwitch = () => window.confirm('Switch who this phone belongs to?') && setRole(null);

  return (
    <>
      <div className="sky" aria-hidden>
        <i className="cloud c1" /><i className="cloud c2" /><i className="cloud c3" />
      </div>
      {!role && <RolePicker onPick={setRole} />}
      {role === 'wife' && <WifeView notify={notify} onSwitch={onSwitch} />}
      {role === 'husband' && <HusbandView notify={notify} onSwitch={onSwitch} />}
    </>
  );
}
