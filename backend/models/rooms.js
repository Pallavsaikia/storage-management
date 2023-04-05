const mongoose = require('mongoose');
const roomtype = require('../static_vars/roomtype')
const RoomSchema = mongoose.Schema(
    {
        roomID: {
            type: String,
            unique: true,
            required: true
        },
        previousVersion: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'room_history_schema',
            required: false,
            default: null
        },
        roomtype: {
            type: String,
            enum: roomtype,
            required: true
        },
        parentSet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'set_schema',
            required: true
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
            default: null
        },
        protectedzip: {
            type: String,
            required: false,
            default: null
        },
        render: {
            type: String,
            required: false,
            default: null
        },
        qc_render: {
            type: String,
            required: false,
            default: null
        },
        qc_screenshot: {
            type: String,
            required: false,
            default: null
        },
        error_zipping: {
            type: String,
            required: false,
            default: null
        },
        password: {
            type: String,
            required: false,
            default: null
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
        }

    },
    {
        timestamps: true
    }
);


module.exports = mongoose.model('room_schema', RoomSchema);