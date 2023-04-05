const express = require('express');
const SetSchema = require("../../../models/sets");
const RoomSchema = require("../../../models/rooms");
const successResponse = require('../../../helper/api_response/success_res')
const errorResponse = require('../../../helper/api_response/error_res');
const isStringEmpty = require('../../../helper/isStringEmpty');
const status_code = require('../../../static_vars/server_code')
const router = express.Router();
const { eventname, emitter } = require('../../../events/action_event')






router.get('/:searchstr', async (req, res, next) => {
    const searchstr = req.params.searchstr
    if (isStringEmpty(searchstr)) {
        return new successResponse(res, { search: [] }, "Fetched")
    }

    try {
        const [room, sets] = await Promise.all([RoomSchema.find({ roomID: { $regex: '.*' + searchstr + '.*' } }).limit(3).lean(),
        SetSchema.find({ setID: { $regex: '.*' + searchstr + '.*' } }).limit(3).lean()
        ])

        const searchResult = []
        for (var i = 0; i < room.length; i++) {
            searchResult.push({ _id: room[i]._id, type: 'room', name: room[i].roomID })
        }

        for (var i = 0; i < sets.length; i++) {
            searchResult.push({ _id: sets[i]._id, type: 'sets', name: sets[i].setID })
        }

        return new successResponse(res, { search: searchResult, searchstring: searchstr }, "Fetched")
    } catch (e) {
        return next(new Error("Something went wrong"));
    }
});



module.exports = router;
