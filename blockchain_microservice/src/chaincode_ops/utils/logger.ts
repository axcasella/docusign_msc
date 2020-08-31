import log4js = require("log4js");

log4js.configure({
  appenders: {
    out: { type: "console" },
  },
  categories: {
    default: { appenders: ["out"], level: "debug" },
  },
});

const getLogger = (module: string) => {
  const logger = log4js.getLogger(module);
  logger.level = "debug";
  return logger;
};

export default getLogger;
