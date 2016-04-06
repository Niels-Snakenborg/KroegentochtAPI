// VARIABLES =================================================================================================
var express         = require('express');
var app             = express()
    , server        = require('http').createServer(app)
    , io            = require('socket.io').listen(server);
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var session         = require('express-session');
var flash           = require('connect-flash');
var passport        = require('passport');
var auth            = require('./modules/auth');
var port            = process.env.PORT || 15770;

// CONFIG =====================================================================================================
// Database connectie
var mongoose = require('mongoose');
var DBconfig = require('./config/database.js');
mongoose.connect(DBconfig.url);

// Passport configuratie
require('./config/passport')(passport)

// Server
server.listen(port);
app.set("io", io);

// Models
var User = require('./models/user');
var Race = require('./models/race');
var Waypoint = require('./models/waypoint');
var Checkin = require('./models/checkin');

// ROUTES =====================================================================================================
// FrontEnd
var login = require('./routes/login');
var signup = require('./routes/signup');
var dashboard = require('./routes/dashboard');
var admin = require('./routes/admin');
var race = require('./routes/race');

//API
var users = require('./routes/users');
var races = require('./routes/races');
var waypoints = require('./routes/waypoints');
var checkins = require('./routes/checkins');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// PASSPORT ===================================================================================================
function isLoggedIn(req, res, next) {

  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}

app.use(session({
  secret: 'pJ8MS6u5ZKVl2u4b6Uav0X3Jw89rhX67',
  resave: true,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// ROUTES =====================================================================================================
// MAIN STRUCTURE
app.use('/', login);
app.use('/signup_page', signup);
app.use('/login_page', login);

app.use('/login', passport.authenticate('local-login', {
  successRedirect : '/dashboard',
  failureRedirect : '/login_page',
  failureFlash : true
}));

app.use('/signup', passport.authenticate('local-signup', {
  successRedirect : '/dashboard',
  failureRedirect : '/signup_page',
  failureFlash : true
}));

app.use('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

// FRONT END PAGES
app.use('/dashboard', isLoggedIn, dashboard);
app.use('/admin', isLoggedIn, admin);
app.use('/race', isLoggedIn, race);

// API
app.use('/api/users/', users);
app.use('/api/races/', races);
app.use('/api/waypoints/', waypoints);
app.use('/api/checkins/', checkins);


// ERROR HANDLING =============================================================================================

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
