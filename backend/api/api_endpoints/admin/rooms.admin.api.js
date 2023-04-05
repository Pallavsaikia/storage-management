const express = require('express');
const SetSchema = require("../../../models/sets");
const ActivitySchema = require("../../../models/activity");
const RoomSchema = require("../../../models/rooms");
const roomtype = require("../../../static_vars/roomtype");
const successResponse = require('../../../helper/api_response/success_res')
const errorResponse = require('../../../helper/api_response/error_res');
const isStringEmpty = require('../../../helper/isStringEmpty');
const router = express.Router();
const status_code = require('../../../static_vars/server_code')
const newRoomId = require('../../../helper/roomid-creator')

const { activity_room_aggregate } = require("../../../helper/dbhelper/aggregate/activity.aggregate");
const { room_aggregate_single } = require("../../../helper/dbhelper/aggregate/rooms.aggregate");
const { eventname, emitter } = require('../../../events/action_event')
const { fileTokenGen } = require('../../../helper/jwtexpiry')

router.get('/', async (req, res, next) => {

});


router.get('/:id', async (req, res, next) => {
    try {
        const [room, activity] = await Promise.all([room_aggregate_single(RoomSchema, req.params.id),
        activity_room_aggregate(ActivitySchema, req.params.id)
        ])
        const roomFetched = room.length >= 1 ? room[0] : null
        if (roomFetched) {
            const tmptoken = fileTokenGen(res.locals.user)
            roomFetched.token = tmptoken

        }
        roomFetched.s3URL = process.env.S3_BASE_URL
        return new successResponse(res, { room: roomFetched, activity: activity }, "Fetched")
    } catch (e) {
        return next(new Error(e.message));
    }
});

router.post('/', async (req, res, next) => {
    try {
        const roomT = req.body.roomtype
        const setid = req.body.setid
        if ((roomtype.indexOf(roomT) > -1)) { } else {
            return new errorResponse(res, "Invalid Room Type", status_code._500)
        }
        if (isStringEmpty(setid)) {
            return new errorResponse(res, "Invalid set id", status_code._500)
        }
        const [roomlist, set] = await Promise.all([
            RoomSchema.find({ roomtype: roomT, parentSet: setid }).lean(),
            SetSchema.findById({ _id: setid }).lean()
        ])
        if (!set) {
            return new errorResponse(res, "Invalid set id", status_code._500)
        }
        const roomid = newRoomId(set.setID, roomlist, roomT)
        const room = await new RoomSchema({
            parentSet: set._id,
            roomtype: roomT,
            roomID: roomid,
            createdBy: res.locals.user
        }).save()
        emitter.emit(eventname.add, req, res, room)
        return new successResponse(res, { room: room }, "Created")
    } catch (e) {
        return next(new Error(e.message));
    }
});




module.exports = router;
