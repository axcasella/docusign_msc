import fs = require("fs");
import path = require("path");

const parseConnectionProfile = () => {
  const filePath = path.join(__dirname, "../config/connection_profile.json");
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
};

const parseCustomConfig = () => {
  const filePath = path.join(__dirname, "../config/bc_config.json");
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
};

const connectionInfo = {
  profile: parseConnectionProfile(),
  config: parseCustomConfig(),
};

export default connectionInfo;
