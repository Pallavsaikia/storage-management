const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId


function set_aggregate(schema, size, skip, populateSchema = null, localField = null, fields, foreignField = '_id') {
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


function set_aggregate_single(schema, id) {

    return schema.aggregate(
        [{ $match: { _id: ObjectId(id) } },
        { $lookup: { from: 'team_members', localField: 'createdBy', foreignField: '_id', as: 'createdBy' } },
        {
            $unwind: {
                path: '$' + 'createdBy',
                preserveNullAndEmptyArrays: true,
            },
        },

        { $lookup: { from: 'team_members', localField: 'uploadedBy', foreignField: '_id', as: 'uploadedBy' } },
        {
            $unwind: {
                path: '$' + 'uploadedBy',
                preserveNullAndEmptyArrays: true,
            },
        },

        {
            $project: {
                "_id": 1,
                "setID": 1,
                "style": 1,
                "isActive": 1,
                "isQCDone": 1,
                "isGLTFDone": 1,
                "remarks": 1,
                "createdAt":1,
                "uploadedBy._id": 1,
                "uploadedBy.name": 1,
                "createdBy._id": 1,
                "createdBy.name": 1


            }
        }]
    );


}



function projectFields(fields = null) {
    return fields != null ? { $project: fields } :
        {
            "_id": 1,
            "setID": 1,
            "style": 1,
            "isActive": 1,
            "isQCDone": 1,
            "isGLTFDone": 1,
            "remarks": 1,
            "uploadedBy.name": 1,
            "createdBy.name": 1


        }

}


module.exports = {
    set_aggregate, set_aggregate_single, projectFields,
}