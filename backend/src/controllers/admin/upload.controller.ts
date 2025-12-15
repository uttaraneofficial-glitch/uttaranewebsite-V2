import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';

export const uploadImage = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No image file provided'
            });
        }

        // The file is already uploaded to Cloudinary by the middleware
        // req.file.path contains the secure URL
        // req.file.filename contains the public_id provided by Cloudinary
        res.json({
            success: true,
            url: req.file.path,
            public_id: req.file.filename,
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            error: 'Image upload failed'
        });
    }
};
