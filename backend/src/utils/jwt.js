"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.verifyToken = exports.generateToken = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var generateToken = function (user) {
    var payload = {
        userId: user.id,
        role: user.role,
    };
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });
};
exports.generateToken = generateToken;
var verifyToken = function (token) {
    try {
        return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    }
    catch (error) {
        throw new Error('Invalid token');
    }
};
exports.verifyToken = verifyToken;
var generateRefreshToken = function (user) {
    var payload = {
        userId: user.id,
        role: user.role,
    };
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '7d', // Refresh token lives longer
    });
};
exports.generateRefreshToken = generateRefreshToken;
