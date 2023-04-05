const SuccessResponse=require("./successresponse");
const ErrorResponse=require("./errorresponse");

//generic response that can be used
function genericExecHandle(exec,res,dataReturn=false,potentialErrorMsg=null,potentialSuccessMessage=null){
    exec.then(docs=>{
        if(!dataReturn){docs=null}
        const response=new SuccessResponse(docs,potentialSuccessMessage);
        response.sendResponse(res);  
    })
    .catch(err=>{
        const response=new ErrorResponse(potentialErrorMsg);
        response.sendResponse(res); 
    });
}

module.exports = { genericExecHandle };