const mongoose = require('mongoose');
const team_memberSchema =  mongoose.Schema(
    {
        empID: String,
        name: String,
        email: String,
        password: String,
        phone: String,
        work_hour: Number,
        assigned_hours: Number,
        eligibility: [],
        role: String,
        supervisor: String,
        isActive: {
            type: Boolean,
            default: false
        }
    },
    {
        // autoCreate: false,
        timestamps: true
     
    }
);
// await team_memberSchema.createCollection();

module.exports = mongoose.model('team_member', team_memberSchema);