const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: {type: String, unique: true},
    telegram:{
        user_id: {type: String, unique: true, required: true},
        first_name: {type: String},
        last_name: {type: String}
    },
    microcontrollers: [{type: mongoose.Schema.Types.ObjectId, required: false, ref: 'MicroController'}]
})

module.exports = mongoose.model('User', userSchema);