"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    address: process.env.ADDRESS || "0.0.0.0",
    port: Number(process.env.PORT) || 8000,
    tokenSecret: process.env.TOKEN_SECRET_KEY || "secret",
    emailerUser: process.env.USER || "secret",
    emailerPass: process.env.PASS || "secret"
};
