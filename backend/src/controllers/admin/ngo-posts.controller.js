"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNgoPost = exports.updateNgoPost = exports.createNgoPost = exports.getAdminNgoPostById = exports.getAdminNgoPosts = void 0;
var client_1 = require("@prisma/client");
var cloudinary = require("../../config/cloudinary");
var zod_1 = require("zod");
var prisma = new client_1.PrismaClient();
// Validation schemas
var ngoPostSchema = zod_1.z.object({
    imageUrl: zod_1.z.string().url(),
    caption: zod_1.z.string().optional(),
});
// Get all NGO posts (admin)
var getAdminNgoPosts = function (req, res) {
    return __awaiter(void 0, void 0, void 0, function () {
        var posts, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, prisma.ngoPost.findMany({
                        orderBy: { postedAt: 'desc' },
                    })];
                case 1:
                    posts = _a.sent();
                    res.json({
                        data: posts,
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Get admin NGO posts error:', error_1);
                    res.status(500).json({ message: 'Error retrieving NGO posts' });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
};
exports.getAdminNgoPosts = getAdminNgoPosts;
// Get NGO post by ID (admin)
var getAdminNgoPostById = function (req, res) {
    return __awaiter(void 0, void 0, void 0, function () {
        var id, post, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    id = req.params.id;
                    return [4 /*yield*/, prisma.ngoPost.findUnique({
                        where: { id: id },
                    })];
                case 1:
                    post = _a.sent();
                    if (!post) {
                        return [2 /*return*/, res.status(404).json({ message: 'NGO post not found' })];
                    }
                    res.json({ data: post });
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error('Get admin NGO post error:', error_2);
                    res.status(500).json({ message: 'Error retrieving NGO post' });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
};
exports.getAdminNgoPostById = getAdminNgoPostById;
// Create NGO post (admin)
var createNgoPost = function (req, res) {
    return __awaiter(void 0, void 0, void 0, function () {
        var imageUrl, postData, post, error_3;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    _b.trys.push([0, 2, , 3]);
                    imageUrl = req.body.imageUrl;
                    if (req.file) {
                        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                            folder: "uttarane/ngo-posts",
                        });
                        imageUrl = uploadResult.secure_url;
                    }
                    postData = ngoPostSchema.parse(__assign(__assign({}, req.body), { imageUrl: imageUrl }));
                    return [4 /*yield*/, prisma.ngoPost.create({
                        data: {
                            imageUrl: postData.imageUrl,
                            caption: postData.caption,
                            postedAt: new Date(),
                        },
                    })];
                case 1:
                    post = _b.sent();
                    res.status(201).json({
                        message: 'NGO post created successfully',
                        data: post,
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _b.sent();
                    if (error_3 instanceof zod_1.z.ZodError) {
                        return [2 /*return*/, res.status(400).json({
                            message: 'Invalid input',
                            errors: error_3.errors,
                        })];
                    }
                    console.error('Create NGO post error:', error_3);
                    res.status(500).json({ message: 'Error creating NGO post' });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
};
exports.createNgoPost = createNgoPost;
// Update NGO post (admin)
var updateNgoPost = function (req, res) {
    return __awaiter(void 0, void 0, void 0, function () {
        var id, imageUrl, postData, existingPost, post, error_4;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    id = req.params.id;
                    _b.trys.push([0, 3, , 4]);
                    id = req.params.id;
                    imageUrl = req.body.imageUrl;
                    if (req.file) {
                        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                            folder: "uttarane/ngo-posts",
                        });
                        imageUrl = uploadResult.secure_url;
                    }
                    postData = ngoPostSchema.parse(__assign(__assign({}, req.body), { imageUrl: imageUrl }));
                    return [4 /*yield*/, prisma.ngoPost.findUnique({
                        where: { id: id },
                    })];
                case 1:
                    existingPost = _b.sent();
                    if (!existingPost) {
                        return [2 /*return*/, res.status(404).json({ message: 'NGO post not found' })];
                    }
                    return [4 /*yield*/, prisma.ngoPost.update({
                        where: { id: id },
                        data: {
                            imageUrl: postData.imageUrl,
                            caption: postData.caption,
                        },
                    })];
                case 2:
                    post = _b.sent();
                    res.json({
                        message: 'NGO post updated successfully',
                        data: post,
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _b.sent();
                    if (error_4 instanceof zod_1.z.ZodError) {
                        return [2 /*return*/, res.status(400).json({
                            message: 'Invalid input',
                            errors: error_4.errors,
                        })];
                    }
                    console.error('Update NGO post error:', error_4);
                    res.status(500).json({ message: 'Error updating NGO post' });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
};
exports.updateNgoPost = updateNgoPost;
// Delete NGO post (admin)
var deleteNgoPost = function (req, res) {
    return __awaiter(void 0, void 0, void 0, function () {
        var id, existingPost, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    id = req.params.id;
                    return [4 /*yield*/, prisma.ngoPost.findUnique({
                        where: { id: id },
                    })];
                case 1:
                    existingPost = _a.sent();
                    if (!existingPost) {
                        return [2 /*return*/, res.status(404).json({ message: 'NGO post not found' })];
                    }
                    // Delete the post
                    return [4 /*yield*/, prisma.ngoPost.delete({
                        where: { id: id },
                    })];
                case 2:
                    // Delete the post
                    _a.sent();
                    res.json({ message: 'NGO post deleted successfully' });
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    console.error('Delete NGO post error:', error_5);
                    res.status(500).json({ message: 'Error deleting NGO post' });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
};
exports.deleteNgoPost = deleteNgoPost;
