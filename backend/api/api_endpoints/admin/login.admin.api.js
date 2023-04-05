const express = require('express');
const router = express.Router();
const successResponse = require('../../../helper/api_response/success_res')
const errorResponse = require('../../../helper/api_response/error_res')
const UserSchema = require('../../../models/user')
const status_code = require('../../../static_vars/server_code')
const {  createNewAccessToken , createNewRefreshToken} = require('../../../helper/jwtexpiry')



router.post('/', async (req, res, next) => {
    
    try {
        const user = await UserSchema.findOne({ email: req.body.email, password: req.body.password, isActive: true }).lean()
        if (user) {

            const jwttoken = createNewAccessToken(user)
            const refreshtoken = createNewRefreshToken(user)
            return new successResponse(res, { refreshtoken:refreshtoken,accesstoken: jwttoken, name: user.name, email: user.email, role: user.role, empID: user.empID }, "Successfully Logged in")
        } else {
            return new errorResponse(res, "Wrong Login Cred", status_code._401)
        }
    } catch (err) {
        return next(new Error(err.message));
    }

});


module.exports = router