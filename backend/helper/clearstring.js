const isStringEmpty = require("./isStringEmpty")

module.exports = function (str) {
   
    return isStringEmpty(str) ? null : str
}