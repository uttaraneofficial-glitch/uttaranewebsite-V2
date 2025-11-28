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
exports.getPublicCandidates = exports.getCompanyVideosBySlug = exports.getPublicCompanyBySlug = exports.getPublicCompanies = void 0;
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
// Get all public companies (alphabetical order)
var getPublicCompanies = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var companies, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.company.findMany({
                        include: {
                            candidates: true, // Include candidates in response
                        },
                        orderBy: { name: 'asc' },
                    })];
            case 1:
                companies = _a.sent();
                res.json({
                    data: companies,
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('Get public companies error:', error_1);
                res.status(500).json({ message: 'Error retrieving companies' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getPublicCompanies = getPublicCompanies;
// Get public company by slug (case-insensitive)
var getPublicCompanyBySlug = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var slug, company, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                slug = req.params.slug;
                return [4 /*yield*/, prisma.company.findFirst({
                        where: {
                            slug: {
                                mode: 'insensitive',
                                equals: slug,
                            },
                        },
                        include: {
                            candidates: true, // Include candidates in response
                        },
                    })];
            case 1:
                company = _a.sent();
                if (!company) {
                    return [2 /*return*/, res.status(404).json({ message: 'Company not found' })];
                }
                res.json({ data: company });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('Get public company error:', error_2);
                res.status(500).json({ message: 'Error retrieving company' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getPublicCompanyBySlug = getPublicCompanyBySlug;
// Get videos for a company by slug (case-insensitive)
var getCompanyVideosBySlug = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var slug, roundType, company, where, videos, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                slug = req.params.slug;
                roundType = req.query.roundType;
                return [4 /*yield*/, prisma.company.findFirst({
                        where: {
                            slug: {
                                mode: 'insensitive',
                                equals: slug,
                            },
                        },
                    })];
            case 1:
                company = _a.sent();
                if (!company) {
                    return [2 /*return*/, res.status(404).json({ message: 'Company not found' })];
                }
                where = {
                    companyId: company.id,
                    publishedAt: {
                        not: null,
                    },
                };
                // Add roundType filter if provided
                if (roundType && typeof roundType === 'string') {
                    where.roundType = roundType;
                }
                return [4 /*yield*/, prisma.video.findMany({
                        where: where,
                        include: {
                            candidate: true,
                        },
                        orderBy: {
                            publishedAt: 'desc',
                        },
                    })];
            case 2:
                videos = _a.sent();
                res.json({
                    data: videos,
                });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.error('Get company videos error:', error_3);
                res.status(500).json({ message: 'Error retrieving videos' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getCompanyVideosBySlug = getCompanyVideosBySlug;
// Get all candidates with company info
var getPublicCandidates = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var candidates, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.candidate.findMany({
                        include: {
                            company: {
                                select: {
                                    name: true,
                                    logoUrl: true,
                                    thumbnail: true,
                                    slug: true,
                                },
                            },
                        },
                        orderBy: {
                            createdAt: 'desc',
                        },
                    })];
            case 1:
                candidates = _a.sent();
                res.json({
                    data: candidates,
                });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error('Get public candidates error:', error_4);
                res.status(500).json({ message: 'Error retrieving candidates' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getPublicCandidates = getPublicCandidates;
