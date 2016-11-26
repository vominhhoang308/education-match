var mongoose = require('mongoose');
var t = mongoose.model('Teacher');
var c = mongoose.model('Course');
var s = mongoose.model('Student');

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

// Create Course Handler
module.exports.createCourseHandler = function(req,res){
	var courseName = req.body.courseName;
	var category = req.body.category;
	var courseSummary = req.body.courseSummary;
	var requirement = req.body.requirement;
	var learningOutcome = req.body.learningOutcome;
	var teacher = req.params.teacherid;
	var minimum = req.body.minimum;

	req.checkBody('courseName', 'courseName is required').notEmpty();
	req.checkBody('courseSummary', 'courseSummary is required').notEmpty();
	req.checkBody('learningOutcome', 'learningOutcome is required').notEmpty();
	req.checkBody('minimum', 'minimum of students is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		sendJsonResponse(res, 404, errors);
	} else {
		var newCourse = new c({
			courseName: courseName,
			category: category,
			courseSummary: courseSummary,
			requirement: requirement,
			learningOutcome: learningOutcome,
			teacher: teacher,
			student: [],
			minimum: minimum,
			isClass: false
		});

		t.getTeacherByTeacherId(teacher, function(err, teacher) {
			if (err) {sendJsonResponse(res, 404, err);}
			teacher.courses.push(newCourse);
			teacher.save();
		});

		c.createCourse(newCourse, function(err, course){
			if (err) {sendJsonResponse(res, 404, err);}
		});

		sendJsonResponse(res, 201, newCourse)
	}
};

// Getting Courses Handler
module.exports.getCourseHandler = function (req,res){
	if(req.params && req.params.courseid) {
		c.findById(req.params.courseid).exec(function(err, course) {
		        	if(!course) {
			        	sendJsonResponse(res, 404, {
			        		"message": "couseid not found"
			        	});
		        		return;
		    	} else if(err) {
		    		sendJsonResponse(res, 404, err);
		    		return;
		   	}
		    	sendJsonResponse(res, 200, course);
	   	});
	} else {
		sendJsonResponse(res, 404, {
			"message": "No courseid in request"
		});
	}
};

// Student request courses Handler
module.exports.requestCourseHandler = function(req,res){
	if(req.params.courseid && req.params.studentid){
		c.getCourseById(req.params.courseid, function(err,course){
			if(err){
				sendJsonResponse(res, 404, {
					"message":"Err in getting course"
				});
				return;
			} else {
				s.getStudentByStudentId(req.params.studentid, function(err,student){
					if (err) {
						sendJsonResponse(res,404, {
							"message": "Student not found"
						});
						return;
					}
					var courseStudent;
					courseStudent = Object.assign({}, student);
					console.log("courseStudent, ", courseStudent);
					console.log("student, ", student);
					//This part is to check weather student is already registered for the course or not, but need to have further investigation
					var checkRegistered = course.student.indexOf(courseStudent._doc.studentId);
					console.log("checkRegistered, ", checkRegistered);
					if (checkRegistered != -1){
						sendJsonResponse(res, 400, { "message": "student already registered"});
						return;
					} else{
						course.student.push(courseStudent._doc.studentId);
						if (course.student.length >= course.minimum){
							course.isClass = true;
							course.save();
							sendJsonResponse(res, 200, {
								"course": course,
								"message": "Class is made with the number of student is: " + course.student.length
							});
							return;
						} else{
							course.save();
							sendJsonResponse(res,200,course);
							return;
						}
					}
				});
			}
		});
	} else {
		sendJsonResponse(res, 404, {
			"message": "No courseid in request"
		});
		return;
	}
};