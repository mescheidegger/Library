var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var sql = require('mssql');

function ValidateUser(username, password, done) {
    var user = { username: username,
               password: password };
    var ps = new sql.PreparedStatement();
    ps.input('username', sql.NVarChar);
    ps.input('password', sql.NVarChar);
    ps.prepare('SELECT TOP 1 * from users WHERE (username = @username) AND (password = @password)',
        function (err) {
            ps.execute({
                    username: username,
                    password: password
                },
                function (err, recordset) {
                    console.log(recordset);
                    if (recordset.length > 0) {
                        user = recordset;
                        console.log('Successful login from ' + username);
                        done(null, user); //They successfully logged in


                    } else {
                        console.log('Warn user either incorrect username or password');
                        //Send response back to the client here
                        done(null, false,
                            { message: 'Bad User or Password'});
                    };
                    ps.unprepare(function (err) {

                    });
                });
        });
};

module.exports = function () {
    passport.use(new LocalStrategy({
            usernameField: 'userName',
            passwordField: 'password'
        },
        ValidateUser));
};