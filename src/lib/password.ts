// Web Crypto based password hashing.
// در همه runtime ها (Node + Vercel Serverless + Edge) یکسان کار می‌کند.

const ITERATIONS = 100_000;
const KEY_LEN = 32;
const SALT_LEN = 16;

function bufToHex(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let out = "";
  for (let i = 0; i < bytes.length; i++) {
    out += bytes[i].toString(16).padStart(2, "0");
  }
  return out;
}

function hexToBuf(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return out;
}

async function pbkdf2(
  password: string,
  salt: Uint8Array,
  iterations: number,
  keyLen: number
): Promise<ArrayBuffer> {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  return crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt as BufferSource,
      iterations,
      hash: "SHA-256",
    },
    baseKey,
    keyLen * 8
  );
}

export async function hashPassword(plain: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LEN));
  const derived = await pbkdf2(plain, salt, ITERATIONS, KEY_LEN);
  return `pbkdf2$${ITERATIONS}$${bufToHex(salt.buffer)}$${bufToHex(derived)}`;
}

export async function verifyPassword(
  plain: string,
  hash: string
): Promise<boolean> {
  try {
    const parts = hash.split("$");
    if (parts.length !== 4) return false;
    const [, iterStr, saltHex, hashHex] = parts;
    const iterations = parseInt(iterStr, 10);
    const salt = hexToBuf(saltHex);
    const derived = await pbkdf2(plain, salt, iterations, KEY_LEN);
    return bufToHex(derived) === hashHex;
  } catch {
    return false;
  }
}
