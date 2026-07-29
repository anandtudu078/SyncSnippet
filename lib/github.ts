import { App } from '@octokit/app';
import { createPrivateKey } from 'crypto';

let appInstance: App | null = null;

function convertToPKCS8(key: string): string {
  try {
    // Try to create a private key object – this will fail if it's already PKCS#8
    // but we can export it to PKCS#8 regardless
    const privateKey = createPrivateKey(key);
    return privateKey.export({ type: 'pkcs8', format: 'pem' }).toString();
  } catch {
    // If it fails, the key might be malformed – return as‑is and let the error surface later
    return key;
  }
}

export function getGitHubApp(): App {
  if (!appInstance) {
    let privateKey = process.env.GITHUB_PRIVATE_KEY?.replace(/\\n/g, '\n');
    if (!privateKey) throw new Error('GITHUB_PRIVATE_KEY is not set');

    // Remove outer quotes if accidentally added from .env.local
    privateKey = privateKey.replace(/^"(.*)"$/, '$1');

    // Convert to PKCS#8 format to avoid OpenSSL 3 errors
    privateKey = convertToPKCS8(privateKey);

    appInstance = new App({
      appId: process.env.GITHUB_APP_ID!,
      privateKey,
    });
  }
  return appInstance;
}