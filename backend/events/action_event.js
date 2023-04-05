
const events = require('events');

const actionStrings = require("../static_vars/action_strings")
const activityLevelsDict = require("../static_vars/activity_levels_dict");
const eventEmitter = new events.EventEmitter();
// global.eventEmitter = new events.EventEmitter();
const activitySchema = require('../models/activity')
const binSchema = require("../models/bin");
const setHistorySchema = require("../models/sets_history");
const roomHistorySchema = require("../models/rooms_history");

eventEmitter.on(actionStrings.add, async function (req, res, room) {
    try {
        let roomHistory
        if (!room) {
            return
        }

        new activitySchema({
            bin: null,
            actor: res.locals.user,
            action: actionStrings.add,
            level: activityLevelsDict.room,
            setID: room.parentSet,
            room: room._id,
            sethistory: null,
            roomhistory: null

        }).save()

    } catch (e) { console.log(e) }
});

/**
 * on delete room event
 * move room data to bin
 * after duplicating  room data add to activity
 */
eventEmitter.on(actionStrings.delete, async function (req, res, room) {
    const bin = new binSchema({
        _originalID: room._id,
        roomID: room.roomID,
        roomtype: room.roomtype,
        parentSet: room.parentSet,
        createdBy: room.createdBy,
        isActive: room.isActive,
        isZipped: room.isZipped,
        ignoreZip: room.ignoreZip,
        archivename: room.archivename,
        protectedzip: room.protectedzip,
        render: room.render,
        qc_render: room.qc_render,
        qc_screenshot: room.qc_screenshot,
        error_zipping: room.error_zipping,
        password: room.password,
        lock: room.lock,
        lock_key: room.lock_key,
        deletedBy: res.locals.user
    })
    try {
        const binDoc = await bin.save()
        const activity = new activitySchema({
            setID: room.parentSet,
            room: room._id,
            level: activityLevelsDict.room,
            bin: binDoc._id,
            actor: res.locals.user,
            action: actionStrings.delete,
            upload: [],
            deletedObj: {
                name: room.roomID,
            },
            sethistory: null,
            roomhistory: null,
        })
        await activity.save()
    } catch (e) {
        console.log(e)
    }





});

eventEmitter.on(actionStrings.modify, async function (req, res, room = null, set = null, prev = null) {
    try {
        let setHistory = null
        let roomHistory = null
        if (set) {

            setHistory = await setHistorySchema({
                _originalID: set,
                previousVersion: set.previousVersion,
                setID: prev.setID,
                style: prev.style,
                uploadedBy: prev.uploadedBy,
                lastModifiedBy: prev.lastModifiedBy,
                createdBy: prev.createdBy,
                isQCDone: prev.isQCDone,
                isGLTFDone: prev.isGLTFDone,
                isActive: prev.isActive,
                remarks: prev.remarks
            }).save();
        }
        set.previousVersion = setHistory._id
        await set.save()

        new activitySchema({
            bin: null,
            actor: res.locals.user,
            action: actionStrings.modify,
            level: activityLevelsDict.sets,
            setID: set._id,
            sethistory: setHistory,
            roomhistory: roomHistory


        }).save()

    } catch (e) { console.log(e) }
});

eventEmitter.on(actionStrings.upload, async function (req, res, fileUploaded, room, roomPrev) {

    try {
        let roomHistory
        if (!room) {
            return
        }
        if (room) {
            roomHistory = await roomHistorySchema({
                _originalID: roomPrev._id,
                roomID: roomPrev.roomID,
                roomtype: roomPrev.roomtype,
                previousVersion: roomPrev.previousVersion,
                parentSet: roomPrev.parentSet,
                createdBy: roomPrev.createdBy,
                isActive: roomPrev.isActive,
                isZipped: roomPrev.isZipped,
                ignoreZip: roomPrev.ignoreZip,
                archivename: roomPrev.archivename,
                protectedzip: roomPrev.protectedzip,
                render: roomPrev.render,
                qc_render: roomPrev.qc_render,
                qc_screenshot: roomPrev.qc_screenshot,
                error_zipping: roomPrev.error_zipping,
                password: roomPrev.password,
                lock: roomPrev.lock,
                lock_key: roomPrev.lock_key
            }).save();
            room.previousVersion = roomHistory._id
            await room.save()
        }
        const activityS = new activitySchema({
            setID: room.parentSet,
            room: room._id,
            level: activityLevelsDict.room,
            bin: null,
            actor: res.locals.user,
            action: actionStrings.upload,
            upload: fileUploaded,
            deletedObj: null,
            sethistory: null,
            roomhistory: roomHistory._id,
        })
        await activityS.save()

    } catch (e) { console.log(e) }
});

module.exports = { eventname: actionStrings, emitter: eventEmitter }