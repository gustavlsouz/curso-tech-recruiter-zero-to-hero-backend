const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "zero-to-hero-backend" },
  transports: [
    new winston.transports.File({
      filename: `./logs/error-${Date.now()}.log`,
      level: "error",
    }),
    new winston.transports.File({ filename: `./logs/logs-${Date.now()}.log` }),
  ],
});

module.exports = logger;
