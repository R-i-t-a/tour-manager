const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    activities: {
        type: Array
    },
    launchDate: {
        type: Date,
        default: Date.now
    },
    stops: [{
        _id: false,
        location: {
            city: { type: String },
            state: { type: String },
            zip: { type: Number }
        },
        weather: {
            windDir: { type: String },
            sunrise: { type: String }
        },
        attendance: { type: Number, min: 0 }
    }]
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
