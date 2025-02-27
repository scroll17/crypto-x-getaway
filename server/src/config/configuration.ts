import * as dotenv from 'dotenv';
import ms from 'ms';

export const configuration = () => {
  const server = {
    host: process.env.HOST,
  };

  const ports = {
    http: Number.parseInt(process.env.HTTP_PORT!, 10),
  };

  const bll = {
    resetPasswordLinkLive: ms(process.env.RESET_PASSWORD_LINK_LIVE!),
  };

  const security = {
    corsWhiteList: JSON.parse(process.env.CORS_WHITE_LIST!),
    cookiesOverHttps: Boolean(Number.parseInt(process.env.COOKIES_OVER_HTTPS!, 10)),
    cookiesSameSite: process.env.COOKIES_SAME_SITE,
    loginConfirmationExpires: ms(process.env.LOGIN_CONFIRMATION_EXPIRES!),
    accessTokenAutoConfirmed: Boolean(Number.parseInt(process.env.ACCESS_TOKEN_AUTO_CONFIRMED!, 10)),
  };

  const logs = {
    origin: Boolean(Number.parseInt(process.env.LOGS_ORIGIN_ENABLED!, 10)),
  };

  const postgres = {
    host: process.env.POSTGRES_HOST,
    port: Number.parseInt(process.env.POSTGRES_PORT!, 10),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    name: process.env.POSTGRES_DB_NAME,
    url: '', // mongodb://username:password@host:port/database
  };
  postgres.url = `postgresql://${postgres.username}:${postgres.password}@${postgres.host}:${postgres.port}/${postgres.name}`;

  const database = {
    syncEntities: Boolean(Number(process.env.DATABASE_SYNC_ENTITIES!)),
    autoLoadEntities: Boolean(Number(process.env.DATABASE_AUTO_LOAD_ENTITIES!)),
  };

  const ngrok = {
    token: process.env.NGROK_TOKEN,
    fileName: process.env.NGROK_FILE_NAME,
  };

  const telegram = {
    webhook: process.env.TELEGRAM_WEBHOOK,
    token: process.env.TELEGRAM_TOKEN,
    botName: process.env.TELEGRAM_BOT_NAME,
    botEnabled: Boolean(Number.parseInt(process.env.TELEGRAM_BOT_ENABLED!, 10)),
  };

  const google = {
    googleAppId: process.env.GOOGLE_APP_ID,
    googleAppSecret: process.env.GOOGLE_APP_SECRET,
  };

  const facebook = {
    facebookAppId: process.env.FACEBOOK_APP_ID,
    facebookAppSecret: process.env.FACEBOOK_APP_SECRET,
  };

  const redis = {
    host: process.env.REDIS_HOST,
    port: Number.parseInt(process.env.REDIS_PORT!, 10),
  };

  const jwt = {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpires: process.env.JWT_ACCESS_EXPIRES,
    refreshExpires: process.env.JWT_REFRESH_EXPIRES,
  };

  const action = {
    userSecurityTokenSecret: process.env.ACTION_USER_SECURITY_TOKEN_SECRET,
    userSecurityTokenExpires: process.env.ACTION_USER_SECURITY_TOKEN_EXPIRES,
    userSecurityTokenHeader: process.env.ACTION_USER_SECURITY_TOKEN_HEADER,
    signatureSecret: process.env.ACTION_SIGNATURE_SECRET,
    signatureHeader: process.env.ACTION_SIGNATURE_HEADER,
    serverDefaultUrl: process.env.ACTION_SERVER_DEFAULT_URL,
  };

  const seed = {
    bootstrapCommands: JSON.parse(process.env.BOOTSTRAP_COMMANDS!),
  };

  return {
    env: process.env.NODE_ENV,
    isDev: ['dev', 'development'].includes(process.env.NODE_ENV!),
    isProd: ['prod', 'production'].includes(process.env.NODE_ENV!),
    server,
    ports,
    bll,
    security,
    logs,
    ngrok,
    google,
    telegram,
    facebook,
    postgres,
    database,
    redis,
    jwt,
    action,
    seed,
  };
};

export const init = () => {
  dotenv.config();
};
