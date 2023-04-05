module.exports = function (schema, size, skip, populateSchema = null, localField = null, foreignField = '_id') {
    if (populateSchema) {
        return schema.aggregate([{
            $facet: {
                paginatedResult: [
                    { $match: {} },
                    { $lookup: { from: populateSchema, localField: localField, foreignField: foreignField, as: localField } },

                    {
                        $unwind: {
                            path: '$' + localField,
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    { $sort: { createdAt: -1 } },
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
