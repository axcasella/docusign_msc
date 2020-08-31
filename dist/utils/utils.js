"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = exports.getDynamicsAccessToken = exports.parseBearerToken = exports.getPasswordHash = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const axios_1 = __importDefault(require("axios"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const querystring_1 = __importDefault(require("querystring"));
const config_1 = require("../config/config");
exports.generateToken = async (id, name, email, role) => {
    try {
        const payload = {
            user: { id: id, email: email, name: name, role: role },
        };
        return await jsonwebtoken_1.default.sign(payload, config_1.jwtSecret, {
            expiresIn: "365d",
        });
    }
    catch (err) {
        console.error(err.message);
        throw Error(err);
    }
};
exports.getPasswordHash = async (password) => {
    try {
        const salt = await bcrypt_1.default.genSalt(10);
        return await bcrypt_1.default.hash(password, salt);
    }
    catch (err) {
        console.error(err.message);
        throw Error(err);
    }
};
exports.parseBearerToken = (token) => {
    const tokenStr = token.split(" ");
    return tokenStr[1];
};
// returns JWT token from Azure AD for Dynamics ops
exports.getDynamicsAccessToken = async () => {
    try {
        const body = {
            resource: config_1.resource,
            client_id: config_1.client_id,
            grant_type: "password",
            username: config_1.username,
            password: config_1.password,
            client_secret: config_1.client_secret,
        };
        const config = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        };
        const response = (await axios_1.default.post(config_1.azureADURL, querystring_1.default.stringify(body), config));
        if (response.data.access_token) {
            return response.data.access_token;
        }
        return "failed to get token";
    }
    catch (err) {
        console.error(err.message);
        return err.message;
    }
};
var Role;
(function (Role) {
    Role["CB"] = "CB";
    Role["Applicant"] = "Applicant";
    Role["FSC"] = "FSC";
    Role["ASI"] = "ASI";
})(Role = exports.Role || (exports.Role = {}));
