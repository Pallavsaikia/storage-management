const UserSchema = require("../models/user");

module.exports = async function (req, res, next) {
    console.log(req.session.user);

    if (req.session.user) {
        try {
            const user = await UserSchema.findOne({ _id: req.session.user, isActive: true }).lean()
            if (user) {
                res.locals.user = user.name;
                res.locals.role = user.role;
                next();
            } else {
                console.log("Second function call : ", user);
                res.redirect("/logout");
            }

        } catch {
            res.redirect("/login");
        }

    } else {
        res.redirect("/login");
    }

}