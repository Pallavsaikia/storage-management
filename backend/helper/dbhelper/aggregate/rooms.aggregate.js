const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId


function room_aggregate(schema, size, skip, populateSchema = null, localField = null, fields, foreignField = '_id') {
    if (populateSchema) {
        return schema.aggregate([{
            $facet: {
                paginatedResult: [
                    { $sort: { createdAt: -1 } },
                    { $match: {} },

                    {

                        $project: fields

                    }
                    ,

                    { $skip: skip },
                    { $limit: size }
                ],
                totalCount: [
                    { $match: {} },
                    { $count: 'totalCount' }
                ]
            }
        }])
    } else {
        return schema.aggregate([{
            $facet: {
                paginatedResult: [
                    { $match: {} },
                    { $skip: skip },
                    { $limit: size }
                ],
                totalCount: [
                    { $match: {} },
                    { $count: 'totalCount' }
                ]
            }
        }])
    }

}


function room_aggregate_single(schema, id) {

    return schema.aggregate(
        [{ $match: { _id: ObjectId(id) } },
        { $lookup: { from: 'team_members', localField: 'createdBy', foreignField: '_id', as: 'createdBy' } },
        {
            $unwind: {
                path: '$' + 'createdBy',
                preserveNullAndEmptyArrays: true,
            },
        },

        { $lookup: { from: 'set_schemas', localField: 'parentSet', foreignField: '_id', as: 'parentSet' } },
        {
            $unwind: {
                path: '$' + 'parentSet',
                preserveNullAndEmptyArrays: true,
            },
        },

        {
            $project: {
                "_id": 1,
                "roomID": 1,
                "roomtype": 1,
                "parentSet.setID": 1,
                "parentSet._id": 1,
                "createdBy.name": 1,
                "isActive": 1,
                "isZipped": 1,
                "ignoreZip": 1,
                "archivename": 1,
                "render": 1,
                "qc_render": 1,
                "qc_screenshot": 1,
                "qc_render": 1,
                "error_zipping": 1,
                "createdAt":1,


            }
        }]
    );


}



function projectFields(fields = null) {
    return fields != null ? { $project: fields } :
        {
            "_id": 1,
                "roomID": 1,
                "roomtype": 1,
                "parentSet.setID": 1,
                "parentSet._id": 1,
                "createdBy.name": 1,
                "isActive": 1,
                "isZipped": 1,
                "ignoreZip": 1,
                "archivename": 1,
                "render": 1,
                "qc_render": 1,
                "qc_screenshot": 1,
                "qc_render": 1,
                "error_zipping": 1,
        }

}


module.exports = {
    room_aggregate_single, room_aggregate, projectFields,
}