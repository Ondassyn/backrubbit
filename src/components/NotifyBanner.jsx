import { Bell } from './Icons';

export default function NotifyBanner({ notify }) {
  const { status, enable } = notify;
  if (status === 'default')
    return <button className="pill" onClick={enable}><Bell width={18} height={18} /> Turn on notifications</button>;
  if (status === 'ios-install')
    return <div className="pill soft">Tap Share → Add to Home Screen, then open from the icon to get notifications</div>;
  if (status === 'denied')
    return <div className="pill soft">Notifications are blocked in your phone settings</div>;
  return null;
}
