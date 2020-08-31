import { FileSystemWallet, X509WalletMixin } from "fabric-network";
import FabricCAServices from "fabric-ca-client";

import getLogger from "./utils/logger";
const logger = getLogger("enrollAdmin");

import {
  getAdminID,
  getCAUrl,
  getWalletPath,
  getAdminSecret,
  getMSP,
} from "./utils/bc_connection_profile_helper";

const enrollAdmin = async () => {
  let adminUser: string = "";
  try {
    const ca = new FabricCAServices(getCAUrl());
    const wallet = new FileSystemWallet(getWalletPath());

    adminUser = getAdminID();
    const adminExists = await wallet.exists(adminUser);
    if (adminExists) {
      logger.warn(
        `An identity for the admin user ${adminUser} already exists in the wallet`
      );
      return;
    }

    const enrollment = await ca.enroll({
      enrollmentID: adminUser,
      enrollmentSecret: getAdminSecret(),
    });

    const identity = X509WalletMixin.createIdentity(
      getMSP(),
      enrollment.certificate,
      enrollment.key.toBytes()
    );

    wallet.import(adminUser, identity);
    logger.info(
      `Successfully enrolled admin user ${adminUser} and imported its identity into the wallet`
    );
  } catch (err) {
    logger.error(`Failed to enroll admin user ${adminUser}: ${err}`);
  }
};

export default enrollAdmin;
