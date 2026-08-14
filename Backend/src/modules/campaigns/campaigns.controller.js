// Campaign controllers
export const uploadBannerController = (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a file'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Campaign banner uploaded successfully',
            file: {
                filename: req.file.filename,
                path: `/uploads/campaigns/${req.file.filename}`,
                size: req.file.size,
                mimetype: req.file.mimetype
            }
        });
    } catch (error) {
        next(error);
    }
};
