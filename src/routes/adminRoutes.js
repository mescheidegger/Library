var express = require('express');
var adminRouter = express.Router();
var sql = require('mssql');

var router = function (nav) {
    
    adminRouter.route('/addBooks')
        .get(function(req, res){
            //var ps = new sql.PreparedStatement();
            
            res.send('inserting books'); 
    });
    
    return adminRouter;
};

module.exports = router;