"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const utils_1 = require("../utils/utils");
const user_1 = __importDefault(require("../models/user"));
const router = express_1.default.Router();
// @route   POST api/user
// @desc    Register user
// @access  Public
router.post("/", async (req, res) => {
    const { email, name, password, role } = req.body;
    try {
        let user = await user_1.default.findOne({ email });
        if (user) {
            return res.status(400).json({ errors: ["User exists already"] });
        }
        user = new user_1.default({
            email,
            name,
            password,
            role,
        });
        // Encrypt user password
        user.password = await utils_1.getPasswordHash(password);
        // Save to DB
        const registeredUser = await user.save();
        // Gen token
        const token = await utils_1.generateToken(registeredUser.name, registeredUser.id, registeredUser.email, registeredUser.role);
        res.json({ token });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error.");
    }
});
// @route   POST api/user
// @desc    Get users
// @access  Public
router.get("/", async (_, res) => {
    try {
        const users = await user_1.default.find().populate("user");
        res.json(users);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error.");
    }
});
exports.default = router;
