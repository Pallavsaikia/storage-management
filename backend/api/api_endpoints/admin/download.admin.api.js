const express = require('express');
const router = express.Router();
const { getDownLoadURl } = require('../../../helper/s3Handlers/bucket')
const { uploadFolder } = require('../../../helper/s3Handlers/s3')
const { s3EventDict, s3EventEmitter } = require('../../../events/s3-event')
const successResponse = require('../../../helper/api_response/success_res')
const errorResponse = require('../../../helper/api_response/error_res');
const status_code = require('../../../static_vars/server_code')


router.get('/:foldername/:filename', async (req, res, next) => {
    const filename = req.params.filename
    const foldername = req.params.foldername
    if (foldername === uploadFolder.ARCHIVE || foldername === uploadFolder.RENDER
        || foldername === uploadFolder.QC_RENDER || foldername === uploadFolder.QC_SCREENSHOT) { }
    else {
        return new errorResponse(res, "invalid foldername", status_code._500)
    }


    try {
        const url = await getDownLoadURl(foldername, filename)
       

        if (foldername === uploadFolder.ARCHIVE) {
            s3EventEmitter.emit(s3EventDict.GET, res,  filename,false)
        }
        return new successResponse(res, { url: url }, "fetched")

    } catch (err) {
        return next(new Error(err));
    }

});




module.exports = router;
