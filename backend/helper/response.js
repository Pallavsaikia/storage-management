
class Response {
    constructor(status = 200, success = true, message, data = null, __t = 0) {
        this.status = status;
        this.success = success;
        this.message = message;
        this.data = data
        this.__t = __t
    }
    sendResponse(response) {
        response.status(this.status);
        response.json({
            success: this.success,
            data: this.data,
            message: this.message,
            __t: this.__t
        });

    }
}

module.exports = Response