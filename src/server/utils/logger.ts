import winston from 'winston';
import { join } from 'path';

const logsDir = process.env.LOGS_DIR || join(__dirname, '../../../logs');

const { combine, timestamp, printf, colorize } = winston.format;

interface LogInfo extends winston.Logform.TransformableInfo {
  timestamp?: string;
}

const logFormat = printf((info: LogInfo) => {
  const { level, message, timestamp: ts, ...metadata } = info;
  let msg = `${ts || new Date().toISOString()} [${level}]: ${message}`;
  
  // Remove internal winston properties from metadata
  const cleanMetadata = Object.fromEntries(
    Object.entries(metadata).filter(([key]) => !key.startsWith('_'))
  );

  if (Object.keys(cleanMetadata).length > 0) {
    msg += ` ${JSON.stringify(cleanMetadata)}`;
  }
  return msg;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp(),
    logFormat
  ),
  transports: [
    new winston.transports.File({ filename: join(logsDir, 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: join(logsDir, 'combined.log') })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: combine(
      colorize(),
      timestamp(),
      logFormat
    )
  }));
}

export default logger; 