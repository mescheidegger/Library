var sql = require('mssql');

var bookController = function (bookService, nav) {
    var getIndex = function (req, res) {
        var request = new sql.Request();
        request.query('select * from books',
            function (err, recordset) {
                console.log(recordset);
                res.render('books', {
                    title: 'Hello from Render',
                    nav: nav,
                    books: recordset
                });
            });
    };

    var getById = function (req, res, next) {
        var id = req.params.id;
        var ps = new sql.PreparedStatement();
        ps.input('id', sql.Int);
        ps.prepare('select * from books where id = @id',
            function (err) {
                ps.execute({
                        id: id
                    },
                    function (err, recordset) {
                        if (recordset.length === 0) {
                            res.status(404).send('Not Found');
                        } else {
                            console.log(recordset);
                            req.book = recordset[0];
                            next();
                        }
                    });
            });
    };

    var renderPage = function (req, res) {
        res.render('bookView', {
            title: 'Hello from Render',
            nav: nav,
            book: req.book
        });
    };

    var userValidate = function (req, res, next) {
        if (!req.user) {
            res.redirect('/');
        };
        next();
    };



    return {
        getIndex: getIndex,
        getById: getById,
        userValidate: userValidate,
        renderPage: renderPage
    };
};

module.exports = bookController;