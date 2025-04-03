export const AUTH_JS_ACCOUNT_COLLECTION = 'accounts';
export const AUTH_JS_SESSION_COLLECTION = 'sessions';
export const AUTH_JS_USER_COLLECTION = 'readers';
export const AuthInstanceInjectKey = Symbol('AuthInstance');

export enum OAuthProviderType {
  GITHUB = 'github',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
  MICROSOFT = 'microsoft',
  DISCORD = 'discord',
  APPLE = 'apple',
  LINKEDIN = 'linkedin',
  GITLAB = 'gitlab',
  SPOTIFY = 'spotify',
  TWITCH = 'twitch',
  REDDIT = 'reddit',
  DROPBOX = 'dropbox',
  TIKTOK = 'tiktok',
  KICK = 'kick',
  ROBLOX = 'roblox',
  VK = 'vk',
}

// Auth middleware configuration
export const AUTH_BYPASS_PATHS = ['/token', '/session', '/providers'];
export const AUTH_ALLOWED_METHODS = ['GET', 'POST'];
