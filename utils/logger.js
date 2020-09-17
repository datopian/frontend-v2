const winston = require('winston');
const config = require('../config/index')

const customFormat = winston.format.printf((info) => {
  const { timestamp, level, message } = info
  const args = info[Symbol.for('splat')]
  return `${timestamp} [${level}] ${message} ${args ? args : ''} `
});

const logger = winston.createLogger({
  level: config.get('LOG_LEVEL') || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    customFormat
  ),
  transports: [
    new winston.transports.Console()
  ]
});

module.exports = logger
