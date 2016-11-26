var mongoose = require('mongoose');
var passport = require('passport');

var s = mongoose.model('Student');

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

//STUDENTS

module.exports.readStudents = function (req, res) {
    s.find().exec(function(err, students){
        if (err) {
            console.log('Error:', err);
            sendJsonResponse(res, 404, err);
            return;
        } else {
            sendJsonResponse(res, 200, students);
        }
    });
};

module.exports.readOneStudent = function (req, res) {
    if(req.params && req.params.studentid) {
        s.getStudentByStudentId(req.params.studentid, function(err, student) {
            if(!student) {
                sendJsonResponse(res, 404, {
                    "message": "studentid not found"
                });
                return;
            } else if(err) {
                sendJsonResponse(res, 404, err);
                return;
            }
            sendJsonResponse(res, 200, student);
        });
    } else {
        sendJsonResponse(res, 404, {
            "message": "No studentid in request"
        });
    }
};

module.exports.removeStudent = function (req, res) {
    var studentid = req.params.studentid;
    if(req.params && studentid) {
        s.findByIdAndRemove(studentid).exec(function(err, student) {
            if(err) {
                sendJsonResponse(res, 404, err);
                return;
            }
            console.log("Removing student.");
            sendJsonResponse(res, 204, null);
        });
    } else {
        sendJsonResponse(res, 404, {
            "message": "No studentid in request"
        });
    }
};

module.exports.registerStudentsHandler = function(req,res){
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    var email = req.body.email;
    var title = req.body.title;
    var summary = req.body.summary;
    var age = req.body.age;

    // Validation, this should be implemented in frontend, but i did it here just for the demo test
    req.checkBody('firstname', 'Name is required').notEmpty();
    req.checkBody('lastname', 'Name is required').notEmpty();
    req.checkBody('email', 'email is required').notEmpty();
    req.checkBody('email', 'email is invalid').isEmail();
    req.checkBody('username', 'username is required').notEmpty();
    req.checkBody('password', 'password is required').notEmpty();
    req.checkBody('password2', 'password does not match').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        sendJsonResponse(res, 400, {
            "message":"All fields are required"
        });
        return;
    }

    var student = new s();

    var studentId;
    s.count({}, function(err, count) {
        studentId = count+1;
    });

    student.firstname = firstname;
    student.lastname = lastname;
    student.username = username;
    student.setPassword(password);
    student.email = email;
    student.title = title;
    student.summary = summary;
    student.age = age;

    s.find({"username":username}, function(err, docs){
        student.studentId = studentId;

        if (docs.length){
            sendJsonResponse(res, 200, {
                "message": "student username already exist"
            });
            return;
        } else{
            student.save(function(err){
                var token;
                if (err){
                    sendJsonResponse(res, 404, {
                        "message": "cannot generate access token, one of your field does not fit the requirement"
                    });
                    return;
                } else{
                    token = student.generateJwt();
                    sendJsonResponse(res, 200, {
                        "token": token,
                        //"student": student
                    });
                    return;
                }
            });
        }
    });
};

module.exports.loginStudentHandler = function(req, res) {
    if(!req.body.username && !req.body.password){
        sendJsonResponse(res, 400, {
            "message": "All Login Credential fields are required"
        });
        return;
    }
    passport.authenticate('local', function(err,s, info){
        var token;

        if (err){
            sendJsonResponse(res,404, err);
            return;
        }

        if (s){
            token = s.generateJwt();
            sendJsonResponse(res, 200, {
                "token":token,
                "student": s
            });
            return;

        } else {
            sendJsonResponse(res, 401, info);
            return;
        }
    }) (req,res);
};

