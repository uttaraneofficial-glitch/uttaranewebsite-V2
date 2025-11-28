"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.candidateUpdateSchema = exports.candidateSchema = void 0;
var zod_1 = require("zod");
exports.candidateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required'),
    college: zod_1.z.string().optional(),
    branch: zod_1.z.string().optional(),
    graduationYear: zod_1.z.coerce.number().optional(),
    roleOffered: zod_1.z.string().optional(),
    packageOffered: zod_1.z.string().optional(),
    profileImageUrl: zod_1.z.string().optional(),
    quote: zod_1.z.string().optional(),
    linkedinUrl: zod_1.z.string().optional(),
    companyId: zod_1.z.string().min(1, 'Company ID is required'),
});
exports.candidateUpdateSchema = exports.candidateSchema.partial();
