const Response = require('../response')

class SuccessResponse extends Response {

    constructor(response = null,data = null, message = null ) {
        super(200, true, message, data);
        if (response) {
            super.sendResponse(response)
        }
    }
}

module.exports = SuccessResponse