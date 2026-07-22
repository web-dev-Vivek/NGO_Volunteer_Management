// Error handling middleware
export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statuscode || 500).json({
        success: false,
        statuscode: res.statuscode,
        message: err.message || "Internal Server Error",
    });
}