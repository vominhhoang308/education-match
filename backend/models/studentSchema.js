//this file is required in the db.js file

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

//defining a schema for teachers
var studentSchema = new mongoose.Schema({
    studentId: {type: Number, required: true},
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    title: { type: String },
    age: { type: Number, required: true, min: 5, max: 100 },
    summary: { type: String },
    hash: {type: String},
    salt: {type: String}
});

studentSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    this.save();
};

studentSchema.methods.validPassword = function(password){
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.hash === hash;    
};

studentSchema.methods.generateJwt = function(){
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
var Student = module.exports = mongoose.model('Student', studentSchema);

module.exports.createStudents = function(newUser, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

module.exports.getStudentByUsername = function(username, callback){
    var query = {"username": username};
    return Student.findOne(query, callback);
};

module.exports.getStudentByStudentId = function(studentId, callback){
    var query = {"studentId": studentId};
    return Student.findOne(query, callback);
};

module.exports.getStudentById = function(id, callback){
    Student.findById(id, callback);
};


