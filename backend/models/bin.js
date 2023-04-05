const mongoose = require('mongoose');
const roomtype=require('../static_vars/roomtype')
const binSchema = mongoose.Schema(
    {
        _originalID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'room_schema',
            required: true
        },
        roomID: {
            type: String,
            unique: false,
            required: false
        },
        roomtype: {
            type: String,
            enum: roomtype,
            required: true
        },
        parentSet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'set_schema',
            required: false
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'team_member',
            required: false,
            default: null
        },
        isActive: {
            type: Boolean,
            default: true
        },
        isZipped: {
            type: Boolean,
            default: false
        },
        ignoreZip: {
            type: Boolean,
            default: false
        },
        archivename: {
            type: String,
            required: false,
        },
        protectedzip: {
            type: String,
            required: false,
        },
        render: {
            type: String,
            required: false
        },
        qc_render: {
            type: String,
            required: false,
        },
        qc_screenshot: {
            type: String,
            required: false,
        },
        error_zipping: {
            type: String,
            required: false,
        },
        password: {
            type: String,
            required: false
        },
        lock: {
            type: Boolean,
            required: false,
            default: false
        },
        lock_key: {
            type: String,
            required: false,
            default: null
        },
        deletedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'team_member',
            required: true
        },


    },
    {
        timestamps: true
    }
);


module.exports = mongoose.model('recycle_bin', binSchema);