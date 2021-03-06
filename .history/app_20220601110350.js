var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const {
  ItemRouter,
  UserRouter,
  IndexRouter,
  OrderRouter,
  PriorityRouter,
  AccountsRouter
} = require('./routes')
var session = require('express-session');
const passport = require('passport');
var MongoStore = require('connect-mongo')(session);
require('./passportconfig')
var app = express();
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
});

app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.use(passport.initialize())
 app.use(passport.session())
 
// view engine setup
app.use(express.static('public'))
app.set('view engine', 'ejs');	

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', IndexRouter);
app.use('/users', UserRouter);
app.use('/items', ItemRouter);
app.use('/orders', OrderRouter);
app.use('/priority', PriorityRouter);
app.use("/accounts", AccountsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports=app