const express = require('express');
const router = express.Router();
const successResponse = require('../../../helper/api_response/success_res')
const errorResponse = require('../../../helper/api_response/error_res')
const roomSchema = require('../../../models/rooms')
const status_code = require('../../../static_vars/server_code')

function getRooms() {
    return roomSchema.aggregate([{
        $facet: {
            rooms: [
                {
                    $lookup: {
                        from: 'set_schemas', localField: 'parentSet', foreignField: '_id', as: 'parentSet',
                        pipeline: [
                            {
                                "$project": {
                                    "_id": 1,
                                    "setID": 1,
                                    "style": 1,
                                    "isActive": 1,

                                }
                            },
                        ]


                    },

                },
                { $match: { "isZipped": true, "parentSet.isActive": true ,"render":{$exists:true} } },
                {
                    $unwind: {
                        path: '$parentSet',
                        preserveNullAndEmptyArrays: true,

                    }
                },
                {

                    $project: {
                        "_id": 1,
                        "roomID": 1,
                        "parentSet": 1,
                        "render": 1,
                        "protectedzip": 1,
                        "roomtype": 1
                    }
                },

                { $sort: { roomID: 1 } }
            ]
        }
    }])
}

router.get('/', async (req, res, next) => {
    try {
        const [rooms] = await getRooms()
        return new successResponse(res, {rooms:rooms.rooms,s3url:process.env.S3_BASE_URL}, "Fetched")
    } catch (e) {
        return new errorResponse(res, "Server Error", status_code._500)
    }
});



module.exports = router