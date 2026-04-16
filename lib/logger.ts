import pino from 'pino';

const isDev = process.env.NODE_ENV !== 'production';

const logger = pino({
  level: process.env.LOG_LEVEL || (isDev ? 'debug' : 'info'),
  ...(isDev
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        },
      }
    : {}),
  redact: {
    paths: [
      'email',
      'password',
      'token',
      'apiKey',
      'api_key',
      'authorization',
      'cookie',
      'body.email',
      'body.password',
      'req.headers.authorization',
      'req.headers.cookie',
      'fileContent',
      'extractedData',
    ],
    censor: '[REDACTED]',
  },
  base: {
    env: process.env.NODE_ENV,
    service: 'hatsafe',
  },
});

export default logger;

export function getRequestLogger(requestId: string, userId?: string, orgId?: string) {
  return logger.child({
    requestId,
    ...(userId ? { userId } : {}),
    ...(orgId ? { orgId } : {}),
  });
}
