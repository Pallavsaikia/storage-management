const Response = require('./response')  

class ErrorResponse extends Response{

    constructor(message,errorCode=500){
        super(errorCode ,false ,message);
    }

    sendResponse(response){
        super.sendResponse(response)
    }
}

module.exports=ErrorResponse