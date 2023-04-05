const UserSchema = require("../models/user");
const jwt = require('jsonwebtoken');
const errorresponse = require('../helper/api_response/error_res')
const status_code = require('../static_vars/server_code')
const token_code = require('../static_vars/token_error_code')

module.exports = function (req, res, next) {
    const token = req.headers['authorization']

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, token_dict) => {
        if (err) {
            return new errorresponse(res, "Invalid Token", status_code._401, token_code.invalidtoken)
        } else {
            const user = await UserSchema.findOne({ _id: token_dict.id, isActive: true }).lean()
            if (user) {
                res.locals.user = token_dict.id;
                next();
            } else {
                return new errorresponse(res, "Invalid Token", status_code._401, token_code.invalidtoken)
            }

        }
    })

}