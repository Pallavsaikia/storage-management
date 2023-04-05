const express = require('express');
const UserSchema = require("../../../models/user");
const ActivitySchema = require("../../../models/activity");
const RoomSchema = require("../../../models/rooms");
const successResponse = require('../../../helper/api_response/success_res')
const errorResponse = require('../../../helper/api_response/error_res');
const isStringEmpty = require('../../../helper/isStringEmpty');
const status_code = require('../../../static_vars/server_code')
const router = express.Router();
const { eventname, emitter } = require('../../../events/action_event')
const { s3EventDict, s3EventEmitter } = require('../../../events/s3-event')
const uploadFolder = require("../../../static_vars/upload_folder_dict")





router.post('/', async (req, res, next) => {
    const roomid = req.body.roomid
    const password = req.body.password
    if (isStringEmpty(roomid) || isStringEmpty(password)) {
        return new errorResponse(res, "Something went wrong", status_code._500)
    }

    try {
        const [room, user] = await Promise.all([RoomSchema.findById({ _id: roomid }).lean(),
        UserSchema.findOne({ _id: res.locals.user, password: password, isActive: true }).lean()
        ])
        if (!room || !user) {
            return new errorResponse(res, "Something went wrong", status_code._500)
        } else {
            await RoomSchema.findByIdAndDelete(roomid).lean()
            const moveToRecycleBinList = []
            moveToRecycleBinList.push({
                filename: room.render,
                foldername: uploadFolder.RENDER
            })
            moveToRecycleBinList.push({
                filename: room.archivename,
                foldername: uploadFolder.ARCHIVE
            })
            moveToRecycleBinList.push({
                filename: room.protectedzip,
                foldername: uploadFolder.PROTECTED_ARCHIVE
            })
            moveToRecycleBinList.push({
                filename: room.qc_render,
                foldername: uploadFolder.QC_RENDER
            })
            moveToRecycleBinList.push({
                filename: room.qc_screenshot,
                foldername: uploadFolder.QC_SCREENSHOT
            })
            s3EventEmitter.emit(s3EventDict.DELETE, moveToRecycleBinList)
            emitter.emit(eventname.delete, req, res, room)
            return new successResponse(res, null, "Successfully Deleted")

        }
    } catch (e) {
        return next(new Error("Something went wrong"));
    }
});



module.exports = router;
