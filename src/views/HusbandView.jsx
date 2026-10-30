import { useState } from "react";
import { motion } from "framer-motion";
import { REST_HOURS } from "../config";
import {
  adjustCoupons,
  effective,
  finishBackrub,
  grantCoupons,
  useBunny,
  useNow,
  wakeBunny,
} from "../hooks/useBunny";
import { pushTo } from "../hooks/useNotifications";
import CouponWallet from "../components/CouponWallet";
import NotifyBanner from "../components/NotifyBanner";
import Burst from "../components/Burst";
import { Gift, Minus, Moon, Plus, Swap } from "../components/Icons";

export default function HusbandView({ notify, onSwitch }) {
  const [s, error] = useBunny();
  const now = useNow(20000);
  const [n, setN] = useState(1);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(0);
  const [busy, setBusy] = useState(false);

  if (error)
    return (
      <main className="hq">
        <p className="err">
          Can't reach the burrow ({error.code}). Check the secret id in config.
        </p>
      </main>
    );
  if (!s) return null;
  const eff = effective(s, now);
  const since = s.requestedAt
    ? Math.max(0, Math.round((now - s.requestedAt.toMillis()) / 60000))
    : 0;

  const run = async (fn) => {
    setBusy(true);
    try {
      await fn();
    } finally {
      setBusy(false);
    }
  };
  const send = () =>
    run(async () => {
      await grantCoupons(s, n, note);
      pushTo(
        s.subs?.wife,
        "🎟️ New back rub coupon!",
        note.trim() || `Your husband sent you ${n} coupon${n > 1 ? "s" : ""} ♥`,
      );
      setNote("");
      setSent((x) => x + 1);
    });

  return (
    <main className="hq">
      <header className="top">
        <div className="brand">🐰 Bunny HQ</div>
        <button
          className="icon-btn"
          onClick={onSwitch}
          aria-label="Switch who this phone belongs to"
        >
          <Swap width={18} height={18} />
        </button>
      </header>
      <NotifyBanner notify={notify} />

      <motion.section
        className={`card status ${eff}`}
        animate={eff === "requested" ? { scale: [1, 1.02, 1] } : { scale: 1 }}
        transition={
          eff === "requested" ? { repeat: Infinity, duration: 1.8 } : {}
        }
      >
        {eff === "requested" && (
          <>
            <div className="status-emoji">💆‍♀️</div>
            <h2>Back rub requested!</h2>
            <p>
              {since < 1 ? "Just now" : `${since} min ago`}. She's waiting for
              you.
            </p>
            <button
              className="btn primary big"
              disabled={busy}
              onClick={() => run(() => finishBackrub(REST_HOURS))}
            >
              <Moon /> All done, bunny naps
            </button>
          </>
        )}
        {eff === "resting" && (
          <>
            <div className="status-emoji">😴</div>
            <h2>Bunny is napping</h2>
            <p>
              Back at{" "}
              {new Date(s.restUntil.toMillis()).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <button
              className="btn light"
              disabled={busy}
              onClick={() => run(wakeBunny)}
            >
              Wake the bunny
            </button>
          </>
        )}
        {eff === "idle" && (
          <>
            <div className="status-emoji">🐰</div>
            <h2>All calm</h2>
            <p>No requests. The bunny is waving at her.</p>
          </>
        )}
      </motion.section>

      <section className="card">
        <h3>Send her coupons</h3>
        <CouponWallet count={s.coupons} />

        <div className="stepper" role="group" aria-label="Number of coupons">
          <button
            className="round"
            aria-label="One less"
            disabled={n <= 1}
            onClick={() => setN(n - 1)}
          >
            <Minus />
          </button>
          <div className="stepper-n">
            <motion.b
              key={n}
              initial={{ y: -14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 26 }}
            >
              {n}
            </motion.b>
            <span>coupon{n > 1 ? "s" : ""}</span>
          </div>
          <button
            className="round"
            aria-label="One more"
            disabled={n >= 10}
            onClick={() => setN(n + 1)}
          >
            <Plus />
          </button>
        </div>

        <input
          className="input"
          placeholder="Add a sweet note (optional)"
          maxLength={80}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="send-row">
          <button className="btn primary big" disabled={busy} onClick={send}>
            <Gift /> Send {n} coupon{n > 1 ? "s" : ""}
          </button>
          <Burst
            fireKey={sent}
            count={16}
            spread={130}
            icons={["🎟️", "💛", "✨"]}
          />
        </div>
        <button
          className="btn ghost"
          disabled={busy || s.coupons < 1}
          onClick={() => run(() => adjustCoupons(-1))}
        >
          Take one back
        </button>
      </section>
    </main>
  );
}
