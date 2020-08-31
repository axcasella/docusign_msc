"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config/config");
const connectToMongoDB = async () => {
    try {
        console.log(config_1.mongoDBUrl);
        await mongoose_1.default.connect(config_1.mongoDBUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });
        console.log("MongoDB connected");
    }
    catch (err) {
        console.log(`error: ${err.message}`);
        process.exit(1);
    }
};
exports.default = connectToMongoDB;
