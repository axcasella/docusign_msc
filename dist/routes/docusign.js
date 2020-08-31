"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const docusign_1 = require("../utils/docusign");
const router = express_1.default.Router();
// @route   GET api/docusign/get_access_token
// @desc    Get access OAuth token used by other APIs
// @access  Private
router.get("/token", docusign_1.getAccessToken);
// @route   POST api/docusign/final_certificate
// @desc    Get docusign embedded signing URL for the final certificate
// @access  Private
router.post("/final_certificate", docusign_1.signFinalCertificateCeremony);
// @route   POST api/docusign/agreement
// @desc    Get docusign embedded signing URL for the license agreement
// @access  Private
router.post("/agreement", docusign_1.signAgreementCeremony);
exports.default = router;
