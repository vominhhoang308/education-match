var mongoose = require('mongoose');
var passport = require('passport');

var t = mongoose.model('Teacher');

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};


//TEACHERS

module.exports.readTeachers = function (req, res) {
    t.find().exec(function(err, teachers){
        if (err) {
            console.log('Error:', err);
            sendJsonResponse(res, 404, err);
            return;
        } else {
            sendJsonResponse(res, 200, teachers);
        }
    });
};

module.exports.readOneTeacher = function (req, res) {
    if(req.params && req.params.teacherid) {
        t.getTeacherByTeacherId(req.params.teacherid, function(err, teacher) {
            //if teacher is not returned
            if(!teacher) {
                sendJsonResponse(res, 404, {
                    "message": "teacherid not found"
                });
                return;
            //if error message is returned
            } else if(err) {
                sendJsonResponse(res, 404, err);
                return;
            }
            t.count({}, function(err, count){
                var numberOfTeachers;
                numberOfTeachers = count;
                if(teacher.teacherId == numberOfTeachers){
                    sendJsonResponse(res, 200, {
                        "teacher": teacher,
                        "nextTeacherId": 1
                    });
                    return;
                } else{
                    sendJsonResponse(res, 200, {
                        "teacher": teacher,
                        "nextTeacherId": teacher.teacherId + 1
                    });
                    return;
                }
            });
        });
    } else {
        sendJsonResponse(res, 404, {
            "message": "No teacherid in request"
        });
        return;
    }
};

module.exports.removeTeacher = function (req, res) {
    var teacherid = req.params.teacherid;
    if(req.params && teacherid) {
        t.findByIdAndRemove(teacherid).exec(function(err, teacher) {
            if(err) {
                sendJsonResponse(res, 404, err);
                return;
            }
            console.log("Removing teacher.");
            sendJsonResponse(res, 204, null);
        });
    } else {
        sendJsonResponse(res, 404, {
            "message": "No teacherid in request"
        });
    }
};

module.exports.registerTeachersHandler = function(req,res){
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    var email = req.body.email;
    var summary = req.body.summary;
    var experience = req.body.experience;
    var location = req.body.location;
    var rating = req.body.rating;
    var title = req.body.title;

    // Validation, this should be implemented in frontend, but i did it here just for the demo test
    req.checkBody('firstname', 'firstName is required').notEmpty();
    req.checkBody('lastname', 'lastName is required').notEmpty();
    req.checkBody('email', 'email is required').notEmpty();
    req.checkBody('email', 'email is invalid').isEmail();
    req.checkBody('username', 'username is required').notEmpty();
    req.checkBody('password', 'password is required').notEmpty();
    req.checkBody('password2', 'password does not match').equals(req.body.password);
    req.checkBody('summary', 'summary is required').notEmpty();
    req.checkBody('experience', 'experience is required').notEmpty();


    var errors = req.validationErrors();

    if (errors) {
        sendJsonResponse(res, 400, {
            "message":"All fields are required"
        });
        return;
    }

    var teacher = new t();

    var teacherId;
    t.count({}, function(err, count) {
        teacherId = count+1;
    });

    teacher.firstname = firstname;
    teacher.lastname = lastname;
    teacher.username = username;
    teacher.setPassword(password);
    teacher.email = email;
    teacher.summary = summary;
    teacher.experience = experience;
    teacher.location = location;
    teacher.rating = rating;
    teacher.title = title;

    t.find({"username":username}, function(err, docs){
        teacher.teacherId = teacherId;

        if (docs.length){
            sendJsonResponse(res, 200, {
                "message": "teacher username already exist"
            });
            return;
        } else{
            teacher.save(function(err){
                var token;
                if (err){
                    sendJsonResponse(res, 404, {
                        "message": "cannot generate access token"
                    });
                    return;
                } else{
                    token = teacher.generateJwt();
                    sendJsonResponse(res, 200, {
                        "token": token,
                        //"teacher": teacher
                    });
                    return;
                }
            });
        }
    });
};

module.exports.loginTeacherHandler = function(req, res) {

    if(!req.body.username && !req.body.password){
        sendJsonResponse(res, 400, {
            "message": "All Login Credential fields are required"
        });
        return;
    }

    passport.authenticate('local', function(err,t, info){
        var token;

        if (err){
            sendJsonResponse(res,404, err);
            return;
        }

        if (t){
            token = t.generateJwt();
            sendJsonResponse(res, 200, {
                "token":token,
                "teacher": t
            });
            return;

        } else {
            sendJsonResponse(res, 401, info);
            return;
        }
    }) (req,res);

    console.log('end here');

};
