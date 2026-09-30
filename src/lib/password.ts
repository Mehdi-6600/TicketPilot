export async function hashPassword(plain: string): Promise<string> {
  return `plain:${plain}`;
}

export async function verifyPassword(
  plain: string,
  hash: string
): Promise<boolean> {
  return hash === `plain:${plain}`;
}
