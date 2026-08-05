import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Define the root uploads directory
const UPLOAD_ROOT = path.join(process.cwd(), 'uploads');

/**
 * Helper to ensure a directory exists.
 * If it doesn't, it creates it recursively.
 */
const ensureDirExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

/**
 * Configure Multer Storage Engine
 */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = UPLOAD_ROOT;
        
        // Dynamically route based on the request URL or fieldname
        if (file.fieldname === 'bannerImage' || req.originalUrl.includes('campaign')) {
            uploadPath = path.join(UPLOAD_ROOT, 'campaigns');
        } else if (file.fieldname === 'certificateFile' || req.originalUrl.includes('certificate')) {
            uploadPath = path.join(UPLOAD_ROOT, 'certificates');
        } else {
            uploadPath = path.join(UPLOAD_ROOT, 'others');
        }
        
        ensureDirExists(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        
        // Sanitize name: remove non-alphanumeric characters, replace with underscores
        const originalNameWithoutExt = path.basename(file.originalname, ext)
            .replace(/[^a-zA-Z0-9]/g, '_');
            
        cb(null, `${originalNameWithoutExt}-${uniqueSuffix}${ext}`);
    }
});

/**
 * File Filter (Validation of MIME Types)
 */
const fileFilter = (req, file, cb) => {
    // Validate Campaign Banners (Must be an image)
    if (file.fieldname === 'bannerImage' || req.originalUrl.includes('campaign')) {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, and WEBP images are allowed for campaign banners.'), false);
        }
    } 
    // Validate Certificates (Must be a PDF)
    else if (file.fieldname === 'certificateFile' || req.originalUrl.includes('certificate')) {
        const allowedMimeTypes = ['application/pdf'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF files are allowed for completion certificates.'), false);
        }
    } 
    // Default fallback
    else {
        cb(null, true);
    }
};

/**
 * Multer Core Instance
 */
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Export specialized middleware instances
export const uploadCampaignBanner = upload.single('bannerImage');
export const uploadCertificate = upload.single('certificateFile');
