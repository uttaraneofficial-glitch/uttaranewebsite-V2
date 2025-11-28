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
exports.getDashboardCharts = exports.getNotifications = exports.getGlobalSearch = exports.getDashboardStats = void 0;
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
// Get Dashboard Stats
var getDashboardStats = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, companiesCount, candidatesCount, videosCount, usersCount, stats, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Promise.all([
                        prisma.company.count(),
                        prisma.candidate.count(),
                        prisma.video.count(),
                        prisma.user.count(),
                    ])];
            case 1:
                _a = _b.sent(), companiesCount = _a[0], candidatesCount = _a[1], videosCount = _a[2], usersCount = _a[3];
                stats = {
                    companies: { value: companiesCount, trend: 'up', trendValue: '5%' },
                    candidates: { value: candidatesCount, trend: 'up', trendValue: '12%' },
                    videos: { value: videosCount, trend: 'up', trendValue: '8%' },
                    users: { value: usersCount, trend: 'stable', trendValue: '0%' },
                };
                res.json({ data: stats });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                console.error('Get dashboard stats error:', error_1);
                res.status(500).json({ message: 'Failed to fetch dashboard stats' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getDashboardStats = getDashboardStats;
// Global Search
var getGlobalSearch = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, companies, candidates, videos, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = req.query.q;
                if (!query) {
                    return [2 /*return*/, res.json({ data: { companies: [], candidates: [], videos: [] } })];
                }
                return [4 /*yield*/, Promise.all([
                        prisma.company.findMany({
                            where: { name: { contains: query, mode: 'insensitive' } },
                            take: 5,
                        }),
                        prisma.candidate.findMany({
                            where: { name: { contains: query, mode: 'insensitive' } },
                            take: 5,
                            include: { company: true },
                        }),
                        prisma.video.findMany({
                            where: { title: { contains: query, mode: 'insensitive' } },
                            take: 5,
                            include: { company: true },
                        }),
                    ])];
            case 1:
                _a = _b.sent(), companies = _a[0], candidates = _a[1], videos = _a[2];
                res.json({
                    data: {
                        companies: companies,
                        candidates: candidates,
                        videos: videos,
                    },
                });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                console.error('Global search error:', error_2);
                res.status(500).json({ message: 'Search failed' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getGlobalSearch = getGlobalSearch;
// Get Notifications (Mocked for now, but structured for API)
var getNotifications = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var notifications;
    return __generator(this, function (_a) {
        try {
            notifications = [
                {
                    id: 1,
                    title: 'New Candidate Registered',
                    time: '5 mins ago',
                    type: 'info',
                },
                {
                    id: 2,
                    title: 'Server Backup Completed',
                    time: '1 hour ago',
                    type: 'success',
                },
                { id: 3, title: 'New Video Uploaded', time: '2 hours ago', type: 'info' },
                {
                    id: 4,
                    title: 'System Update Available',
                    time: '1 day ago',
                    type: 'warning',
                },
            ];
            res.json({ data: notifications });
        }
        catch (error) {
            console.error('Get notifications error:', error);
            res.status(500).json({ message: 'Failed to fetch notifications' });
        }
        return [2 /*return*/];
    });
}); };
exports.getNotifications = getNotifications;
// Get Dashboard Charts Data
var getDashboardCharts = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var sixMonthsAgo, sevenDaysAgo, _a, videos, candidates, getMonthName_1, growthMap_1, i, d, key, contentGrowth, users, getDayName_1, userMap_1, i, d, key, userGrowth, companies, companyDistribution, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                sixMonthsAgo = new Date();
                sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
                sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                return [4 /*yield*/, Promise.all([
                        prisma.video.findMany({
                            where: { createdAt: { gte: sixMonthsAgo } },
                            select: { createdAt: true },
                        }),
                        prisma.candidate.findMany({
                            where: { createdAt: { gte: sixMonthsAgo } },
                            select: { createdAt: true },
                        }),
                    ])];
            case 1:
                _a = _b.sent(), videos = _a[0], candidates = _a[1];
                getMonthName_1 = function (date) {
                    return date.toLocaleString('default', { month: 'short' });
                };
                growthMap_1 = new Map();
                // Initialize last 6 months
                for (i = 5; i >= 0; i--) {
                    d = new Date();
                    d.setMonth(d.getMonth() - i);
                    key = getMonthName_1(d);
                    growthMap_1.set(key, { name: key, videos: 0, candidates: 0 });
                }
                videos.forEach(function (v) {
                    var key = getMonthName_1(v.createdAt);
                    if (growthMap_1.has(key))
                        growthMap_1.get(key).videos++;
                });
                candidates.forEach(function (c) {
                    var key = getMonthName_1(c.createdAt);
                    if (growthMap_1.has(key))
                        growthMap_1.get(key).candidates++;
                });
                contentGrowth = Array.from(growthMap_1.values());
                return [4 /*yield*/, prisma.user.findMany({
                        where: { createdAt: { gte: sevenDaysAgo } },
                        select: { createdAt: true },
                    })];
            case 2:
                users = _b.sent();
                getDayName_1 = function (date) {
                    return date.toLocaleString('default', { weekday: 'short' });
                };
                userMap_1 = new Map();
                // Initialize last 7 days
                for (i = 6; i >= 0; i--) {
                    d = new Date();
                    d.setDate(d.getDate() - i);
                    key = getDayName_1(d);
                    userMap_1.set(key, { name: key, users: 0 });
                }
                users.forEach(function (u) {
                    var key = getDayName_1(u.createdAt);
                    if (userMap_1.has(key))
                        userMap_1.get(key).users++;
                });
                userGrowth = Array.from(userMap_1.values());
                return [4 /*yield*/, prisma.company.findMany({
                        include: {
                            _count: {
                                select: { videos: true },
                            },
                        },
                        orderBy: {
                            videos: {
                                _count: 'desc',
                            },
                        },
                        take: 5,
                    })];
            case 3:
                companies = _b.sent();
                companyDistribution = companies.map(function (c) { return ({
                    name: c.name,
                    value: c._count.videos,
                }); });
                res.json({
                    data: {
                        contentGrowth: contentGrowth,
                        userGrowth: userGrowth,
                        companyDistribution: companyDistribution,
                    },
                });
                return [3 /*break*/, 5];
            case 4:
                error_3 = _b.sent();
                console.error('Get dashboard charts error:', error_3);
                res.status(500).json({ message: 'Failed to fetch chart data' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getDashboardCharts = getDashboardCharts;
