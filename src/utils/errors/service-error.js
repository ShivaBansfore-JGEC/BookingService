const { StatusCodes } = require('http-status-codes');

class ServiceError extends Error {
    constructor(
        message = "something went wrong",
        explaination,
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR
    ) {
        this.name = "Service Error";
        this.message = message;
        this.explaination = explaination;
        this.statusCode = statusCode
    }
}

module.exports = ServiceError;