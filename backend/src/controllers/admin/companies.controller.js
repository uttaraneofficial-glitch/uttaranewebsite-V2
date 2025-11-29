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
exports.deleteCompany = exports.updateCompany = exports.createCompany = exports.getAdminCompanyById = exports.getAdminCompanies = void 0;
var client_1 = require("@prisma/client");
var cloudinary = require("../../config/cloudinary");
var zod_1 = require("zod");
var prisma = new client_1.PrismaClient();
// Validation schemas
var companySchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    slug: zod_1.z.string().min(1),
    logoUrl: zod_1.z.string().optional(),
    shortBio: zod_1.z.string().optional(),
    orderIndex: zod_1.z.number().optional(),
    thumbnail: zod_1.z.string().optional(),
    bannerUrl: zod_1.z.string().optional(),
});
// Get all companies (admin)
var getAdminCompanies = function (req, res) {
    return __awaiter(void 0, void 0, void 0, function () {
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
                    console.error('Get admin companies error:', error_1);
                    res.status(500).json({ message: 'Error retrieving companies' });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
};
exports.getAdminCompanies = getAdminCompanies;
// Get company by ID (admin)
var getAdminCompanyById = function (req, res) {
    return __awaiter(void 0, void 0, void 0, function () {
        var id, company, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    id = req.params.id;
                    return [4 /*yield*/, prisma.company.findUnique({
                        where: { id: id },
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
                    console.error('Get admin company error:', error_2);
                    res.status(500).json({ message: 'Error retrieving company' });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
};
exports.getAdminCompanyById = getAdminCompanyById;
// Create company (admin)
var createCompany = function (req, res) {
    return __awaiter(void 0, void 0, void 0, function () {
        var companyData, existingCompany, company, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    companyData = companySchema.parse(req.body);
                    if (req.file) {
                        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                            folder: "uttarane/companies",
                        });
                        companyData.logoUrl = uploadResult.secure_url;
                    }
                    return [4 /*yield*/, prisma.company.findFirst({
                        where: {
                            OR: [{ name: companyData.name }, { slug: companyData.slug }],
                        },
                    })];
                case 1:
                    existingCompany = _a.sent();
                    if (existingCompany) {
                        return [2 /*return*/, res.status(400).json({
                            message: 'Company with this name or slug already exists',
                        })];
                    }
                    return [4 /*yield*/, prisma.company.create({
                        data: {
                            name: companyData.name,
                            slug: companyData.slug,
                            logoUrl: companyData.logoUrl,
                            shortBio: companyData.shortBio,
                            orderIndex: companyData.orderIndex,
                            thumbnail: companyData.thumbnail,
                            bannerUrl: companyData.bannerUrl,
                        },
                    })];
                case 2:
                    company = _a.sent();
                    res.status(201).json({
                        message: 'Company created successfully',
                        data: company,
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    if (error_3 instanceof zod_1.z.ZodError) {
                        return [2 /*return*/, res.status(400).json({
                            message: 'Invalid input',
                            errors: error_3.errors,
                        })];
                    }
                    console.error('Create company error:', error_3);
                    res.status(500).json({ message: 'Error creating company' });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
};
exports.createCompany = createCompany;
// Update company (admin)
var updateCompany = function (req, res) {
    return __awaiter(void 0, void 0, void 0, function () {
        var id, companyData, existingCompany, duplicateCompany, company, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    id = req.params.id;
                    companyData = companySchema.parse(req.body);
                    if (req.file) {
                        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                            folder: "uttarane/companies",
                        });
                        companyData.logoUrl = uploadResult.secure_url;
                    }
                    return [4 /*yield*/, prisma.company.findUnique({
                        where: { id: id },
                    })];
                case 1:
                    existingCompany = _a.sent();
                    if (!existingCompany) {
                        return [2 /*return*/, res.status(404).json({ message: 'Company not found' })];
                    }
                    return [4 /*yield*/, prisma.company.findFirst({
                        where: {
                            id: { not: id },
                            OR: [{ name: companyData.name }, { slug: companyData.slug }],
                        },
                    })];
                case 2:
                    duplicateCompany = _a.sent();
                    if (duplicateCompany) {
                        return [2 /*return*/, res.status(400).json({
                            message: 'Another company with this name or slug already exists',
                        })];
                    }
                    return [4 /*yield*/, prisma.company.update({
                        where: { id: id },
                        data: {
                            name: companyData.name,
                            slug: companyData.slug,
                            logoUrl: companyData.logoUrl,
                            shortBio: companyData.shortBio,
                            orderIndex: companyData.orderIndex,
                            thumbnail: companyData.thumbnail,
                            bannerUrl: companyData.bannerUrl,
                        },
                    })];
                case 3:
                    company = _a.sent();
                    res.json({
                        message: 'Company updated successfully',
                        data: company,
                    });
                    return [3 /*break*/, 5];
                case 4:
                    error_4 = _a.sent();
                    if (error_4 instanceof zod_1.z.ZodError) {
                        return [2 /*return*/, res.status(400).json({
                            message: 'Invalid input',
                            errors: error_4.errors,
                        })];
                    }
                    console.error('Update company error:', error_4);
                    res.status(500).json({ message: 'Error updating company' });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
};
exports.updateCompany = updateCompany;
// Delete company (admin)
var deleteCompany = function (req, res) {
    return __awaiter(void 0, void 0, void 0, function () {
        var id, existingCompany, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    id = req.params.id;
                    return [4 /*yield*/, prisma.company.findUnique({
                        where: { id: id },
                    })];
                case 1:
                    existingCompany = _a.sent();
                    if (!existingCompany) {
                        return [2 /*return*/, res.status(404).json({ message: 'Company not found' })];
                    }
                    // Delete associated videos first (due to foreign key constraint)
                    return [4 /*yield*/, prisma.video.deleteMany({
                        where: { companyId: id },
                    })];
                case 2:
                    // Delete associated videos first (due to foreign key constraint)
                    _a.sent();
                    // Delete the company
                    return [4 /*yield*/, prisma.company.delete({
                        where: { id: id },
                    })];
                case 3:
                    // Delete the company
                    _a.sent();
                    res.json({ message: 'Company deleted successfully' });
                    return [3 /*break*/, 5];
                case 4:
                    error_5 = _a.sent();
                    console.error('Delete company error:', error_5);
                    res.status(500).json({ message: 'Error deleting company' });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
};
exports.deleteCompany = deleteCompany;
