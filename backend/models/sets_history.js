const mongoose = require('mongoose');
const style = require("../static_vars/style-enum");
const SetHistorySchema = mongoose.Schema(
    {
        _originalID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'set_schema',
            required: true
        },
  
        previousVersion: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'set_history_schema',
            required: false,
            default: null
        },
        setID: {
            type: String,
            required: true
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


module.exports = mongoose.model('set_history_schema', SetHistorySchema);
