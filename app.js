var express = require('express');
var app = express();
var sql = require('mssql');
var config = require('./dbconfig');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

sql.connect(config, function (err) {
    console.log(err);
});


var port = process.env.port || 5000;

var nav = [{
    Link: '/Books',
    Text: 'Books'
                         }, {
    Link: '/Authors',
    Text: 'Authors'
                         }];

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended : true
}));
app.use(cookieParser());
app.use(session({secret : 'library',
                 resave : true,
                 saveUninitialized : true}));
require('./src/config/passport')(app);


var bookRouter = require('./src/routes/bookRoutes')(nav);
app.use('/Books', bookRouter);

var adminRouter = require('./src/routes/adminRoutes')(nav);
app.use('/Admin', adminRouter);

var authRouter = require('./src/routes/authRoutes')(nav);
app.use('/Auth', authRouter);



//app.use(express.static('src/views'));

app.set('views', './src/views');
app.set('view engine', 'ejs');


app.get('/', function (req, res) {
    res.render('index', {
        title: 'Hello from Render',
        nav: [{
            Link: '/Books',
            Text: 'Books'
                         }, {
            Link: '/Authors',
            Text: 'Authors'
                         }]
    });
});

app.listen(port, function (err) {
    console.log('running server on port ' + port);
});