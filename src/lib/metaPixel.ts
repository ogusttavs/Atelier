const DEFAULT_META_PIXEL_ID = '955556413646784';
const ENABLED_HOSTS = new Set(['oatelier21.com.br', 'www.oatelier21.com.br']);

type FbqFunction = ((command: string, event: string, params?: Record<string, unknown>) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[][];
  loaded?: boolean;
  push?: (...args: unknown[]) => void;
  version?: string;
};

declare global {
  interface Window {
    fbq?: FbqFunction;
    _fbq?: FbqFunction;
  }
}

let metaPixelInitialized = false;
let lastTrackedUrl = '';

function getMetaPixelId(): string {
  return (import.meta.env.VITE_META_PIXEL_ID || DEFAULT_META_PIXEL_ID).trim();
}

function shouldEnableMetaPixel(): boolean {
  return typeof window !== 'undefined' && ENABLED_HOSTS.has(window.location.hostname);
}

export function initMetaPixel(): void {
  if (metaPixelInitialized || !shouldEnableMetaPixel()) return;

  const pixelId = getMetaPixelId();
  if (!pixelId) return;

  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) {
      fbq.callMethod(...args);
      return;
    }

    fbq.queue?.push(args);
  } as FbqFunction;

  if (!window.fbq) {
    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.push = (...args: unknown[]) => {
      fbq.queue?.push(args);
    };

    window.fbq = fbq;
    window._fbq = fbq;

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(script);
  }

  window.fbq?.('init', pixelId);
  metaPixelInitialized = true;
}

export function trackMetaPageView(): void {
  if (!shouldEnableMetaPixel()) return;

  initMetaPixel();

  const currentUrl = window.location.href;
  if (lastTrackedUrl === currentUrl) return;

  lastTrackedUrl = currentUrl;
  window.fbq?.('track', 'PageView');
}
