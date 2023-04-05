const express = require('express');
const successResponse = require('../../../helper/api_response/success_res')
const errorresponse = require('../../../helper/api_response/error_res')
const UserSchema = require("../../../models/user")
const token_code = require('../../../static_vars/token_error_code')
const status_code = require('../../../static_vars/server_code')
const {  createNewAccessToken } = require('../../../helper/jwtexpiry')
const jwt = require('jsonwebtoken')

const router = express.Router();

router.post('/', async (req, res, next) => {
    const token = req.body.refreshtoken
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, token_dict) => {
        if (err) {
            return new errorresponse(res, "Invalid Token", status_code._401, token_code.invalidtoken)
        } else {
            console.log(token_dict.exp)
            if (!token_dict.exp) {
                return new errorresponse(res, "Invalid Token", status_code._401, token_code.invalidtoken)
            }
            const dateTimeinMs = new Date().getTime()
            console.log(dateTimeinMs-token_dict.exp)
            if (dateTimeinMs > token_dict.exp) {
                return new errorresponse(res, "Refresh Token Expired", status_code._401, token_code.logout)

            }
            const user = await UserSchema.findOne({ _id: token_dict.id, isActive: true }).lean()
            const jwttoken = createNewAccessToken(user)
            return new successResponse(res, {  accesstoken: jwttoken }, "Successfully Refreshed")

        }
    })
});



module.exports = router;
