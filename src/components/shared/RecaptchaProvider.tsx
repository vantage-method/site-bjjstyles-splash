import { GHL } from '../../lib/constants';

declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

let loadPromise: Promise<void> | null = null;

/** Injects the reCAPTCHA v3 script if not already present */
function ensureRecaptchaLoaded(): Promise<void> {
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<void>((resolve, reject) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }

    // Already loaded by another source
    if (window.grecaptcha) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${GHL.recaptchaSiteKey}`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load reCAPTCHA'));
    document.head.appendChild(script);
  });

  return loadPromise;
}

/** Gets a reCAPTCHA v3 token for form submission */
export async function getRecaptchaToken(action = 'submit'): Promise<string> {
  try {
    await ensureRecaptchaLoaded();

    return await new Promise<string>((resolve) => {
      window.grecaptcha.ready(async () => {
        const token = await window.grecaptcha.execute(GHL.recaptchaSiteKey, {
          action,
        });
        resolve(token);
      });
    });
  } catch {
    // Graceful degradation — let GHL decide server-side
    return '';
  }
}
