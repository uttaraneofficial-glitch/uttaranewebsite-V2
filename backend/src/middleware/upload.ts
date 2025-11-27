import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'uttarane/hero',
        allowed_formats: ['jpg', 'png', 'webp', 'jpeg'],
    } as any, // Cast to any to avoid type issues with params
});

export const upload = multer({ storage });
