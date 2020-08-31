import express, { Request, Response } from "express";
const router = express.Router();

import invoke from "../../chaincode_ops/invoke";

// @route  POST api/blockchain/certificates/
// @desc   Add a new certificate to the Blockchain ledger, sets status to "Applicant"
// @access Private, only be done by FSC auditor
router.post("/", async (req: Request, res: Response) => {
  try {
    const { certificateID, type, company, issuer, issuanceDate } = req.body;
    const args = [certificateID, type, company, issuer, issuanceDate];

    const invokeResult = await invoke("createCertificate", args);
    const response = {
      invokeResult: invokeResult,
      certificateID: certificateID,
    };

    return res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

export default router;
