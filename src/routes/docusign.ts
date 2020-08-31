import express from "express";
import {
  getAccessToken,
  signAgreementCeremony,
  signFinalCertificateCeremony,
} from "../utils/docusign";

const router = express.Router();

// @route   GET api/docusign/get_access_token
// @desc    Get access OAuth token used by other APIs
// @access  Private
router.get("/token", getAccessToken);

// @route   POST api/docusign/final_certificate
// @desc    Get docusign embedded signing URL for the final certificate
// @access  Private
router.post("/final_certificate", signFinalCertificateCeremony);

// @route   POST api/docusign/agreement
// @desc    Get docusign embedded signing URL for the license agreement
// @access  Private
router.post("/agreement", signAgreementCeremony);

export default router;
