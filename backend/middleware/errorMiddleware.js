import winston from 'winston';

export const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// Error handler middleware
export const errorHandler = (err, req, res, next) => {
    const logger = winston.createLogger({
        level: "error",
        transports: [
            new winston.transports.File({
                filename: "error.log",
            })
        ],
    });
    // Log error message with timestamp
    logger.error(err.message, { timestamp: new Date().toISOString() })

    // If response status code is 200, change it to 500 
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });

}

export default { notFound, errorHandler};
