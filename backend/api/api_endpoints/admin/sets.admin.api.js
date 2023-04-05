const express = require('express');
const Users = require("../../../models/user");
const SetSchema = require("../../../models/sets");
const ActivitySchema = require("../../../models/activity");
const RoomSchema = require("../../../models/rooms");
const { set_aggregate, set_aggregate_single, projectFields } = require("../../../helper/dbhelper/aggregate/sets.aggregate");
const { activity_aggregate } = require("../../../helper/dbhelper/aggregate/activity.aggregate");

const successResponse = require('../../../helper/api_response/success_res')
const errorResponse = require('../../../helper/api_response/error_res');
const isStringEmpty = require('../../../helper/isStringEmpty');
const clearString = require('../../../helper/clearstring');
const router = express.Router();
const { eventname, emitter } = require('../../../events/action_event')

router.get('/', async (req, res, next) => {
    const page = (req.query.page || 1);
    const size = 36;
    const skip = size * (page - 1);
    let totalPage = 0;

    try {
        const [[{ paginatedResult, totalCount }]] = await Promise.all([
            set_aggregate(SetSchema, size, skip, populateSchema = 'team_members', localField = 'createdBy', projectFields())])
        const sets = paginatedResult
        if (totalCount.length > 0) {
            totalPage = Math.ceil(totalCount[0].totalCount / size)
        }
        return new successResponse(res, { totalCount: totalPage, sets: sets }, "Fetched")
    } catch (err) {
        return next(new Error(err.message));
    }
});


router.get('/:setID', async (req, res, next) => {
    try {
        const [set, activity] = await Promise.all([set_aggregate_single(SetSchema, req.params.setID),
        activity_aggregate(ActivitySchema, req.params.setID)
        ])
        return new successResponse(res, { set: set.length > 0 ? set[0] : null, activity: activity }, "Fetched")
    } catch (e) {
        return next(new Error(e.message));
    }
});



router.get('/list-all-rooms/:setID', async (req, res, next) => {
    try {
        const [rooms, setdetails] = await Promise.all([RoomSchema.find({ parentSet: req.params.setID }).sort({ roomID: 1 }).lean(), set_aggregate_single(SetSchema, req.params.setID),])

        return new successResponse(res, { rooms: rooms, setdetails: setdetails.length >= 1 ? setdetails[0] : null }, "Fetched")
    } catch (e) {
        return next(new Error(e.message));
    }
});

router.post('/', async (req, res, next) => {

    console.log(req.body.isactive)
    if (isStringEmpty(req.body.setid) || isStringEmpty(req.body.style)) {
        return next(new Error("these fields cant be empty [setid,style]"));
    }
    try {
        const sets = new SetSchema({
            setID: req.body.setid,
            style: req.body.style,
            uploadedBy: res.locals.user,
            createdBy: clearString(req.body.createdby) ? req.body.createdby : null,
            isQCDone: req.body.isqcdone ? true : false,
            isGLTFDone: req.body.isgltfdone ? true : false,
            isActive: req.body.isactive ? true : false,
            remarks: req.body.remarks
        });
        const set = await sets.save()
        return new successResponse(res, { set: set }, "Created")
    } catch (err) {
        return next(new Error(err.message));
    }
});



router.put('/', async (req, res, next) => {

    if (isStringEmpty(req.body.setid) || isStringEmpty(req.body.style)) {
        return next(new Error("these fields cant be empty [setid,style]"));
    }

    try {

        let sets, prevSets, setcheck, rooms, createdBy
        if (isStringEmpty(req.body.createdby)) {
            [sets, prevSets, setcheck, rooms] = await Promise.all([
                SetSchema.findOne({ _id: req.body._id }).exec(),
                SetSchema.findOne({ _id: req.body._id }).lean(),
                SetSchema.findOne({ setID: req.body.setid, _id: { $ne: req.body._id } }).lean(),
                RoomSchema.find({ setBelongsTo: req.body._id }).lean(),
            ])
        } else {
            [sets, prevSets, setcheck, rooms, createdBy] = await Promise.all([
                SetSchema.findOne({ _id: req.body._id }).exec(),
                SetSchema.findOne({ _id: req.body._id }).lean(),
                SetSchema.findOne({ setID: req.body.setid, _id: { $ne: req.body._id } }).lean(),
                RoomSchema.find({ setBelongsTo: req.body._id }).lean(),
                Users.findOne({ _id: req.body.createdby }).lean()
            ])
        }


        //check if other sets have the same id
        if (setcheck) {
            return next(new Error("duplicate set id[" + req.body.setid + "]"));
        }


        sets.setID = req.body.setid;
        sets.style = req.body.style;
        sets.lastModifiedBy = res.locals.user;
        sets.createdBy = createdBy ? createdBy._id : null;
        sets.isQCDone = req.body.isqcdone ? true : false;
        sets.isGLTFDone = req.body.isgltf ? true : false;
        sets.isActive = req.body.isactive ? true : false;
        sets.remarks = req.body.remarks ? req.body.remarks : null;


        if (JSON.stringify(prevSets) != JSON.stringify(sets)) {
            if (rooms.length !== 0) {

                if (prevSets.setID !== sets.setID) {
                    return next(new Error("Cant change folder name if it has rooms in it"));
                }
            }

            const aftersave = await sets.save()

            emitter.emit(eventname.modify, req, res, room = null, set = aftersave, prev = prevSets)

            const [setupdated, activity] = await Promise.all([set_aggregate_single(SetSchema, aftersave._id),
            activity_aggregate(ActivitySchema, aftersave._id)])
            return new successResponse(res, { set: setupdated.length > 0 ? setupdated[0] : null, activity: activity }, "Updated")
        } else {
            return next(new Error("nothing to update"))
        }


    } catch (err) {
        return next(new Error(err.message));
    }



})

module.exports = router;
