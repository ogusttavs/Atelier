const CHECKOUT_EMAIL_STORAGE_KEY = 'atelier21_last_checkout_email';

function normalizeCheckoutEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function readSavedCheckoutEmail(): string {
  if (typeof window === 'undefined') return '';

  try {
    return normalizeCheckoutEmail(window.localStorage.getItem(CHECKOUT_EMAIL_STORAGE_KEY) || '');
  } catch {
    return '';
  }
}

export function saveCheckoutEmail(email: string): string {
  const normalized = normalizeCheckoutEmail(email);
  if (!normalized || !normalized.includes('@') || typeof window === 'undefined') {
    return normalized;
  }

  try {
    window.localStorage.setItem(CHECKOUT_EMAIL_STORAGE_KEY, normalized);
  } catch {
    return normalized;
  }

  return normalized;
}
