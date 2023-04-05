const express = require('express');
const successResponse=require('../../../helper/api_response/success_res')
const roomtype = require("../../../static_vars/roomtype");
const router = express.Router();


router.get('/', async (req, res, next) => {
  
    try {
        
        var roomtypelist=[]
        for(let i=0;i<roomtype.length;i++){
            roomtypelist.push({_id:roomtype[i],name:roomtype[i]})
        }

        return new successResponse(res,{roomtype:roomtypelist},"Fetched")
    } catch (err) {
        return next(new Error(err.message));
    }
});



module.exports = router;
