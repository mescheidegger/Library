var express = require('express');
var bookRouter = express.Router();


var router = function (nav) {

    var bookController = require('../controllers/bookController')(null, nav);

    bookRouter.use(bookController.userValidate);

    bookRouter.route('/')
        .get(bookController.getIndex);
    bookRouter.route('/:id')
        .all(bookController.getById)
        .get(bookController.renderPage);

    return bookRouter;
};

module.exports = router;