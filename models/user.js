var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

var userSchema = new Schema({
    username: {type: String, required: true, min: 2, max: 10},
    password: {type: String, required: true, min: 5},
    role: {type: String, required: true}
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.isInRole = function(role){
    return this.role == role
}

module.exports = mongoose.model('User', userSchema);
