"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config/config");
const utils_1 = require("../utils/utils");
const auth_1 = __importDefault(require("../middleware/auth"));
const comment_1 = __importDefault(require("../models/comment"));
const config_2 = require("../config/config");
const router = express_1.default.Router();
// @route   GET api/certificate
// @desc    Get a list of certificates from Dynamics
// @access  Public
router.get("/", async (_, res) => {
    try {
        const token = await utils_1.getDynamicsAccessToken();
        if (!token) {
            return res.status(400).json({
                errors: [{ msg: "Failed to get access token from MS Dynamics" }],
            });
        }
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        const URL = config_1.dynamicsURL + "/fsc_fsccertificates";
        const response = await axios_1.default.get(URL, config);
        if (response.data.value) {
            return res.json(response.data.value);
        }
        return res.status(404).json({
            errors: [{ msg: "Failed to get certificates" }],
        });
    }
    catch (err) {
        res.status(500).send("Server error.");
    }
});
// @route   POST api/certificate
// @desc    Add a new certificates to Dynamics
// @access  Public
router.post("/", auth_1.default, async (req, res) => {
    try {
        if (req.user && req.user.role !== utils_1.Role.CB) {
            return res.status(401).json({
                errors: [{ msg: "Only CB auditors can add a new certificate" }],
            });
        }
        const token = await utils_1.getDynamicsAccessToken();
        if (!token) {
            return res.status(400).json({
                errors: [{ msg: "Failed to get access token from MS Dynamics" }],
            });
        }
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        const body = {
            fsc_cwsourcecountries: "30,83",
            fsc_numberofsitesgroupmembers: req.body.number_of_group_members,
            fsc_certificatetype: 2,
            "fsc_CHOrganization@odata.bind": `/accounts(${req.body.ch_account_id})`,
            fsc_certificatenumber: req.body.cert_number,
            "fsc_CBOrganizationId@odata.bind": `/accounts(${req.body.cb_account_id})`,
            fsc_name: req.body.cert_name,
            fsc_controlledwoodcode: "W123",
        };
        const URL = config_1.dynamicsURL + "/fsc_fsccertificates";
        const response = await axios_1.default.post(URL, body, config);
        if (response.data.error) {
            return res.status(404).json({
                errors: [{ msg: response.data.error }],
            });
        }
        // Add to blockchain ledger
        if (config_2.enable_blockchain) {
            const bcURL = config_2.blockchain_server_url + "/api/blockchain/certificates";
            let bcReqBody = {
                certificateID: req.body.cert_number,
                type: "Multisite certificate",
                company: req.body.ch_account_id,
                issuer: req.body.cb_account_id,
            };
            const response = await axios_1.default.post(bcURL, bcReqBody);
            if (response.data.error) {
                return res.status(404).json({
                    errors: [{ msg: response.data.error }],
                });
            }
        }
        return res.status(200).json({ msg: "Add certification success" });
    }
    catch (err) {
        res.status(500).send(err);
    }
});
// @route   POST api/certificate/:certificate_id/issue
// @desc    Update an existing certificate's status to "issued" in Dynamics
// @access  Private
router.post("/:certificate_id/issue", auth_1.default, async (req, res) => {
    try {
        if (req.user && req.user.role !== utils_1.Role.CB) {
            return res.status(401).json({
                errors: [
                    {
                        msg: "Only CB auditors can update a certificate's status to issued",
                    },
                ],
            });
        }
        const token = await utils_1.getDynamicsAccessToken();
        if (!token) {
            return res.status(400).json({
                errors: [{ msg: "Failed to get access token from MS Dynamics" }],
            });
        }
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        let body = {
            fsc_certificatestatus: 2,
        };
        const URL = config_1.dynamicsURL + "/fsc_fsccertificates(" + req.params.certificate_id + ")";
        const response = await axios_1.default.patch(URL, body, config);
        if (response.data.error) {
            return res.status(404).json({
                errors: [{ msg: response.data.error }],
            });
        }
        // Update certificate status in blockchain ledger
        if (config_2.enable_blockchain) {
            const bcURL = config_2.blockchain_server_url +
                "/api/blockchain/certificates/" +
                req.body.fsc_certificatenumber +
                "/issue";
            const response = await axios_1.default.post(bcURL);
            if (response.data.error) {
                return res.status(404).json({
                    errors: [{ msg: response.data.error }],
                });
            }
        }
        return res
            .status(200)
            .json({ msg: "Update certification status to issued success" });
    }
    catch (err) {
        res.status(500).send(err);
    }
});
// @route   POST api/certificate/:certificate_id/add_comment
// @desc    Add a comment to a certificate
// @access  Private; only used by auditor and CoC company
router.post("/:certificate_id/add_comment", auth_1.default, async (req, res) => {
    const { comment } = req.body;
    if (!comment) {
        return res.status(400).json({
            errors: [{ msg: "Comment is empty" }],
        });
    }
    if (!req.user ||
        (req.user.role !== utils_1.Role.CB && req.user.role !== utils_1.Role.Applicant)) {
        return res.status(401).json({
            errors: [{ msg: "Only CB or CoC applicant can add a comment" }],
        });
    }
    try {
        let newComment = new comment_1.default({
            comment,
            author: req.user.name,
            certificate: req.params.certificate_id,
        });
        // Save to DB
        const addedComment = await newComment.save();
        res.json({ msg: "Comment added successfully", comment: addedComment });
    }
    catch (err) {
        res.status(500).send("Server error.");
    }
});
// @route   POST api/certificate/:certificate_id/comments
// @desc    Get all comments of a certificate
// @access  Private; only used by auditor and CoC company
router.get("/:certificate_id/comments", auth_1.default, async (req, res) => {
    try {
        const comments = await comment_1.default
            .find({ certificate: req.params.certificate_id })
            .populate("comments");
        res.json(comments);
    }
    catch (err) {
        res.status(500).send("Server error.");
    }
});
exports.default = router;
