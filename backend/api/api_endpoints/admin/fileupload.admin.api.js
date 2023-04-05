const express = require('express');

const successResponse = require('../../../helper/api_response/success_res')
const errorResponse = require('../../../helper/api_response/error_res');
const bucketHandler = require("../../../helper/s3Handlers/bucket")
const { uploadFolder } = require("../../../helper/s3Handlers/s3")
const RoomSchema = require("../../../models/rooms")
const status_code = require('../../../static_vars/server_code')
const { room_aggregate_single } = require("../../../helper/dbhelper/aggregate/rooms.aggregate")
const { eventname, emitter } = require('../../../events/action_event')
const { s3EventDict, s3EventEmitter } = require('../../../events/s3-event')
const router = express.Router();

router.get("/get_multipart_upload_urls", async (req, res, next) => {
    try {


        let { filePartCount, foldername, roomid, filename } = req.query;

        if (!filePartCount || !foldername || !roomid || !filename) {
            return new errorResponse(res, "Empty fields", status_code._500)
        }
        if (foldername === uploadFolder.ARCHIVE || foldername === uploadFolder.RENDER
            || foldername === uploadFolder.QC_RENDER || foldername === uploadFolder.QC_SCREENSHOT) { }
        else {
            return new errorResponse(res, "invalid room type", status_code._500)
        }
        const room = await RoomSchema.findById({ _id: roomid }).lean()
        if (!room) {
            return new errorResponse(res, "invalid room id", status_code._500)
        }
        const currentTime = new Date().getTime();
        // const fileN = currentTime + path.extname(file.originalname);
        const uniquefilename = currentTime + "_" + filename
        filePartCount = parseInt(filePartCount)
        const uploadId = await bucketHandler.initiateMultipartUpload(uniquefilename, foldername)
        const partUrls = await bucketHandler.generatePresignedUrlsParts(uniquefilename, foldername, uploadId, filePartCount)

        return new successResponse(res, { upload_urls: partUrls, uploadId: uploadId, filePartCount: filePartCount, filename: uniquefilename, foldername: foldername }, "Created")

    } catch (e) {
        return next(new Error(e.message));
    }
});



router.get("/abort_multipart_upload", async (req, res, next) => {
    try {


        let { uploadid, foldername, filename } = req.query;

        if (!uploadid || !foldername || !filename) {
            return new errorResponse(res, "Empty fields", status_code._500)
        }
        const abort = await bucketHandler.abortMultipartUpload(filename, foldername, uploadid)
        return new successResponse(res, { abort: abort }, "aborted")

    } catch (e) {
        return next(new Error(e.message));
    }
});


router.post("/multipart_upload_complete", async (req, res, next) => {
    try {
        const fileParts = req.body.fileParts
        const foldername = req.body.foldername
        const filename = req.body.filename
        const uploadid = req.body.uploadid
        const roomid = req.body.roomid

        if (!fileParts || !foldername || !filename || !uploadid || !roomid) {
            return new errorResponse(res, "Empty fields", status_code._500)
        }
        if (foldername === uploadFolder.ARCHIVE || foldername === uploadFolder.RENDER
            || foldername === uploadFolder.QC_RENDER || foldername === uploadFolder.QC_SCREENSHOT) { }
        else {
            return new errorResponse(res, "invalid room type", status_code._500)
        }
        const [room, roomPrev] = await Promise.all([
            RoomSchema.findById({ _id: roomid }).exec(),
            RoomSchema.findById({ _id: roomid }).lean()])
        if (!room) {
            return new errorResponse(res, "invalid room id", status_code._500)
        }

        const uploadProm = await bucketHandler.completeMultiUpload(filename, foldername, uploadid, fileParts)
        const fileS3Obj = []
        const fileUploaded = []
        const moveToTmpList = []
        console.log('upload', uploadProm)

        if (foldername === uploadFolder.ARCHIVE) {
            moveToTmpList.push({
                filename: room.archivename,
                foldername: uploadFolder.ARCHIVE
            })

            moveToTmpList.push({
                filename: room.protectedzip,
                foldername: uploadFolder.PROTECTED_ARCHIVE
            })


            room.archivename = filename
            room.ignoreZip = false
            room.isZipped = false
            room.lock = false
            room.lock_key = null
            room.error_zipping = null
            room.password = null
            fileS3Obj.push({ filename: filename, folder: uploadFolder.ARCHIVE })
            fileUploaded.push({
                filename: filename,
                uploadType: uploadFolder.ARCHIVE
            })

        }
        if (foldername === uploadFolder.RENDER) {
            moveToTmpList.push({
                filename: room.render,
                foldername: uploadFolder.RENDER
            })

            room.render = filename
            fileS3Obj.push({ filename: filename, folder: uploadFolder.RENDER })
            fileUploaded.push({
                filename: filename,
                uploadType: uploadFolder.RENDER
            })
        }
        if (foldername === uploadFolder.QC_RENDER) {
            moveToTmpList.push({
                filename: room.qc_render,
                foldername: uploadFolder.QC_RENDER
            })

            room.qc_render = filename
            fileS3Obj.push({ filename: filename, folder: uploadFolder.QC_RENDER })
            fileUploaded.push({
                filename: filename,
                uploadType: uploadFolder.QC_RENDER
            })
        }
        if (foldername === uploadFolder.QC_SCREENSHOT) {
            moveToTmpList.push({
                filename: room.qc_screenshot,
                foldername: uploadFolder.QC_SCREENSHOT
            })

            room.qc_screenshot = filename
            fileS3Obj.push({ filename: filename, folder: uploadFolder.QC_SCREENSHOT })
            fileUploaded.push({
                filename: filename,
                uploadType: uploadFolder.QC_SCREENSHOT
            })
        }

        await room.save()
        s3EventEmitter.emit(s3EventDict.MOVE, moveToTmpList)
        emitter.emit(eventname.upload, req, res, fileUploaded, room, roomPrev)
        const roomUpdated = await room_aggregate_single(RoomSchema, roomid)
        const finalroom = roomUpdated.length >= 1 ? roomUpdated[0] : null
        finalroom.s3URL = process.env.S3_BASE_URL
        return new successResponse(res, { room: finalroom }, "Updated")
    }
    catch (e) {
        return next(new Error(e.message));
    }
});

module.exports = router;