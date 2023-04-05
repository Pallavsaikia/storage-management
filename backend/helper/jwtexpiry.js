const jwt = require('jsonwebtoken')


function jwtExpirytime(time = 900000) {//expiry in 15 minutes
    return milliseconds = new Date().getTime() + time
}

function createNewAccessToken(user) {
    return jwt.sign({ id: user._id, email: user.email, role: user.role, empID: user.empID, name: user.name, exp: jwtExpirytime() }, process.env.JWT_SECRET_KEY)
}

function createNewRefreshToken(user) {
    return jwt.sign({ id: user._id, tokentype: "refresh", exp: jwtExpirytime(7889400000) }, process.env.JWT_SECRET_KEY)
}


function fileTokenGen(user) {
    return jwt.sign({ id: user._id, tokentype: "file", exp: jwtExpirytime(600000)}, process.env.JWT_FILE_SECRET_KEY)
}
module.exports = { jwtExpirytime, createNewAccessToken, createNewRefreshToken, fileTokenGen}


