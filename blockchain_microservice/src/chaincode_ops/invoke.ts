import { FileSystemWallet, Gateway } from "fabric-network";

import getLogger from "./utils/logger";
const logger = getLogger("enrollAdmin");

import {
  getAdminID,
  getWalletPath,
  getDiscovery,
  getConnectionProfile,
  getChannelName,
  getChaincodeName,
} from "./utils/bc_connection_profile_helper";

const invoke = async (functionName: string, args: string[]) => {
  let gateway = new Gateway();
  try {
    const wallet = new FileSystemWallet(getWalletPath());

    const admin = getAdminID();

    const connectionOptions = {
      identity: admin,
      wallet,
      discovery: getDiscovery(),
    };

    await gateway.connect(getConnectionProfile(), connectionOptions);

    const channel = getChannelName();
    const network = await gateway.getNetwork(channel);

    const chaincodeID = getChaincodeName();
    const contract = network.getContract(chaincodeID);

    const invokeResponse = await contract.submitTransaction(
      functionName,
      ...args
    );

    const result =
      invokeResponse && invokeResponse.length
        ? JSON.parse(invokeResponse.toString())
        : {};

    return result;
  } catch (error) {
    logger.error(`Error processing transaction. ${error}`);
    logger.error(error.stack);
    throw new Error(`'invoke: Failed to invoke :: ${error}`);
  } finally {
    gateway.disconnect();
  }
};

export default invoke;
