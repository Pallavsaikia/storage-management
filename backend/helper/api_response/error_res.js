const Response = require('../response')

class ErrorResponse extends Response {

    constructor(response = null, message, errorCode = 500,__t=0) {
        super(errorCode, false, message,null,__t);
      
        if (response) {
            super.sendResponse(response)
        }
    }

    sendResponse(response) {
        super.sendResponse(response)
    }
}

module.exports = ErrorResponse