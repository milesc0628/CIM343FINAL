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

const Post = sequelize.define('Post',{
  name:{type: DataTypes.STRING,allowNull:false},
  description:{type: DataTypes.TEXT}
});

/* GET home page. */
 app.get('/', function (req, res, next) {
  res.render('index', { title: 'Home' });
});

app.get('/feedumi', function(req,res,next){
  res.render('feedumi',{title:'Feeding Umi'});
});

app.get('/mailroom', async function(req,res,next){
  try{
    const posts = await Post.findAll();
    res.render('mailroom',{title:'Mailroom', posts: posts});
  }catch(err){
    next(err);
  }
});

app.get('/mailreceived', function(req,res,next){
  res.render('mailreceived',{title:'Mail Received!'});
});

app.post('/feedumi', async function(req,res,next){
  try{
    const created = await Post.create({name:req.body.name, description: req.body.description});
    res.redirect('/mailreceived');
  }catch(err){
    next(err);
  }
});

app.get('/about', function(req,res,next){
  res.render('about',{title:'About'});
});


module.exports = app;