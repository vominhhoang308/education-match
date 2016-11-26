var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Student = mongoose.model('Student');
// var Teacher = mongoose.model('Teacher');

//defining a schema for courses
var courseSchema = new mongoose.Schema({
    teacher: {type: Number, ref: "Teacher", required:true},
    student: [{type: Number, ref: Student}],
    courseName: { type: String, required: true },
    category: { type: String },
    courseSummary: { type: String, required: true },
    requirement: { type: String },
    learningOutcome: { type: String, required: true },
    minimum: {type: Number, min:1, required: true},
    isClass: {type: Boolean, required: true}
});

//compiling the schema into a model
//mongodb collection name for this model will be "teachers"
var Course = module.exports = mongoose.model('Course', courseSchema);

module.exports.createCourse = function(newCourse, callback) {
    newCourse.save(callback)
}

module.exports.getCourseByCoursename = function(courseName, callback){
    var query = {courseName: courseName};
    Course.findOne(query, callback);
}

module.exports.getCourseById = function(id, callback){
    Course.findById(id, callback);
}