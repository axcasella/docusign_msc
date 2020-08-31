"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middleware/auth"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const utils_1 = require("../utils/utils");
const user_1 = __importDefault(require("../models/user"));
const router = express_1.default.Router();
// Authentication                                                [done]
// GET list of orgs                                              [done]
// POST certifcate                                               [done]
// GET all certificates                                          [done]
// POST evaluation (comments) only visible to FSC, CB, ASI       [done]
// POST feedback visible to CoC; can be called by CoC and CB     [done]
// GET all feedbacks visible to CoC for a certificate            [done]
// PUT certifcate status                                         [done]
// GET blockchain certificates
// GET docusign URL
// @route   GET api/auth
// @desc    Get logged in user with token
// @access  Private
router.get("/", auth_1.default, async (req, res) => {
    try {
        // Get user from Auth middleware
        if (req.user) {
            const user = await user_1.default.findById(req.user.id);
            return res.json(user);
        }
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error.");
    }
});
// @route   POST api/auth
// @desc    Login user with email and password and return JWT token
// @access  Public
router.post("/", async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await user_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({
                errors: [{ msg: "Invalid credentials." }],
            });
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                errors: [{ msg: "Invalid credentials." }],
            });
        }
        const token = await utils_1.generateToken(user.id, user.name, user.email, user.role);
        res.json({ token });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error.");
    }
});
exports.default = router;
