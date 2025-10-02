import pino from 'pino';

// Simple pino logger configured for pretty dev output
export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  transport:
    process.env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: { colorize: true }
        }
      : undefined
});
