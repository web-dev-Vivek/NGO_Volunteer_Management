// Certificate controllers
export const uploadCertificateController = (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a file'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Certificate file uploaded successfully',
            file: {
                filename: req.file.filename,
                path: `/uploads/certificates/${req.file.filename}`,
                size: req.file.size,
                mimetype: req.file.mimetype
            }
        });
    } catch (error) {
        next(error);
    }
};
