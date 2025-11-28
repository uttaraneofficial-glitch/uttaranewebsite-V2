"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
var multer_1 = require("multer");
var multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
var cloudinary_1 = require("../config/cloudinary");
var storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default,
    params: {
        folder: 'uttarane/hero',
        allowed_formats: ['jpg', 'png', 'webp', 'jpeg'],
    }, // Cast to any to avoid type issues with params
});
exports.upload = (0, multer_1.default)({ storage: storage });
