// Validate required environment variables
const requiredEnvVars = [
  'VITE_APP_ID',
  'JWT_SECRET',
  'DATABASE_URL',
  'OAUTH_SERVER_URL',
  'BUILT_IN_FORGE_API_URL',
  'BUILT_IN_FORGE_API_KEY',
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0 && process.env.NODE_ENV === 'production') {
  console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  console.error('Please set these variables in your deployment environment.');
  console.error('See .env.example for reference.');
}

export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "https://api.manus.im",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "https://api.manus.im",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  oAuthPortalUrl: process.env.VITE_OAUTH_PORTAL_URL ?? "https://api.manus.im",
};

// Log environment status in development
if (!ENV.isProduction) {
  console.log('[ENV] Configuration loaded:', {
    appId: ENV.appId ? '✓' : '✗',
    cookieSecret: ENV.cookieSecret ? '✓' : '✗',
    databaseUrl: ENV.databaseUrl ? '✓' : '✗',
    oAuthServerUrl: ENV.oAuthServerUrl ? '✓' : '✗',
  });
}
