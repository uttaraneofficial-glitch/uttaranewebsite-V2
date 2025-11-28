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
var client_1 = require("@prisma/client");
var bcrypt = require("bcryptjs");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var adminUsername, adminPasswordRaw, adminPassword, existingAdmin, admin, companyNames, companies, i, existingCompany, company, _i, companies_1, company, existingVideo, _a, companies_2, company, existingCandidate, existingNgoPost, existingMkStudioPost, existingHeroTagline, existingHeroImageUrl, existingHeroHeadline, existingHeroDescription, existingAboutHtml, existingTeamMembers, existingPrivacyPolicy, existingTermsOfService, existingContactEmail;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    adminUsername = process.env.ADMIN_USERNAME || 'admin';
                    adminPasswordRaw = process.env.ADMIN_PASSWORD || 'admin123';
                    return [4 /*yield*/, bcrypt.hash(adminPasswordRaw, 10)];
                case 1:
                    adminPassword = _b.sent();
                    return [4 /*yield*/, prisma.user.findUnique({
                            where: { username: adminUsername },
                        })];
                case 2:
                    existingAdmin = _b.sent();
                    if (!!existingAdmin) return [3 /*break*/, 4];
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                username: adminUsername,
                                password: adminPassword,
                                role: 'ADMIN',
                            },
                        })];
                case 3:
                    admin = _b.sent();
                    console.log('Created admin user:', admin);
                    return [3 /*break*/, 5];
                case 4:
                    console.log('Admin user already exists:', existingAdmin.username);
                    admin = existingAdmin;
                    _b.label = 5;
                case 5:
                    companyNames = ['Amazon', 'Google', 'Meta', 'Microsoft', 'Tech Mahindra'];
                    companies = [];
                    i = 0;
                    _b.label = 6;
                case 6:
                    if (!(i < companyNames.length)) return [3 /*break*/, 11];
                    return [4 /*yield*/, prisma.company.findUnique({
                            where: { name: companyNames[i] },
                        })];
                case 7:
                    existingCompany = _b.sent();
                    if (!!existingCompany) return [3 /*break*/, 9];
                    return [4 /*yield*/, prisma.company.create({
                            data: {
                                name: companyNames[i],
                                slug: companyNames[i].toLowerCase().replace(/\s+/g, '-'),
                                shortBio: "Leading ".concat(companyNames[i], " company"),
                                orderIndex: i,
                                thumbnail: 'https://example.com/company-thumbnail.jpg',
                            },
                        })];
                case 8:
                    company = _b.sent();
                    companies.push(company);
                    return [3 /*break*/, 10];
                case 9:
                    companies.push(existingCompany);
                    _b.label = 10;
                case 10:
                    i++;
                    return [3 /*break*/, 6];
                case 11:
                    console.log('Companies:', companies);
                    _i = 0, companies_1 = companies;
                    _b.label = 12;
                case 12:
                    if (!(_i < companies_1.length)) return [3 /*break*/, 16];
                    company = companies_1[_i];
                    return [4 /*yield*/, prisma.video.findFirst({
                            where: {
                                companyId: company.id,
                                title: {
                                    contains: company.name,
                                },
                            },
                        })];
                case 13:
                    existingVideo = _b.sent();
                    if (!!existingVideo) return [3 /*break*/, 15];
                    return [4 /*yield*/, prisma.video.create({
                            data: {
                                companyId: company.id,
                                title: "".concat(company.name, " Introduction"),
                                youtubeId: 'dQw4w9WgXcQ', // Placeholder YouTube ID
                                roundType: 'Technical',
                                publishedAt: new Date(),
                                thumbnail: 'https://example.com/video-thumbnail.jpg',
                            },
                        })];
                case 14:
                    _b.sent();
                    _b.label = 15;
                case 15:
                    _i++;
                    return [3 /*break*/, 12];
                case 16:
                    _a = 0, companies_2 = companies;
                    _b.label = 17;
                case 17:
                    if (!(_a < companies_2.length)) return [3 /*break*/, 21];
                    company = companies_2[_a];
                    return [4 /*yield*/, prisma.candidate.findFirst({
                            where: {
                                companyId: company.id,
                                name: {
                                    contains: company.name.split(' ')[0],
                                },
                            },
                        })];
                case 18:
                    existingCandidate = _b.sent();
                    if (!!existingCandidate) return [3 /*break*/, 20];
                    return [4 /*yield*/, prisma.candidate.create({
                            data: {
                                companyId: company.id,
                                name: "".concat(company.name.split(' ')[0], " Candidate"),
                                college: 'Top University',
                                branch: 'Computer Science',
                                graduationYear: 2024,
                                roleOffered: 'Software Engineer',
                                packageOffered: '$100,000',
                                profileImageUrl: 'https://example.com/profile.jpg',
                                quote: 'Excited to join this amazing company!',
                                linkedinUrl: 'https://linkedin.com/in/candidate',
                            },
                        })];
                case 19:
                    _b.sent();
                    _b.label = 20;
                case 20:
                    _a++;
                    return [3 /*break*/, 17];
                case 21: return [4 /*yield*/, prisma.ngoPost.findFirst()];
                case 22:
                    existingNgoPost = _b.sent();
                    if (!!existingNgoPost) return [3 /*break*/, 25];
                    return [4 /*yield*/, prisma.ngoPost.create({
                            data: {
                                imageUrl: 'https://example.com/ngo-post1.jpg',
                                caption: 'Helping communities in need',
                                postedAt: new Date(),
                            },
                        })];
                case 23:
                    _b.sent();
                    return [4 /*yield*/, prisma.ngoPost.create({
                            data: {
                                imageUrl: 'https://example.com/ngo-post2.jpg',
                                caption: 'Supporting education initiatives',
                                postedAt: new Date(),
                            },
                        })];
                case 24:
                    _b.sent();
                    _b.label = 25;
                case 25: return [4 /*yield*/, prisma.mkStudioPost.findFirst()];
                case 26:
                    existingMkStudioPost = _b.sent();
                    if (!!existingMkStudioPost) return [3 /*break*/, 28];
                    return [4 /*yield*/, prisma.mkStudioPost.create({
                            data: {
                                youtubeId: 'dQw4w9WgXcQ',
                                title: 'Latest MK Studio Video',
                                description: 'Check out our latest video content',
                                publishedAt: new Date(),
                                thumbnail: 'https://example.com/mkstudio-thumbnail.jpg',
                            },
                        })];
                case 27:
                    _b.sent();
                    _b.label = 28;
                case 28: return [4 /*yield*/, prisma.siteContent.findUnique({
                        where: { key: 'hero_tagline' },
                    })];
                case 29:
                    existingHeroTagline = _b.sent();
                    if (!!existingHeroTagline) return [3 /*break*/, 31];
                    return [4 /*yield*/, prisma.siteContent.create({
                            data: {
                                key: 'hero_tagline',
                                value: 'Discover Amazing Opportunities',
                            },
                        })];
                case 30:
                    _b.sent();
                    _b.label = 31;
                case 31: return [4 /*yield*/, prisma.siteContent.findUnique({
                        where: { key: 'hero_image_url' },
                    })];
                case 32:
                    existingHeroImageUrl = _b.sent();
                    if (!!existingHeroImageUrl) return [3 /*break*/, 34];
                    return [4 /*yield*/, prisma.siteContent.create({
                            data: {
                                key: 'hero_image_url',
                                value: 'https://example.com/hero-image.jpg',
                            },
                        })];
                case 33:
                    _b.sent();
                    _b.label = 34;
                case 34: return [4 /*yield*/, prisma.siteContent.findUnique({
                        where: { key: 'hero_headline' },
                    })];
                case 35:
                    existingHeroHeadline = _b.sent();
                    if (!!existingHeroHeadline) return [3 /*break*/, 37];
                    return [4 /*yield*/, prisma.siteContent.create({
                            data: {
                                key: 'hero_headline',
                                value: 'Welcome to Our Platform',
                            },
                        })];
                case 36:
                    _b.sent();
                    _b.label = 37;
                case 37: return [4 /*yield*/, prisma.siteContent.findUnique({
                        where: { key: 'hero_description' },
                    })];
                case 38:
                    existingHeroDescription = _b.sent();
                    if (!!existingHeroDescription) return [3 /*break*/, 40];
                    return [4 /*yield*/, prisma.siteContent.create({
                            data: {
                                key: 'hero_description',
                                value: 'Discover amazing content and connect with top companies',
                            },
                        })];
                case 39:
                    _b.sent();
                    _b.label = 40;
                case 40: return [4 /*yield*/, prisma.siteContent.findUnique({
                        where: { key: 'about_html' },
                    })];
                case 41:
                    existingAboutHtml = _b.sent();
                    if (!!existingAboutHtml) return [3 /*break*/, 43];
                    return [4 /*yield*/, prisma.siteContent.create({
                            data: {
                                key: 'about_html',
                                value: '<p>Welcome to our platform. We connect talented individuals with amazing companies.</p>',
                            },
                        })];
                case 42:
                    _b.sent();
                    _b.label = 43;
                case 43: return [4 /*yield*/, prisma.siteContent.findUnique({
                        where: { key: 'team_members' },
                    })];
                case 44:
                    existingTeamMembers = _b.sent();
                    if (!!existingTeamMembers) return [3 /*break*/, 46];
                    return [4 /*yield*/, prisma.siteContent.create({
                            data: {
                                key: 'team_members',
                                value: JSON.stringify([
                                    {
                                        id: '1',
                                        name: 'John Doe',
                                        role: 'CEO & Founder',
                                        imageUrl: '',
                                        linkedinUrl: ''
                                    },
                                    {
                                        id: '2',
                                        name: 'Jane Smith',
                                        role: 'CTO',
                                        imageUrl: '',
                                        linkedinUrl: ''
                                    },
                                    {
                                        id: '3',
                                        name: 'Mike Johnson',
                                        role: 'Head of Operations',
                                        imageUrl: '',
                                        linkedinUrl: ''
                                    }
                                ]),
                            },
                        })];
                case 45:
                    _b.sent();
                    _b.label = 46;
                case 46: return [4 /*yield*/, prisma.siteContent.findUnique({
                        where: { key: 'privacy_policy' },
                    })];
                case 47:
                    existingPrivacyPolicy = _b.sent();
                    if (!!existingPrivacyPolicy) return [3 /*break*/, 49];
                    return [4 /*yield*/, prisma.siteContent.create({
                            data: {
                                key: 'privacy_policy',
                                value: "<h2>Privacy Policy</h2>\n<p>Last updated: ".concat(new Date().toLocaleDateString(), "</p>\n\n<h3>1. Information We Collect</h3>\n<p>We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us for support.</p>\n\n<h3>2. How We Use Your Information</h3>\n<p>We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to comply with legal obligations.</p>\n\n<h3>3. Information Sharing and Disclosure</h3>\n<p>We do not sell, trade, or otherwise transfer your personal information to outside parties without your consent, except as described in this policy.</p>\n\n<h3>4. Data Security</h3>\n<p>We implement a variety of security measures to maintain the safety of your personal information.</p>\n\n<h3>5. Your Rights</h3>\n<p>You have the right to access, update, or delete your personal information at any time.</p>\n\n<h3>6. Changes to This Policy</h3>\n<p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>\n\n<h3>7. Contact Us</h3>\n<p>If you have any questions about this privacy policy, please contact us at privacy@example.com.</p>"),
                            },
                        })];
                case 48:
                    _b.sent();
                    _b.label = 49;
                case 49: return [4 /*yield*/, prisma.siteContent.findUnique({
                        where: { key: 'terms_of_service' },
                    })];
                case 50:
                    existingTermsOfService = _b.sent();
                    if (!!existingTermsOfService) return [3 /*break*/, 52];
                    return [4 /*yield*/, prisma.siteContent.create({
                            data: {
                                key: 'terms_of_service',
                                value: "<h2>Terms of Service</h2>\n<p>Last updated: ".concat(new Date().toLocaleDateString(), "</p>\n\n<h3>1. Acceptance of Terms</h3>\n<p>By accessing or using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>\n\n<h3>2. Description of Service</h3>\n<p>Our service provides a platform for connecting companies with talented individuals through interview content and resources.</p>\n\n<h3>3. User Responsibilities</h3>\n<p>You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer.</p>\n\n<h3>4. Intellectual Property</h3>\n<p>All content included as part of the service, such as text, graphics, logos, and software, is the property of our company.</p>\n\n<h3>5. Limitation of Liability</h3>\n<p>In no event shall our company be liable for any indirect, incidental, special, or consequential damages.</p>\n\n<h3>6. Changes to Terms</h3>\n<p>We reserve the right to modify these terms at any time. Your continued use of the service after any such changes constitutes your acceptance.</p>\n\n<h3>7. Governing Law</h3>\n<p>These terms shall be governed by and construed in accordance with the laws of your jurisdiction.</p>\n\n<h3>8. Contact Information</h3>\n<p>If you have any questions about these Terms of Service, please contact us at terms@example.com.</p>"),
                            },
                        })];
                case 51:
                    _b.sent();
                    _b.label = 52;
                case 52: return [4 /*yield*/, prisma.siteContent.findUnique({
                        where: { key: 'contact_email' },
                    })];
                case 53:
                    existingContactEmail = _b.sent();
                    if (!!existingContactEmail) return [3 /*break*/, 55];
                    return [4 /*yield*/, prisma.siteContent.create({
                            data: {
                                key: 'contact_email',
                                value: 'akshaytech01@gmail.com',
                            },
                        })];
                case 54:
                    _b.sent();
                    _b.label = 55;
                case 55:
                    console.log('Seeding completed successfully');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
