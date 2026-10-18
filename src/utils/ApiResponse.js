class ApiResponse {
    constructor(
        statusCode,
        data,
        message,
    ){
        this.statusCode = statusCode;
        this.data = data;
        this.success = statusCode >= 200 && statusCode < 400;
        this.message = message;
    }
}

module.exports = ApiResponse;
