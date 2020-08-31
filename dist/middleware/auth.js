"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const utils_1 = require("../utils/utils");
const auth = (req, res, next) => {
    const bearerToken = req.header("authorization");
    if (!bearerToken) {
        return res
            .status(401)
            .json({ msg: "No bearer token found, authorization denied." });
    }
    try {
        const token = utils_1.parseBearerToken(bearerToken);
        const decodedToken = jsonwebtoken_1.default.verify(token, config_1.jwtSecret);
        req.user = decodedToken.user;
        next();
    }
    catch (err) {
        res.status(401).json({ msg: "Invalid JWT token" });
    }
};
exports.default = auth;
