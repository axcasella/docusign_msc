import * as path from "path";
import connectionInfo from "./set_connection_info";

export const getCAUrl = () => {
  const keys = Object.keys(connectionInfo.profile.certificateAuthorities);
  return connectionInfo.profile.certificateAuthorities[keys[0]].url;
};

export const getCAName = () => {
  const keys = Object.keys(connectionInfo.profile.certificateAuthorities);
  return connectionInfo.profile.certificateAuthorities[keys[0]].caName;
};

export const getMSP = () => {
  const keys = Object.keys(connectionInfo.profile.organizations);
  return connectionInfo.profile.organizations[keys[0]].mspid;
};

export const getPeerUrl = () => {
  const keys = Object.keys(connectionInfo.profile.peers);
  return connectionInfo.profile.peers[keys[0]].url;
};

export const getConnectionProfile = () => {
  return connectionInfo.profile;
};

export const getChannelName = () => {
  return connectionInfo.config.local.channelName;
};

export const getAdminID = () => {
  return connectionInfo.config.local.admin;
};

export const getAdminSecret = () => {
  return connectionInfo.config.local.adminSecret;
};

export const getChaincodeName = () => {
  return connectionInfo.config.local.chaincodeName;
};

export const getWalletPath = () => {
  return path.join(__dirname, "../../../wallet");
};

export const getDiscovery = () => {
  return connectionInfo.config.local.gatewayDiscovery;
};
