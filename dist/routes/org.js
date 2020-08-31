"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config/config");
const utils_1 = require("../utils/utils");
const router = express_1.default.Router();
// @route   GET api/organizations
// @desc    Get a list of organizations from Dynamics
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
        const URL = config_1.dynamicsURL + "/accounts?$select=name";
        const response = await axios_1.default.get(URL, config);
        if (response.data.value) {
            return res.json(response.data.value);
        }
        return res.status(404).json({
            errors: [{ msg: "Failed to get organizations" }],
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error.");
    }
});
exports.default = router;
