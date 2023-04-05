const mongoose = require('mongoose');
const style = require("../static_vars/style-enum");
const SetSchema = mongoose.Schema(
    {
        setID: {
            type: String,
            unique: true,
            required: true
        },
        previousVersion: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'set_history_schema',
            required: false,
            default: null
        },
        style: {
            type: String,
            enum: style,
            required: true
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'team_member',
            required: true
        },
        lastModifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'team_member',
            required: false
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'team_member',
            required: false,
            default: null
        },
        isQCDone: {
            type: Boolean,
            default: false
        },
        isGLTFDone: {
            type: Boolean,
            default: false
        },
        isActive: {
            type: Boolean,
            default: false
        },
        remarks: {
            type: String,
            required: false
        }

    },
    {
        timestamps: true
    }
);


module.exports = mongoose.model('set_schema', SetSchema);
