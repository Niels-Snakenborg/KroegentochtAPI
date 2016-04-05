var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var waypointSchema = new Schema({
    name: {type: String, required: true},
    lat: {type: String, required: true},
    long: {type: String, required: true},
    place_id: {type: String, required: true},
    adress: {type: String, required: true},
    website: {type: String, required: false},
    race: {type: String, required: true}
});

module.exports = mongoose.model('Waypoint', waypointSchema);
