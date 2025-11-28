"use strict";
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
exports.deleteVideo = exports.updateVideo = exports.createVideo = exports.getAdminVideoById = exports.getAdminVideos = void 0;
var client_1 = require("@prisma/client");
var zod_1 = require("zod");
var prisma = new client_1.PrismaClient();
// Validation schemas
var videoSchema = zod_1.z.object({
    companyId: zod_1.z.string().min(1),
    youtubeId: zod_1.z.string().optional(),
    title: zod_1.z.string().min(1),
    roundType: zod_1.z.string().optional(),
    publishedAt: zod_1.z.string().optional(),
    thumbnail: zod_1.z.string().optional(),
    candidateId: zod_1.z.string().optional(), // Add candidateId field
});
// Get all videos (admin)
var getAdminVideos = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var videos, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.video.findMany({
                        include: {
                            company: true,
                            candidate: true, // Include candidate in response
                        },
                        orderBy: { createdAt: 'desc' },
                    })];
            case 1:
                videos = _a.sent();
                res.json({
                    data: videos,
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('Get admin videos error:', error_1);
                res.status(500).json({ message: 'Error retrieving videos' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAdminVideos = getAdminVideos;
// Get video by ID (admin)
var getAdminVideoById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, video, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, prisma.video.findUnique({
                        where: { id: id },
                        include: {
                            company: true,
                            candidate: true, // Include candidate in response
                        },
                    })];
            case 1:
                video = _a.sent();
                if (!video) {
                    return [2 /*return*/, res.status(404).json({ message: 'Video not found' })];
                }
                res.json({ data: video });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('Get admin video error:', error_2);
                res.status(500).json({ message: 'Error retrieving video' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAdminVideoById = getAdminVideoById;
// Create video (admin)
var createVideo = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var videoData, company, candidate, video, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                videoData = videoSchema.parse(req.body);
                return [4 /*yield*/, prisma.company.findUnique({
                        where: { id: videoData.companyId },
                    })];
            case 1:
                company = _a.sent();
                if (!company) {
                    return [2 /*return*/, res.status(400).json({ message: 'Company not found' })];
                }
                candidate = null;
                if (!videoData.candidateId) return [3 /*break*/, 3];
                return [4 /*yield*/, prisma.candidate.findUnique({
                        where: { id: videoData.candidateId },
                    })];
            case 2:
                candidate = _a.sent();
                if (!candidate) {
                    return [2 /*return*/, res.status(400).json({ message: 'Candidate not found' })];
                }
                _a.label = 3;
            case 3: return [4 /*yield*/, prisma.video.create({
                    data: {
                        companyId: videoData.companyId,
                        title: videoData.title,
                        youtubeId: videoData.youtubeId,
                        roundType: videoData.roundType,
                        publishedAt: videoData.publishedAt
                            ? new Date(videoData.publishedAt)
                            : null,
                        thumbnail: videoData.thumbnail,
                        candidateId: videoData.candidateId, // Add candidateId to video creation
                    },
                    include: {
                        company: true,
                        candidate: true, // Include candidate in response
                    },
                })];
            case 4:
                video = _a.sent();
                res.status(201).json({
                    message: 'Video created successfully',
                    data: video,
                });
                return [3 /*break*/, 6];
            case 5:
                error_3 = _a.sent();
                if (error_3 instanceof zod_1.z.ZodError) {
                    return [2 /*return*/, res.status(400).json({
                            message: 'Invalid input',
                            errors: error_3.errors,
                        })];
                }
                console.error('Create video error:', error_3);
                res.status(500).json({ message: 'Error creating video' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.createVideo = createVideo;
// Update video (admin)
var updateVideo = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, videoData, existingVideo, company, candidate, video, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                id = req.params.id;
                videoData = videoSchema.parse(req.body);
                return [4 /*yield*/, prisma.video.findUnique({
                        where: { id: id },
                    })];
            case 1:
                existingVideo = _a.sent();
                if (!existingVideo) {
                    return [2 /*return*/, res.status(404).json({ message: 'Video not found' })];
                }
                company = null;
                if (!videoData.companyId) return [3 /*break*/, 3];
                return [4 /*yield*/, prisma.company.findUnique({
                        where: { id: videoData.companyId },
                    })];
            case 2:
                company = _a.sent();
                if (!company) {
                    return [2 /*return*/, res.status(400).json({ message: 'Company not found' })];
                }
                _a.label = 3;
            case 3:
                candidate = null;
                if (!videoData.candidateId) return [3 /*break*/, 5];
                return [4 /*yield*/, prisma.candidate.findUnique({
                        where: { id: videoData.candidateId },
                    })];
            case 4:
                candidate = _a.sent();
                if (!candidate) {
                    return [2 /*return*/, res.status(400).json({ message: 'Candidate not found' })];
                }
                _a.label = 5;
            case 5: return [4 /*yield*/, prisma.video.update({
                    where: { id: id },
                    data: {
                        companyId: videoData.companyId,
                        title: videoData.title,
                        youtubeId: videoData.youtubeId,
                        roundType: videoData.roundType,
                        publishedAt: videoData.publishedAt
                            ? new Date(videoData.publishedAt)
                            : existingVideo.publishedAt,
                        thumbnail: videoData.thumbnail,
                        candidateId: videoData.candidateId, // Add candidateId to video update
                    },
                    include: {
                        company: true,
                        candidate: true, // Include candidate in response
                    },
                })];
            case 6:
                video = _a.sent();
                res.json({
                    message: 'Video updated successfully',
                    data: video,
                });
                return [3 /*break*/, 8];
            case 7:
                error_4 = _a.sent();
                if (error_4 instanceof zod_1.z.ZodError) {
                    return [2 /*return*/, res.status(400).json({
                            message: 'Invalid input',
                            errors: error_4.errors,
                        })];
                }
                console.error('Update video error:', error_4);
                res.status(500).json({ message: 'Error updating video' });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.updateVideo = updateVideo;
// Delete video (admin)
var deleteVideo = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, existingVideo, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = req.params.id;
                return [4 /*yield*/, prisma.video.findUnique({
                        where: { id: id },
                    })];
            case 1:
                existingVideo = _a.sent();
                if (!existingVideo) {
                    return [2 /*return*/, res.status(404).json({ message: 'Video not found' })];
                }
                // Delete the video
                return [4 /*yield*/, prisma.video.delete({
                        where: { id: id },
                    })];
            case 2:
                // Delete the video
                _a.sent();
                res.json({ message: 'Video deleted successfully' });
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                console.error('Delete video error:', error_5);
                res.status(500).json({ message: 'Error deleting video' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteVideo = deleteVideo;
