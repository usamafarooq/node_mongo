var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');

var task = require('./routes/task');
var app = express();

var connection = require('express-myconnection');
var mysql = require('mysql');

app.set('port', process.env.PORT || 4300);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.use(
	connection(mysql,{
		host : 'localhost',
		user : 'root',
		password : '',
		port : '3306',
		database : 'python_crud'
	},'pool')
);


var dbConfig = require('./config/config.js');
var mongoose = require('mongoose');
// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/crud";

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   console.log("Database created!");
//   db.close();
// });

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url)
.then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});
//var Note = require('../models/model.js');

app.get('/', task.list);
app.get('/add', task.add);
app.post('/add', task.save);
app.get('/delete/:id', task.delete_customer);
app.get('/edit/:id', task.edit);
app.post('/edit/:id', task.save_edit);


app.use(app.router);

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listing on port ' + app.get('port'));
})