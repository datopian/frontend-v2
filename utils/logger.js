const winston = require('winston')
const config = require('../config/index')

const customFormat = winston.format.printf((info) => {
  const { level, message, stack, ...meta } = info
  return `${meta.timestamp} [${level}] ${message}${stack ? '\n' + stack : ''}`
})

const logger = winston.createLogger({
  level: config.get('LOG_LEVEL') || 'info',
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.timestamp(),
    winston.format.colorize(),
    customFormat
  ),
  transports: [
    new winston.transports.Console()
  ],
  exceptionHandlers: [
    new winston.transports.Console()
  ],
  rejectionHandlers: [
    new winston.transports.Console()
  ]
})

module.exports = logger
