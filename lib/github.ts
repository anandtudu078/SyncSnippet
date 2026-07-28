import { App } from 'octokit';

let appInstance: App | null = null;

export function getGitHubApp(): App {
  if (!appInstance) {
    const privateKey = process.env.GITHUB_PRIVATE_KEY?.replace(/\\n/g, '\n');
    if (!privateKey) throw new Error('GITHUB_PRIVATE_KEY is not set');

    appInstance = new App({
      appId: process.env.GITHUB_APP_ID!,
      privateKey,
    });
  }
  return appInstance;
}