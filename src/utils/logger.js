import winston from 'winston';
const { combine, timestamp, printf, colorize } = winston.format;
const logFormat = printf((info) => {
    const { level, message, timestamp: ts, ...metadata } = info;
    let msg = `${ts || new Date().toISOString()} [${level}]: ${message}`;
    // Remove internal winston properties from metadata
    const cleanMetadata = Object.fromEntries(Object.entries(metadata).filter(([key]) => !key.startsWith('_')));
    if (Object.keys(cleanMetadata).length > 0) {
        msg += ` ${JSON.stringify(cleanMetadata)}`;
    }
    return msg;
});
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: combine(timestamp(), logFormat),
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: combine(colorize(), timestamp(), logFormat)
    }));
}
export default logger;
//# sourceMappingURL=logger.js.map