const mongoose = require('mongoose');

const microControllerSchema = mongoose.Schema({
    //_id: {type: Number, required: true},
    mac_address: {type: String, required: true},
    location: {type: String, default: '-'},
    users: [{type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User'}],
    sensors: [{
        _id: false,
        type: {type: String, required: true},
        watering_threshold : {
            max: {type: Number, default: 100},
            min: {type: Number, default: 0},
        },
        readings: [{
            _id: false,
            time: {type: String, required: true},
            value: {type: String, required: true}
        }]
    }],
});

module.exports = mongoose.model('MicroController', microControllerSchema);