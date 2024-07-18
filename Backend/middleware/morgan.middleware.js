// morganConfig.js

const morgan = require('morgan');
const {logger} = require('../utils/loggers'); 

const morganFormat = ":method :url :status :response-time ms";

const morganStream = {
  write: (message) => {
    const logObject = {
      method: message.split(" ")[0],
      url: message.split(" ")[1],
      status: message.split(" ")[2],
      responseTime: message.split(" ")[3],
    };
    logger.info(JSON.stringify(logObject));
  },
};

const morganMiddleware = morgan(morganFormat, { stream: morganStream });

module.exports = morganMiddleware;
