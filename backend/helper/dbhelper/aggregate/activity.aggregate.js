const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId


function activity_aggregate(schema, id) {

    return schema.aggregate(
        [{ $match: { setID: ObjectId(id) } },
        { $sort: { createdAt: -1 } },
        { $lookup: { from: 'team_members', localField: 'actor', foreignField: '_id', as: 'actor' } },
        {
            $unwind: {
                path: '$' + 'actor',
                preserveNullAndEmptyArrays: true,
            },
        },
        { $lookup: { from: 'room_schemas', localField: 'room', foreignField: '_id', as: 'room' } },
        {
            $unwind: {
                path: '$' + 'room',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $project: {
                "_id": 1,
                "room._id": 1,
                "room.roomID": 1,
                "level":1,
                "actor._id": 1,
                "actor.name": 1,
                "action": 1,
                "createdAt": 1,
                "upload":1,
                "deletedObj":1
            }
        },
        { $limit: 10 },
        ]
    );


}

function activity_room_aggregate(schema, id) {

    return schema.aggregate(
        [{ $match: { room: ObjectId(id) } },
        { $sort: { createdAt: -1 } },
        { $lookup: { from: 'team_members', localField: 'actor', foreignField: '_id', as: 'actor' } },
        {
            $unwind: {
                path: '$' + 'actor',
                preserveNullAndEmptyArrays: true,
            },
        },
        { $lookup: { from: 'room_schemas', localField: 'room', foreignField: '_id', as: 'room' } },
        {
            $unwind: {
                path: '$' + 'room',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $project: {
                "_id": 1,
                "room._id": 1,
                "room.roomID": 1,
                "level":1,
                "actor._id": 1,
                "actor.name": 1,
                "action": 1,
                "createdAt": 1,
                "upload":1,
                "deletedObj":1

            }
        },
        { $limit: 10 },
        ]
    );


}


function projectActivityFields(fields = null) {
    return fields != null ? { $project: fields } :
        {
            "_id": 1,
                "room._id": 1,
                "room.roomID": 1,
                "level":1,
                "actor._id": 1,
                "actor.name": 1,
                "action": 1,
                "createdAt": 1,
                "upload":1,
                "deletedObj":1
        }

}


module.exports = {
    activity_aggregate, activity_room_aggregate,projectActivityFields,
}