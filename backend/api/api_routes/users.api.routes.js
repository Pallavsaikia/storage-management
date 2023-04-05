const express = require('express');
const app = express.Router();
const login = require('../api_endpoints/user/login.api')
const room = require('../api_endpoints/user/rooms.api')
const roommeta = require('../api_endpoints/user/rooms.meta.api')
const jwt_auth = require('../../middleware/jwt_check_user')

app.use("/login", login)
app.use("/rooms", jwt_auth, room)
app.use("/get-meta-for-room-download", jwt_auth, roommeta)

module.exports = app