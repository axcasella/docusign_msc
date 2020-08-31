/*
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Context,
  Contract,
  Info,
  Returns,
  Transaction,
} from "fabric-contract-api";
import { Certificate } from "./certificate";

@Info({ title: "CertificateContract", description: "My Smart Contract" })
export class CertificateContract extends Contract {
  @Transaction(false)
  @Returns("boolean")
  public async certificateExists(
    ctx: Context,
    certificateID: string
  ): Promise<boolean> {
    const buffer = await ctx.stub.getState(certificateID);
    return !!buffer && buffer.length > 0;
  }

  @Transaction()
  public async createCertificate(
    ctx: Context,
    certificateID: string,
    type: string,
    company: string,
    issuer: string,
    issuanceDate: string
  ): Promise<void> {
    const exists = await this.certificateExists(ctx, certificateID);
    if (exists) {
      throw new Error(`The certificate ${certificateID} already exists`);
    }
    const certificate = new Certificate();
    certificate.certificateID = certificateID;
    certificate.type = type;
    certificate.company = company;
    certificate.issuer = issuer;
    certificate.issuanceDate = issuanceDate;
    certificate.status = "Issued";
    const buffer = Buffer.from(JSON.stringify(certificate));
    await ctx.stub.putState(certificateID, buffer);
  }
}
