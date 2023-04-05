const express = require('express');
const app = express.Router();
const login=require('../api_endpoints/admin/login.admin.api')
const refreshtoken=require('../api_endpoints/admin/refreshtoken.admin.api')
const sets=require('../api_endpoints/admin/sets.admin.api')
const search=require('../api_endpoints/admin/search.admin.api')
const download=require('../api_endpoints/admin/download.admin.api')
const upload=require('../api_endpoints/admin/fileupload.admin.api')
const rooms=require('../api_endpoints/admin/rooms.admin.api')
const roomdelete=require('../api_endpoints/admin/rooms.delete.admin.api')
const preSetCreate=require('../api_endpoints/admin/pre-set-create-data.admin.api')
const preRoomCreate=require('../api_endpoints/admin/pre-room-create-data.admin.api')
const {jwtcheck}=require('../../middleware/jwt_check')

app.use("/login",login)



app.use("/refreshtoken",refreshtoken)
app.use("/sets",jwtcheck,sets)
app.use("/rooms",jwtcheck,rooms)
app.use("/delete-room",jwtcheck,roomdelete)
app.use("/search",jwtcheck,search)
app.use("/upload",jwtcheck,upload)
app.use("/download",jwtcheck,download)

app.use("/pre-set-create-data",jwtcheck,preSetCreate)
app.use("/pre-room-create-data",jwtcheck,preRoomCreate)
module.exports=app