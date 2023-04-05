const Response = require('./response')  

class SuccessResponse extends Response{

    constructor(data=null,message=null){
        super(200 ,true ,message,data);
    }

    sendResponse(response){
        super.sendResponse(response)
    }
}

module.exports=SuccessResponse