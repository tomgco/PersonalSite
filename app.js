
/**
 * Module dependencies.
 * To Compile Javascript: 
 * closure command/clear.js command/command.js command/echo.js command/help.js command/make.js command/projects.js config/config.js main.js init.js tweet.js setup/setup.js
 */

var express = require('express'),
		exec = require('child_process').exec,
		uname = "",
		title = 'Tom Gallacher - Software Engineer',
		gzippo = require('gzippo');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(gzippo.staticGzip(__dirname + '/public'));
	//app.use(express.static(__dirname + '/public'));
	app.use(express.favicon(__dirname + '/public/favicon.ico'));
	exec("uname -a", function(err, stdout) {
		uname = stdout.toString();
	});
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});


// Routes

app.get('/', function(req, res){
	var currentDate = new Date();
	var ipAddress = null;
	ipAddress = req.headers['x-forwarded-for'];
	if (ipAddress === undefined) {
		ipAddress = req.connection.remoteAddress;
	}
	res.render('index', {
		title: title,
		uname: uname,
		time: currentDate.toGMTString(),
		ipAddress: ipAddress,
		currentUrl: req.url
	});
});


app.get('/portfolio', function(req, res){
	res.render('work', {
		title: 'Portfolio / ' + title,
		currentUrl: req.url
	});
});

app.get('/projects', function(req, res){
	res.render('projects', {
		title: 'My Projects / ' + title,
		currentUrl: req.url
	});
});

app.get('/gzippo', function(req, res){
	res.render('/projects/gzippo', {
		title: 'gzippo / ' + title,
		currentUrl: req.url
	});
});

app.error(function(err, req, res){
	console.log(err);
	res.render('500', {
		title: '500 Internal Server Error / ' + title,
		currentUrl: req.url
	});
});

app.use(function(req, res){
  res.render('404', {
		title: '404 Not Found / ' + title,
		currentUrl: req.url
	});
});


// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3002);
  console.log("Express server listening on port %d", app.address().port);
}
