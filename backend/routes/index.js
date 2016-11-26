var express = require('express');
var router = express.Router();
var flash = require('connect-flash');
var session = require('express-session');
var expressValidator = require('express-validator');
var passport = require('passport');
var jwt = require('express-jwt');
var auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload',
});

router.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

router.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

router.use(flash());

//include API controller files
var ctrlCourses = require('../controllers/courseControllers');
var ctrlTeachers = require('../controllers/teacherControllers');
var ctrlStudents = require('../controllers/studentControllers');

//teachers:
router.post('/users/register/teachers', ctrlTeachers.registerTeachersHandler);
router.post('/users/login/teachers',ctrlTeachers.loginTeacherHandler);
router.get('/users/teachers',ctrlTeachers.readTeachers);
router.get('/users/teachers/:teacherid',ctrlTeachers.readOneTeacher);
router.delete('/users/teachers/:teacherid',ctrlTeachers.removeTeacher);

//students:
router.post('/users/register/students',ctrlStudents.registerStudentsHandler);
router.post('/users/login/students',ctrlStudents.loginStudentHandler);
router.get('/users/students',ctrlStudents.readStudents);
router.get('/users/students/:studentid',ctrlStudents.readOneStudent);
router.delete('/users/students/:studentid',ctrlStudents.removeStudent);

// Courses
router.post('/:teacherid/courses/create',ctrlCourses.createCourseHandler); // register course
router.get('/:courseid',ctrlCourses.getCourseHandler); // view course
router.post('/requestcourse/:studentid/:courseid',ctrlCourses.requestCourseHandler); // student request courses

module.exports = router;


//reviews:
//router.get('/users/teachers/:teacherid/reviews', ctrlUsers.readTeacherReviews);
//router.get('/users/teachers/:teacherid/reviews/:reviewid', ctrlUsers.readOneTeacherReview);
//router.post('/users/teachers/:teacherid/reviews', ctrlUsers.addTeacherReview);
//router.delete('/users/teachers/:teacherid/reviews/:reviewid', ctrlUsers.removeTeacherReview);

//courses:
//router.get('/courses', ctrlCourses.readCourses);
//router.get('/courses/:courseid', ctrlCourses.readOneCourse);

//requests:
//router.get('/courses/:courseid/requests', ctrlCourses.readCourseRequests);
//router.get('/courses/:courseid/requests/:requestid', ctrlCourses.readOneCourseRequest);
//router.post('/courses/:courseid/requests', ctrlCourses.addCourseRequest);
//router.delete('/courses/:courseid/requests/:requestid', ctrlCourses.removeCourseRequest);
