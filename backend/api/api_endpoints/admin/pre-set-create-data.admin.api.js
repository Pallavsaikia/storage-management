const express = require('express');
const successResponse=require('../../../helper/api_response/success_res')
const style = require("../../../static_vars/style-enum");
const UserSchema=require("../../../models/user")
const router = express.Router();
router.get('/', async (req, res, next) => {
  
    try {
        const users=await UserSchema.find({ role: "3d modeller" }).select("name").lean()
        var styleList=[]
        for(let i=0;i<style.length;i++){
            styleList.push({_id:style[i],name:style[i]})
        }
        users.push({_id:null,name:"others"})
        return new successResponse(res,{style:styleList,modellers:users},"Successfully Logged in")
    } catch (err) {
        return next(new Error(err.message));
    }
});



module.exports = router;
