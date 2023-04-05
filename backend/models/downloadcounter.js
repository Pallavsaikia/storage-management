const mongoose = require('mongoose');
const DownloadCounterSchema = mongoose.Schema(
    {
        downloadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'team_member',
            required: true
        },
        roomid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'room_schema',
            required: true
        },
        isFileZipped: {
            type: Boolean,
            default:false
        },
        filename: {
            type: String,
            required: false
        }

    },
    {
        timestamps: true
    }
);


module.exports = mongoose.model('download_track_schema', DownloadCounterSchema);