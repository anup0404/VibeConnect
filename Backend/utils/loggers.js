const { createLogger, format, transports } = require('winston');
const { client } = require('../Db/db'); // Adjust path as per your project structure
const { Pool } = require('pg');
const { combine, timestamp, json, printf } = format;
const { PostgresTransport } = require('winston-postgres'); // Import PostgresTransport

// Define console log format
const consoleLogFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    json({ space: 2 })
  ),
  transports: [
    // Console transport for development
    new transports.Console({
      format: combine(
        format.colorize(),
        consoleLogFormat
      ),
    }),
    // File transport for error logs
    new transports.File({
      filename: './logs/app.err',
      level: 'error',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        json({ space: 2 })
      ),
    }),
    // File transport for all logs
    new transports.File({
      filename: './logs/app.log',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        json({ space: 2 })
      ),
    }),
    // PostgreSQL transport for error logs
    new PostgresTransport({
      pool: new Pool({ client }), // Use the PostgreSQL client pool
      tableName: 'error_logs', // Name of the table in PostgreSQL
      schema: {
        id: { type: 'serial', primaryKey: true },
        timestamp: { type: 'timestamptz', default: { $currentTimestamp: true } },
        level: { type: 'varchar' },
        message: { type: 'text' },
        meta: { type: 'jsonb' },
      },
    }),
  ],
});

module.exports = { logger };
