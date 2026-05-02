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

const List = sequelize.define('List', {
  name: { type: DataTypes.STRING, allowNull: false },
});

const Task = sequelize.define('Task',{
  name:{type: DataTypes.STRING,allowNull:false},
  description:{type: DataTypes.TEXT}
});

// 1. A List can contain multiple Tasks
List.hasMany(Task, {
  onDelete: 'CASCADE'   // If a List is deleted, delete its Tasks
});

// 2. A Task belongs to a single List
Task.belongsTo(List);

/* const url = 'https://api.themoviedb.org/3/authentication';
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
  .catch(err => console.error(err)); */

/* GET home page. */
 app.get('/', function (req, res, next) {
  res.render('index', { title: 'Home' });
});

/*app.get('/landing', function (req, res, next) {
  res.render('landing', { title: 'Home' });
});

app.get('/movies', function (req, res, next) {
  res.render('movies', {title:'movies'});
});

app.get('/tv', function (req, res, next) {
  res.render('tv', {title:'tv'});
}); */

app.get('/addtask',function(req,res,next){
  res.render('addtask',{title:'Add Task'});
});

app.post('/addtask', async function(req,res,next){
  try{
    const created = await Task.create({name:req.body.name, description: req.body.description});
    res.json(created);
  }catch(err){
    next(err);
  }
});

app.get('/addlist', function (req, res, next) {
  res.render('addlist', { title: 'Add List' });
});

app.post('/addlist', async function (req, res, next) {
  console.log('Received addlist POST:', req.body);
  try {
        // req.body is now the clean JSON object
        const list = await List.create(req.body, {
            include: [Task]
        });
        res.json(list);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});



module.exports = app;