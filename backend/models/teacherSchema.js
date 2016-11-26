//this file is required in the db.js file

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Course = mongoose.model("Course");
var Schema = mongoose.Schema;
var crypto = require('crypto');
var jwt = require('jsonwebtoken');


//defining a schema for teachers
var teacherSchema = new mongoose.Schema({
    teacherId: {type:Number, required: true},
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    title: { type: String },
    location: { type: String },
    summary: { type: String, required: true },
    experience: { type: String, required: true },
    rating: { type: Number, min: 0, max: 5 },
    courses: [{type: Schema.Types.ObjectId, ref: Course}],
    hash: {type: String},
    salt: {type: String}
});

teacherSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    this.save();
};

teacherSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.hash === hash;
};

teacherSchema.methods.generateJwt = function(){
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7); // token is saved for 7 days

    return jwt.sign({
        _id : this._id,
        email: this.email,
        name: this.username,
        exp: parseInt(expiry.getTime() / 1000)
    }, process.env.JWT_SECRET);
};


//compiling the schema into a model
//mongodb collection name for this model will be "teachers"
var Teacher = module.exports = mongoose.model('Teacher', teacherSchema);

module.exports.createTeachers = function(newUser, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.passwrod = hash;
            newUser.save(callback);
        });
    });
};

module.exports.getTeacherByUsername = function(username, callback){
	var query = {username: username};
	Teacher.findOne(query, callback);
};

module.exports.getTeacherByTeacherId = function(teacherId, callback){
    var query = {"teacherId" : teacherId};
	Teacher.findOne(query, callback);
};

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
};