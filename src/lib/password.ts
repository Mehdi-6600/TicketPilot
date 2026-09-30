import { webcrypto } from "crypto";

const { subtle } = webcrypto;

const ALGORITHM = "PBKDF2";
const HASH_ALGORITHM = "SHA-256";
const ITERATIONS = 120000;
const KEY_LENGTH = 256;
const SALT_LENGTH = 16;
const PREFIX = "pbkdf2";

function toBase64(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64url");
}

function fromBase64(value: string): Uint8Array {
  return new Uint8Array(Buffer.from(value, "base64url"));
}

async function deriveKey(password: string, salt: Uint8Array) {
  const passwordKey = await subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: ALGORITHM },
    false,
    ["deriveBits"]
  );

  return subtle.deriveBits(
    {
      name: ALGORITHM,
      salt,
      iterations: ITERATIONS,
      hash: HASH_ALGORITHM,
    },
    passwordKey,
    KEY_LENGTH
  );
}

export async function hashPassword(plain: string): Promise<string> {
  const salt = webcrypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const derivedBits = await deriveKey(plain, salt);

  return [
    PREFIX,
    ITERATIONS,
    toBase64(salt),
    toBase64(new Uint8Array(derivedBits)),
  ].join("$");
}

function isLegacyPasswordHash(hash: string): boolean {
  return hash.startsWith("plain:");
}

export function needsPasswordMigration(hash: string): boolean {
  return isLegacyPasswordHash(hash);
}

async function verifyLegacyPassword(
  plain: string,
  hash: string
): Promise<boolean> {
  return hash === `plain:${plain}`;
}

async function verifyModernPassword(
  plain: string,
  hash: string
): Promise<boolean> {
  const parts = hash.split("$");

  if (parts.length !== 4) return false;

  const [prefix, iterationsText, saltText, storedHashText] = parts;

  if (prefix !== PREFIX) return false;

  const iterations = Number(iterationsText);

  if (
    !Number.isInteger(iterations) ||
    iterations < 10000 ||
    iterations > 1000000
  ) {
    return false;
  }

  try {
    const salt = fromBase64(saltText);
    const storedHash = fromBase64(storedHashText);

    const passwordKey = await subtle.importKey(
      "raw",
      new TextEncoder().encode(plain),
      { name: ALGORITHM },
      false,
      ["deriveBits"]
    );

    const derivedBits = await subtle.deriveBits(
      {
        name: ALGORITHM,
        salt,
        iterations,
        hash: HASH_ALGORITHM,
      },
      passwordKey,
      storedHash.length * 8
    );

    const derivedHash = new Uint8Array(derivedBits);

    if (derivedHash.length !== storedHash.length) {
      return false;
    }

    let difference = 0;

    for (let i = 0; i < storedHash.length; i++) {
      difference |= derivedHash[i] ^ storedHash[i];
    }

    return difference === 0;
  } catch {
    return false;
  }
}

export async function verifyPassword(
  plain: string,
  hash: string
): Promise<boolean> {
  if (isLegacyPasswordHash(hash)) {
    return verifyLegacyPassword(plain, hash);
  }

  return verifyModernPassword(plain, hash);
}
