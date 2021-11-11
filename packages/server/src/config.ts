import path from 'path';
import { ConfigModule as _ConfigModule, ConfigService as _ConfigService } from '@nestjs/config';

export const envFilePath = [
  `.env.${process.env.NODE_ENV || 'development'}.local`,
  `.env.${process.env.NODE_ENV || 'development'}`,
  '.env.local',
  '.env'
].map(pathname => {
  const root = process.env.NODE_ENV === 'production' ? process.cwd() : '';
  return path.resolve(root, pathname);
});

export interface Config {
  NODE_ENV: string;
  JWT_SECRET: string;
  JWT_TOKEN_EXPIRES_IN_MINUTES: number;
  REFRESH_TOKEN_EXPIRES_IN_MINUTES: number;
  MONGODB_URI: string;
}

// eslint-disable-next-line
export interface ConfigService extends _ConfigService<Config> {}

export const ConfigService = _ConfigService;

export const ConfigModule = _ConfigModule.forRoot({
  isGlobal: true,
  envFilePath,
  expandVariables: true
});
