// Client-side encryption for API keys using Web Crypto API

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;

// Derive encryption key from user's password (stored in session, never persisted)
async function deriveKey(password: string, salt: any): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    } as any,
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptAPIKey(apiKey: string, password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(apiKey);

  // Generate random salt and IV
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const key = await deriveKey(password, salt);

  const encrypted = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    data
  );

  // Combine salt, IV, and encrypted data
  const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(encrypted), salt.length + iv.length);

  // Convert to base64
  return btoa(String.fromCharCode(...combined));
}

export async function decryptAPIKey(encryptedKey: string, password: string): Promise<string> {
  // Decode from base64
  const combined = Uint8Array.from(atob(encryptedKey), c => c.charCodeAt(0));

  // Extract salt, IV, and encrypted data
  const salt = combined.slice(0, 16);
  const iv = combined.slice(16, 28);
  const encrypted = combined.slice(28);

  const key = await deriveKey(password, salt);

  const decrypted = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv },
    key,
    encrypted
  );

  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

// Generate a random encryption password for the session
export function generateEncryptionPassword(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
}

// Store encryption password in session storage (not persisted)
const SESSION_KEY = 'encryption_key';

export function getEncryptionPassword(): string | null {
  return sessionStorage.getItem(SESSION_KEY);
}

export function setEncryptionPassword(password: string): void {
  sessionStorage.setItem(SESSION_KEY, password);
}

export function clearEncryptionPassword(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
