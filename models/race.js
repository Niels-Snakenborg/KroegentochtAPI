var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var raceSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    start_date: {type: String, required: true},
    current_cafe: {type: String, required: false},
    status: {type: String, required: true},
    creator: {type: String, required: true},
});


module.exports = mongoose.model('Race', raceSchema);
