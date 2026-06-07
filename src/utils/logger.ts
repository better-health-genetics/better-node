import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      if (meta && meta.payload) {
        meta.payload = '[REDACTED_PHI]';
      }
      return JSON.stringify({ timestamp, level, message, ...meta });
    })
  ),
  transports: [
    new winston.transports.Console()
  ],
});
