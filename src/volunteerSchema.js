const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    }
});

const Volunteer = mongoose.model("Volunteer",volunteerSchema);
module.exports=Volunteer;
