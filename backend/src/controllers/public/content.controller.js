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
exports.getInstructorContent = exports.getLatestMkStudioVideo = exports.getMkStudioPosts = exports.getNgoPosts = exports.getTermsOfServiceContent = exports.getPrivacyPolicyContent = exports.getAboutContent = exports.getHeroContent = void 0;
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
// Get hero content
var getHeroContent = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, tagline, imageUrl, headline, description, youtube, instagram, twitter, linkedin, logoUrl, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Promise.all([
                        prisma.siteContent.findUnique({ where: { key: 'hero_tagline' } }),
                        prisma.siteContent.findUnique({ where: { key: 'hero_image_url' } }),
                        prisma.siteContent.findUnique({ where: { key: 'hero_headline' } }),
                        prisma.siteContent.findUnique({ where: { key: 'hero_description' } }),
                        prisma.siteContent.findUnique({ where: { key: 'social_youtube' } }),
                        prisma.siteContent.findUnique({ where: { key: 'social_instagram' } }),
                        prisma.siteContent.findUnique({ where: { key: 'social_twitter' } }),
                        prisma.siteContent.findUnique({ where: { key: 'social_linkedin' } }),
                        prisma.siteContent.findUnique({ where: { key: 'navbar_logo_url' } }),
                    ])];
            case 1:
                _a = _b.sent(), tagline = _a[0], imageUrl = _a[1], headline = _a[2], description = _a[3], youtube = _a[4], instagram = _a[5], twitter = _a[6], linkedin = _a[7], logoUrl = _a[8];
                console.log('Retrieved hero content from DB:', {
                    tagline: tagline === null || tagline === void 0 ? void 0 : tagline.value,
                    imageUrl: imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.value,
                    headline: headline === null || headline === void 0 ? void 0 : headline.value,
                    description: description === null || description === void 0 ? void 0 : description.value,
                });
                // Log the full imageUrl object for debugging
                console.log('Full imageUrl object:', imageUrl);
                res.json({
                    tagline: (tagline === null || tagline === void 0 ? void 0 : tagline.value) || 'Discover Amazing Opportunities',
                    imageUrl: (imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.value) || 'https://placehold.co/1200x400',
                    headline: (headline === null || headline === void 0 ? void 0 : headline.value) || '',
                    description: (description === null || description === void 0 ? void 0 : description.value) || '',
                    logoUrl: (logoUrl === null || logoUrl === void 0 ? void 0 : logoUrl.value) || '',
                    socialLinks: {
                        youtube: (youtube === null || youtube === void 0 ? void 0 : youtube.value) || '',
                        instagram: (instagram === null || instagram === void 0 ? void 0 : instagram.value) || '',
                        twitter: (twitter === null || twitter === void 0 ? void 0 : twitter.value) || '',
                        linkedin: (linkedin === null || linkedin === void 0 ? void 0 : linkedin.value) || '',
                    },
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                console.error('Get hero content error:', error_1);
                res.status(500).json({ message: 'Error retrieving hero content' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getHeroContent = getHeroContent;
// Get about content
var getAboutContent = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var aboutHtml, teamMembersData, teamMembers, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, prisma.siteContent.findUnique({
                        where: { key: 'about_html' },
                    })];
            case 1:
                aboutHtml = _a.sent();
                return [4 /*yield*/, prisma.siteContent.findUnique({
                        where: { key: 'team_members' },
                    })];
            case 2:
                teamMembersData = _a.sent();
                teamMembers = [];
                try {
                    teamMembers = (teamMembersData === null || teamMembersData === void 0 ? void 0 : teamMembersData.value)
                        ? JSON.parse(teamMembersData.value)
                        : [
                            {
                                id: '1',
                                name: 'John Doe',
                                role: 'CEO & Founder',
                                imageUrl: '',
                                linkedinUrl: '',
                            },
                            {
                                id: '2',
                                name: 'Jane Smith',
                                role: 'CTO',
                                imageUrl: '',
                                linkedinUrl: '',
                            },
                            {
                                id: '3',
                                name: 'Mike Johnson',
                                role: 'Head of Operations',
                                imageUrl: '',
                                linkedinUrl: '',
                            },
                        ];
                }
                catch (e) {
                    teamMembers = [];
                }
                res.json({
                    data: {
                        html: (aboutHtml === null || aboutHtml === void 0 ? void 0 : aboutHtml.value) || '<p>Welcome to our platform</p>',
                        teamMembers: teamMembers,
                    },
                });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.error('Get about content error:', error_2);
                res.status(500).json({ message: 'Error retrieving about content' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getAboutContent = getAboutContent;
// Get privacy policy content
var getPrivacyPolicyContent = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var privacyPolicyHtml, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.siteContent.findUnique({
                        where: { key: 'privacy_policy' },
                    })];
            case 1:
                privacyPolicyHtml = _a.sent();
                res.json({
                    content: (privacyPolicyHtml === null || privacyPolicyHtml === void 0 ? void 0 : privacyPolicyHtml.value) ||
                        '<p>No privacy policy content available.</p>',
                });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error('Get privacy policy content error:', error_3);
                res
                    .status(500)
                    .json({ message: 'Error retrieving privacy policy content' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getPrivacyPolicyContent = getPrivacyPolicyContent;
// Get terms of service content
var getTermsOfServiceContent = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var termsOfServiceHtml, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.siteContent.findUnique({
                        where: { key: 'terms_of_service' },
                    })];
            case 1:
                termsOfServiceHtml = _a.sent();
                res.json({
                    content: (termsOfServiceHtml === null || termsOfServiceHtml === void 0 ? void 0 : termsOfServiceHtml.value) ||
                        '<p>No terms of service content available.</p>',
                });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error('Get terms of service content error:', error_4);
                res
                    .status(500)
                    .json({ message: 'Error retrieving terms of service content' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getTermsOfServiceContent = getTermsOfServiceContent;
// Get NGO posts
var getNgoPosts = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var posts, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.ngoPost.findMany({
                        orderBy: { postedAt: 'desc' },
                        take: 10, // Limit to 10 most recent posts
                    })];
            case 1:
                posts = _a.sent();
                res.json({
                    data: posts,
                });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error('Get NGO posts error:', error_5);
                res.status(500).json({ message: 'Error retrieving NGO posts' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getNgoPosts = getNgoPosts;
// Get MK Studio posts
var getMkStudioPosts = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var posts, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.mkStudioPost.findMany({
                        orderBy: { publishedAt: 'desc' },
                        take: 10, // Limit to 10 most recent posts
                    })];
            case 1:
                posts = _a.sent();
                res.json({
                    data: posts,
                });
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                console.error('Get MK Studio posts error:', error_6);
                res.status(500).json({ message: 'Error retrieving MK Studio posts' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getMkStudioPosts = getMkStudioPosts;
// Get latest MK Studio video
var getLatestMkStudioVideo = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var video, _a, channelName, channelTagline, subscribeUrl, channelImage, error_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                return [4 /*yield*/, prisma.mkStudioPost.findFirst({
                        orderBy: { publishedAt: 'desc' },
                    })];
            case 1:
                video = _b.sent();
                if (!video) {
                    return [2 /*return*/, res.status(404).json({ message: 'No MK Studio videos found' })];
                }
                return [4 /*yield*/, Promise.all([
                        prisma.siteContent.findUnique({
                            where: { key: 'mkstudio_channel_name' },
                        }),
                        prisma.siteContent.findUnique({
                            where: { key: 'mkstudio_channel_tagline' },
                        }),
                        prisma.siteContent.findUnique({
                            where: { key: 'mkstudio_subscribe_url' },
                        }),
                        prisma.siteContent.findUnique({
                            where: { key: 'mkstudio_channel_image' },
                        }),
                    ])];
            case 2:
                _a = _b.sent(), channelName = _a[0], channelTagline = _a[1], subscribeUrl = _a[2], channelImage = _a[3];
                res.json({
                    data: video,
                    channel: {
                        name: (channelName === null || channelName === void 0 ? void 0 : channelName.value) || 'MK Studio',
                        tagline: (channelTagline === null || channelTagline === void 0 ? void 0 : channelTagline.value) || 'Official Channel',
                        subscribeUrl: (subscribeUrl === null || subscribeUrl === void 0 ? void 0 : subscribeUrl.value) || 'https://www.youtube.com/@MKStudio',
                        imageUrl: (channelImage === null || channelImage === void 0 ? void 0 : channelImage.value) || '',
                    },
                });
                return [3 /*break*/, 4];
            case 3:
                error_7 = _b.sent();
                console.error('Get latest MK Studio video error:', error_7);
                res
                    .status(500)
                    .json({ message: 'Error retrieving latest MK Studio video' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getLatestMkStudioVideo = getLatestMkStudioVideo;
// Get instructor content
var getInstructorContent = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, title, bio, imageUrl, linkedin, twitter, instagram, companyLogos, error_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Promise.all([
                        prisma.siteContent.findUnique({ where: { key: 'instructor_name' } }),
                        prisma.siteContent.findUnique({ where: { key: 'instructor_title' } }),
                        prisma.siteContent.findUnique({ where: { key: 'instructor_bio' } }),
                        prisma.siteContent.findUnique({ where: { key: 'instructor_image_url' } }),
                        prisma.siteContent.findUnique({
                            where: { key: 'instructor_social_linkedin' },
                        }),
                        prisma.siteContent.findUnique({
                            where: { key: 'instructor_social_twitter' },
                        }),
                        prisma.siteContent.findUnique({
                            where: { key: 'instructor_social_instagram' },
                        }),
                        prisma.siteContent.findUnique({
                            where: { key: 'instructor_company_logos' },
                        }),
                    ])];
            case 1:
                _a = _b.sent(), name_1 = _a[0], title = _a[1], bio = _a[2], imageUrl = _a[3], linkedin = _a[4], twitter = _a[5], instagram = _a[6], companyLogos = _a[7];
                res.json({
                    name: (name_1 === null || name_1 === void 0 ? void 0 : name_1.value) || 'Akshay Hangaragi',
                    title: (title === null || title === void 0 ? void 0 : title.value) || 'Founder & Instructor',
                    bio: (bio === null || bio === void 0 ? void 0 : bio.value) ||
                        'Passionate about teaching and helping students crack their dream interviews.',
                    imageUrl: (imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.value) || '',
                    socialLinks: {
                        linkedin: (linkedin === null || linkedin === void 0 ? void 0 : linkedin.value) || '',
                        twitter: (twitter === null || twitter === void 0 ? void 0 : twitter.value) || '',
                        instagram: (instagram === null || instagram === void 0 ? void 0 : instagram.value) || '',
                    },
                    companyLogos: (companyLogos === null || companyLogos === void 0 ? void 0 : companyLogos.value) ? JSON.parse(companyLogos.value) : [],
                });
                return [3 /*break*/, 3];
            case 2:
                error_8 = _b.sent();
                console.error('Get instructor content error:', error_8);
                res.status(500).json({ message: 'Error retrieving instructor content' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getInstructorContent = getInstructorContent;
