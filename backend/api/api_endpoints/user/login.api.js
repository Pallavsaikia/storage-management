const express = require('express');
const router = express.Router();
const successResponse=require('../../../helper/api_response/success_res')
const errorResponse = require('../../../helper/api_response/error_res')
const jwt=require('jsonwebtoken');
const UserSchema=require('../../../models/user')
const status_code = require('../../../static_vars/server_code')


router.get('/', async (req, res, next) => {

    res.send("done");
});

router.post('/', async (req, res, next) => {
    try {
        console.log(req.body.email)
        const user = await UserSchema.findOne({ email: req.body.email, password: req.body.password, isActive: true }).lean()
        if (user) {
            const jwttoken=jwt.sign({id:user._id},process.env.JWT_SECRET_KEY)
            return new successResponse(res,{accesstoken:jwttoken},"Successfully Logged in")
        } else {
           return new errorResponse(res,"Wrong Login Cred",status_code._401)
        }
    } catch (err) {
        next(new Error(err.message));
    }

});


module.exports=router