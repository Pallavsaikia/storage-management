
const events = require('events');
const s3EventEmitter = new events.EventEmitter();
// global.s3EventEmitter = new events.EventEmitter();
const s3EventDict = require('../static_vars/s3_action_dict')
const counterSchema = require('../models/downloadcounter')
const RoomSchema = require('../models/rooms')
const s3BucketHandler = require('../helper/s3Handlers/bucket')
const uploadFolder = require('../static_vars/upload_folder_dict')

s3EventEmitter.on(s3EventDict.GET, async function (res, filename, isZipped) {
    try {
        const room = await RoomSchema.findOne({ archivename: filename }).lean()
        if (room) {
            await new counterSchema({
                downloadedBy: res.locals.user,
                roomid: room._id,
                filename: filename,
                isFileZipped: isZipped
            }).save()
        }
    } catch (err) {

    }
});

s3EventEmitter.on(s3EventDict.DELETE, async function (moveToRecycleBinList) {
    try {
        for (let i = 0; i < moveToRecycleBinList.length; i++) {
            if (moveToRecycleBinList[i].filename !== null) {
                if (moveToRecycleBinList[i].foldername === uploadFolder.PROTECTED_ARCHIVE) {
                    await s3BucketHandler.deleteFile(moveToRecycleBinList[i].filename, moveToRecycleBinList[i].foldername)
                } else {
                    await s3BucketHandler.copyFile(moveToRecycleBinList[i].filename, moveToRecycleBinList[i].foldername, uploadFolder.RECYCLE_BIN)
                    await s3BucketHandler.deleteFile(moveToRecycleBinList[i].filename, moveToRecycleBinList[i].foldername)
                }
            }
        }
    } catch (err) {
        console.log(err)
    }
});

s3EventEmitter.on(s3EventDict.MOVE, async function (moveToTmpList) {
    try {
        for (let i = 0; i < moveToTmpList.length; i++) {
            if (moveToTmpList[i].filename !== null) {
                if (moveToTmpList[i].foldername === uploadFolder.PROTECTED_ARCHIVE) {
                    await s3BucketHandler.deleteFile(moveToTmpList[i].filename, moveToTmpList[i].foldername)
                } else {
                    await s3BucketHandler.copyFile(moveToTmpList[i].filename, moveToTmpList[i].foldername, uploadFolder.TMP)
                    await s3BucketHandler.deleteFile(moveToTmpList[i].filename, moveToTmpList[i].foldername)
                }
            }
        }
    } catch (err) {
        console.log(err)
    }
});

module.exports = { s3EventDict: s3EventDict, s3EventEmitter: s3EventEmitter }