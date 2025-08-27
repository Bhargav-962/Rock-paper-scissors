// BroadcastChannel wrapper with localStorage fallback
import { CHANNEL_NAME } from '../constants';

let instance = null;

function createChannel() {
  if (typeof window === 'undefined') return null;

  try {
    const bc = new BroadcastChannel(CHANNEL_NAME);
    return {
      postMessage: (m) => bc.postMessage(m),
      addEventListener: (ev, h) => bc.addEventListener(ev, h),
      removeEventListener: (ev, h) => bc.removeEventListener(ev, h),
      close: () => bc.close(),
    };
  } catch (err) {
    // fallback using storage events
    const key = `__${CHANNEL_NAME}_fallback`;
    const handlers = new Set();
    const onStorage = (e) => {
      if (e.key !== key) return;
      try {
        const parsed = JSON.parse(e.newValue);
        handlers.forEach((h) => h({ data: parsed }));
      } catch {}
    };
    window.addEventListener('storage', onStorage);
    return {
      postMessage: (m) => {
        try {
          localStorage.setItem(key, JSON.stringify(m));
        } catch {}
      },
      addEventListener: (_ev, h) => handlers.add(h),
      removeEventListener: (_ev, h) => handlers.delete(h),
      close: () => window.removeEventListener('storage', onStorage),
    };
  }
}

export function getChannel() {
  if (!instance) instance = createChannel();
  return instance;
}
