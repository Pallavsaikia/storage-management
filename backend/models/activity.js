const mongoose = require('mongoose');
const actions = require("../static_vars/actions");
const activityLevels = require("../static_vars/activity_levels");
const uploadtype_enum=require("../static_vars/upload_folder")
const ActivitySchema = mongoose.Schema(
    {


        setID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'set_schema',
            required: false,
            default: null
        },
        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'room_schema',
            required: false,
            default: null
        },
        level: {
            type: String,
            enum: activityLevels,
            required: true
        },
        bin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'recycle_bin',
            required: false,
            default: null
        },

        actor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'team_member',
            required: false
        },
        action: {
            type: String,
            enum: actions,
            required: true
        },
        upload: [{
            filename: {
                type: String,
                required: false
            },
            uploadType: {
                type: String,
                enum: uploadtype_enum,
                required: false
            },
        }],
        deletedObj: {
            name: {
                type: String,
                required: false,
            },
            required: false,
        },
        sethistory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'set_history_schema',
            required: false,
            default: null,
        },
        roomhistory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'room_history_schema',
            required: false,
            default: null,
        },

    },
    {
        timestamps: true
    }
);


module.exports = mongoose.model('activity_schema', ActivitySchema);