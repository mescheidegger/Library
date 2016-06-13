var express = require('express');
var authRouter = express.Router();
var sql = require('mssql');
var passport = require('passport');

function CheckIfUserExists(req, res, next) {
    var uname = req.body.userName;
    var ps = new sql.PreparedStatement();
    ps.input('uname', sql.NVarChar);
    ps.prepare('SELECT TOP 1 username from users WHERE (username = @uname)',
        function (err) {
            ps.execute({
                    uname: uname
                },
                function (err, recordset) {
                    console.log(recordset);
                    if (recordset.length > 0) {
                        console.log('User was not inserted into DB. Duplicate User Found.');
                        //Send response back to the client here
                        res.redirect('/');

                    } else {
                        next(); //No dupes found, perform the post to follow
                    };
                    ps.unprepare(function (err) {

                    });
                });
        });
};

function AddUser(req, res) {
    var uname = req.body.userName;
    var password = req.body.password;

    var transaction = new sql.Transaction();
    transaction.begin(function (err) {
        console.log('Transaction begin');
        var ps = new sql.PreparedStatement(transaction);
        ps.input('uname', sql.NVarChar);
        ps.input('password', sql.NVarChar);
        ps.prepare('INSERT INTO users (username, password) VALUES (@uname, @password)',
            function (err) {
                console.log('Prepared to insert user into DB');
                ps.execute({
                        uname: uname,
                        password: password
                    },
                    function (err, recordset) {
                        console.log('User inserted into the DB');

                        ps.unprepare(function (err) {
                            console.log('Transaction committed');

                            transaction.commit(function (err) {
                                console.log('Statement unprepared')
                                req.login(req.body, function () {
                                    res.redirect('/Auth/profile');
                                });
                            });
                        });
                    });
            });
    });
};

function UserValidate(req, res, next) {
    if (!req.user) {
        res.redirect('/');
    };
    next();
};

var session = function (req, res) {
    var temp = req.session.passport; // {user: 1}
    req.session.regenerate(function (err) {
        //req.session.passport is now undefined
        req.session.passport = temp;
        req.session.save(function (err) {
            res.redirect('/Auth/profile');
        });
    });
};

var router = function (nav) {
    authRouter.route('/signUp')
        .all(CheckIfUserExists)
        .post(AddUser);
    authRouter.route('/profile')
        .all(UserValidate)
        .get(function (req, res) {
            res.json(req.user);
        });
    authRouter.route('/signIn')
        .post(passport.authenticate('local', {
                failureRedirect: '/'
            }),
            session);

    return authRouter;
};

module.exports = router;

/*function (req, res) { //run this on success
                res.redirect('/Auth/profile');
            }*/