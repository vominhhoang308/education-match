var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var s = mongoose.model('Student');
var t = mongoose.model('Teacher');

passport.use('local',new LocalStrategy({
		usernameField: 'username'
	},
	function(username, password, done){
		var checkUser = new Array(2);
		var checkPassword = new Array(2);
		s.findOne({username:username}, function(err, student){
			if(err){ return done(err);}
			if(!student){
				checkUser[1] = false;
				return;
			}
			if(!student.validPassword(password)){
				checkPassword[1] = false;
				return;
			}
			return done(null,student);
		});

		t.findOne({username:username}, function(err, teacher){
			if(err){ return done(err);}
			if(!teacher){
				checkUser[2] = false;
				return;
			}
			if(!teacher.validPassword(password)){
				checkPassword[2] = false;
				return;
			}
			return done(null,teacher);
		});

		if(checkUser[1] == false && checkUser [2] == false){
			return done(null,false,{
					message:'Incorrect username.'
				}); 
		} else if(checkPassword[1] == false && checkPassword[2] == false){
			return done(null,false,{
					message:'Incorrect password.'
				}); 				
		}
	}
));