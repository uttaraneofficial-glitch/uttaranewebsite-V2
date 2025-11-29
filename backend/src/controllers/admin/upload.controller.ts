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

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'uttarane',
        });

        res.json({
            success: true,
            url: result.secure_url,
            public_id: result.public_id,
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            error: 'Image upload failed'
        });
    }
};
