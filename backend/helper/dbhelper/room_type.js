module.exports = function(roomID){
    const type=roomID.split("-")[1];
    let returnType;
    switch(type){
        case "br1":
        case "br2":
        case "br3":
        case "br4": 
            returnType="bedroom"           
            break;
        default:
            returnType="others"
            break
            
    }
    return returnType;
}