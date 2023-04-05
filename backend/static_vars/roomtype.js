const roomtypeStr=require('./roomtype_dict')

const tmparray=Object.values(roomtypeStr)
let roomtypeArray=[]
for(let i=0;i<tmparray.length;i++){
    roomtypeArray.push(tmparray[i].name)
}
module.exports =roomtypeArray