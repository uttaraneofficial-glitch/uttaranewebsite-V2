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
exports.submitContactForm = void 0;
var client_1 = require("@prisma/client");
var nodemailer_1 = require("nodemailer");
var zod_1 = require("zod");
var prisma = new client_1.PrismaClient();
// Validation schema for contact form
var contactFormSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(1, 'Full name is required'),
    email: zod_1.z.string().email('Invalid email address'),
    subject: zod_1.z.string().min(1, 'Subject is required'),
    message: zod_1.z.string().min(1, 'Message is required'),
});
// Handle contact form submission
var submitContactForm = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var formData, contactEmailSetting, contactEmail, emailUser, emailPass, transporter, mailOptions, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                formData = contactFormSchema.parse(req.body);
                return [4 /*yield*/, prisma.siteContent.findUnique({
                        where: { key: 'contact_email' },
                    })];
            case 1:
                contactEmailSetting = _a.sent();
                contactEmail = (contactEmailSetting === null || contactEmailSetting === void 0 ? void 0 : contactEmailSetting.value) || 'akshaytech01@gmail.com';
                emailUser = process.env.CONTACT_EMAIL_USER;
                emailPass = process.env.CONTACT_EMAIL_PASS;
                if (!(emailUser && emailPass)) return [3 /*break*/, 3];
                transporter = nodemailer_1.default.createTransport({
                    service: 'gmail',
                    auth: {
                        user: emailUser,
                        pass: emailPass,
                    },
                });
                mailOptions = {
                    from: emailUser,
                    to: contactEmail,
                    subject: "Contact Form Submission: ".concat(formData.subject),
                    text: "\n          New contact form submission:\n          \n          Full Name: ".concat(formData.fullName, "\n          Email: ").concat(formData.email, "\n          Subject: ").concat(formData.subject, "\n          Message: ").concat(formData.message, "\n        "),
                    html: "\n          <h2>New Contact Form Submission</h2>\n          <p><strong>Full Name:</strong> ".concat(formData.fullName, "</p>\n          <p><strong>Email:</strong> ").concat(formData.email, "</p>\n          <p><strong>Subject:</strong> ").concat(formData.subject, "</p>\n          <p><strong>Message:</strong></p>\n          <p>").concat(formData.message.replace(/\n/g, '<br>'), "</p>\n        "),
                };
                // Send email
                return [4 /*yield*/, transporter.sendMail(mailOptions)];
            case 2:
                // Send email
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                console.log('Email credentials not configured. Skipping email sending.');
                _a.label = 4;
            case 4:
                res.status(200).json({ message: 'Message sent successfully' });
                return [3 /*break*/, 6];
            case 5:
                error_1 = _a.sent();
                if (error_1 instanceof zod_1.z.ZodError) {
                    return [2 /*return*/, res.status(400).json({
                            message: 'Invalid input',
                            errors: error_1.errors,
                        })];
                }
                console.error('Contact form submission error:', error_1);
                res
                    .status(500)
                    .json({ message: 'Error sending message. Please try again later.' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.submitContactForm = submitContactForm;
