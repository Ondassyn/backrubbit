// ---- edit me -------------------------------------------------------------
// Secret doc id. Only people who know it can read/write your data. Change to any long random string.
export const COUPLE_ID = "bunny-k7f3q9x2m4z8w1";
// Husband mode asks for this PIN once per phone. '' = no PIN.
export const HUSBAND_PIN = "1234";
export const REST_HOURS = 3; // how long bunny naps after a back rub

export const PUSH_WORKER_URL = import.meta.env.VITE_PUSH_WORKER_URL || "";
export const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || "";

export const RABBIT = {
  src: "/rabbit.riv",
  stateMachine: null, // null → first state machine in file. Find name via /?debug
  // Crop window (fractions of artboard width) → hides the blue buttons on the right.
  crop: { left: 0.3, width: 0.4 },
  fallbackAspect: 850 / 640, // artboard w/h until Rive reports real bounds
  // app pose → state machine input values. Guess: tombol = button index
  // (1 triangle, 2 hand, 3 pen, 4 star). Verify with /?debug and fix here.
  poses: {
    idle: { tombol: 1 },
    wave: { tombol: 2 },
    notebook: { tombol: 3 },
    walk: { tombol: 4 },
  },
  trigger: "Click", // trigger fired after inputs are set (null to disable)
};
