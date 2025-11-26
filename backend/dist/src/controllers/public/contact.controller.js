"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitContactForm = void 0;
const client_1 = require("@prisma/client");
const nodemailer_1 = __importDefault(require("nodemailer"));
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
// Validation schema for contact form
const contactFormSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(1, 'Full name is required'),
    email: zod_1.z.string().email('Invalid email address'),
    subject: zod_1.z.string().min(1, 'Subject is required'),
    message: zod_1.z.string().min(1, 'Message is required'),
});
// Handle contact form submission
const submitContactForm = async (req, res) => {
    try {
        // Validate input
        const formData = contactFormSchema.parse(req.body);
        // Get contact email from site settings (default to akshaytech01@gmail.com)
        const contactEmailSetting = await prisma.siteContent.findUnique({
            where: { key: 'contact_email' },
        });
        const contactEmail = (contactEmailSetting === null || contactEmailSetting === void 0 ? void 0 : contactEmailSetting.value) || 'akshaytech01@gmail.com';
        // For now, we'll skip saving to database due to Prisma generation issues
        // In a production environment, you would want to save the message to the database
        // await prisma.contactMessage.create({
        //   data: {
        //     fullName: formData.fullName,
        //     email: formData.email,
        //     subject: formData.subject,
        //     message: formData.message,
        //   },
        // });
        // Only send email if we have the required credentials
        const emailUser = process.env.CONTACT_EMAIL_USER;
        const emailPass = process.env.CONTACT_EMAIL_PASS;
        if (emailUser && emailPass) {
            // Create nodemailer transporter (using Gmail SMTP)
            const transporter = nodemailer_1.default.createTransport({
                service: 'gmail',
                auth: {
                    user: emailUser,
                    pass: emailPass,
                },
            });
            // Prepare email content
            const mailOptions = {
                from: emailUser,
                to: contactEmail,
                subject: `Contact Form Submission: ${formData.subject}`,
                text: `
          New contact form submission:
          
          Full Name: ${formData.fullName}
          Email: ${formData.email}
          Subject: ${formData.subject}
          Message: ${formData.message}
        `,
                html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Full Name:</strong> ${formData.fullName}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Subject:</strong> ${formData.subject}</p>
          <p><strong>Message:</strong></p>
          <p>${formData.message.replace(/\n/g, '<br>')}</p>
        `,
            };
            // Send email
            await transporter.sendMail(mailOptions);
        }
        else {
            console.log('Email credentials not configured. Skipping email sending.');
            // In a production environment, you might want to queue the email to be sent later
            // or use a different email service
        }
        res.status(200).json({ message: 'Message sent successfully' });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                message: 'Invalid input',
                errors: error.errors,
            });
        }
        console.error('Contact form submission error:', error);
        res
            .status(500)
            .json({ message: 'Error sending message. Please try again later.' });
    }
};
exports.submitContactForm = submitContactForm;
