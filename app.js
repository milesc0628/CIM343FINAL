var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('hbs');//added
const fs = require('fs');
const { Sequelize } = require('sequelize');
const { DataTypes } = require('sequelize');


// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

//Registering Partials
hbs.registerPartials(path.join(__dirname, 'views', 'partials'))
hbs.registerPartial('partial_name', 'partial value');

//Setup out database
const dataDirectory = path.join(__dirname, 'data');
const storage = path.join(dataDirectory, 'database.sqlite');

//Ensure the data directory exists
fs.mkdirSync(dataDirectory, { recursive: true });

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage,
  logging:false
});

async function syncDB(){
  await sequelize.sync();
}

syncDB().catch(console.error);

const url = 'https://api.themoviedb.org/3/authentication';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmOTk3YTQzMzVkODczNjI1Y2QzMDY0NjJjMWQ2N2JhOCIsIm5iZiI6MTc3NjgwODQxNy42NzgwMDAyLCJzdWIiOiI2OWU3ZjFlMTUwNzVhZGQxZDYxOTY2NjEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.9gqFEwhPxskcmks5eWdNs0uXrVxkGSRfD0fazzVNthY'
  }
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));

/* GET home page. */
app.get('/', function (req, res, next) {
  res.render('index', { title: 'Home' });
});

app.get('/landing', function (req, res, next) {
  res.render('landing', { title: 'Home' });
});

app.get('/movies', function (req, res, next) {
  res.render('movies', {title:'movies'});
});

app.get('/tv', function (req, res, next) {
  res.render('tv', {title:'tv'});
});




module.exports = app;