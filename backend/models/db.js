//this file is required in the app.js file to open a 
//connection successfully

//you can also use named connections for connecting to 
//multiple databases

var mongoose = require('mongoose');
var gracefulShutdown;
var dbURI = 'mongodb://admin:admin@ds057816.mlab.com:57816/eduma';

if (process.env.NODE_ENV === 'production') {
  dbURI = process.env.MONGOLAB_URI;
}

mongoose.connect(dbURI);

//required by Windows
var readLine = require ("readline");
if (process.platform === "win32"){
    var rl = readLine.createInterface ({
        input: process.stdin,
        output: process.stdout
    });
    rl.on ("SIGINT", function (){
        process.emit ("SIGINT");
    });
}

// CONNECTION EVENTS
mongoose.connection.on('connected', function() {
    console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function(err) {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function() {
    console.log('Mongoose disconnected');
});

// // To be called when process is restarted or terminated
// gracefulShutdown = function(msg, callback) {
//     mongoose.connection.close(function() {
//         console.log('Mongoose disconnected through ' + msg);
//         callback();
//     });
// };

// // For nodemon restarts
// process.once('SIGUSR2', function() {
//     gracefulShutdown('nodemon restart', function() {
//         process.kill(process.pid, 'SIGUSR2');
//     });
// });

// // For app termination
// process.on('SIGINT', function() {
//     gracefulShutdown('app termination', function() {
//         process.exit(0);
//     });
// });

// // For Heroku app termination
// process.on('SIGTERM', function() {
//     gracefulShutdown('Heroku app termination', function() {
//         process.exit(0);
//     });
// });
require('./studentSchema');
require('./courseSchema');
require('./teacherSchema');
