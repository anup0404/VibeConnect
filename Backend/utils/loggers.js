const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf, colorize } = format;


const customFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});


const logger = createLogger({
  level: 'info', 
  format: combine(
    label({ label: 'user-service' }),
    timestamp(),
    customFormat
  ),

  defaultMeta: { service: 'user-service' },

  transports: [

    new transports.Console({
      format: combine(
        colorize(), 
        customFormat
      )
    }),

 
    new transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new transports.File({ 
        filename: 'logs/combined.log' 
      })
  ]

});
module.exports={logger}

