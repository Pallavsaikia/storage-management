const express = require('express');

const router = express.Router();
const successResponse = require('../../../helper/api_response/success_res')
const errorResponse = require('../../../helper/api_response/error_res')
const roomSchema = require('../../../models/rooms')
const status_code = require('../../../static_vars/server_code');
const { getDownLoadURl, getFileMeta } = require('../../../helper/s3Handlers/bucket')
const { uploadFolder } = require('../../../helper/s3Handlers/s3')
const { s3EventDict, s3EventEmitter } = require('../../../events/s3-event')
router.get('/', async (req, res, next) => {
    const roomid = req.query.roomid
    const send_url = req.query.send_url ? req.query.send_url : true
    try {
        const room = await roomSchema.findById(roomid).select('password _id protectedzip').lean()
        let url, metadata
        console.log(send_url)
        if (send_url === true) {
            [url, metadata] = await Promise.all([
                getDownLoadURl(uploadFolder.ARCHIVE, room.protectedzip),
                getFileMeta(uploadFolder.ARCHIVE, room.protectedzip)])
        } else {
            metadata = await getFileMeta(uploadFolder.ARCHIVE, room.protectedzip)
        }
        if (room) {
            s3EventEmitter.emit(s3EventDict.GET, res, room.protectedzip, true)
            return new successResponse(res, { _id: room._id, password: room.password, filesize: metadata.ContentLength, protectedzip: room.protectedzip, url: url ? url : null }, "Fetched")
        }
        return new errorResponse(res, 'invalid id', status_code._500)
    } catch (e) {
        return new errorResponse(res, e.message, status_code._500)
    }
});



module.exports = router