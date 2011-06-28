
/**
 * Module dependencies.
 * To Compile Javascript: 
 * closure command/clear.js command/command.js command/echo.js command/help.js command/make.js command/projects.js config/config.js main.js init.js tweet.js setup/setup.js
 */

var express = require('express'),
		exec = require('child_process').exec,
		uname = "",
		title = 'Tom Gallacher - Software Engineer',
		metaDescription = 'Hi my name is Tom Gallacher and I am a software engineer / web developer from Bournemouth, United Kingdom. I love programming, the surrounding technologies, live music and just enjoying life.',
		gzippo = require('gzippo'),
		latestTweet = require("./modules/latest-tweet"),
		cluster = require('cluster');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	//app.use(gzippo.gzip());
	app.use(app.router);
	app.use(gzippo.staticGzip(__dirname + '/public'));
	//app.use(express.static(__dirname + '/public'));
	app.use(express.favicon(__dirname + '/public/favicon.ico'));
	exec("uname -a", function(err, stdout) {
		uname = stdout.toString();
	});
	latestTweet.setUser("tomgallacher89");
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

var globals = {};
// Routes

app.get('/', function(req, res){
	var currentDate = new Date();
	var ipAddress = null;
	ipAddress = req.headers['x-forwarded-for'];
	if (ipAddress === undefined) {
		ipAddress = req.connection.remoteAddress;
	}
	
	function renderView() {
		res.render('index', {
			title: title,
			uname: uname,
			time: currentDate.toGMTString(),
			ipAddress: ipAddress,
			currentUrl: req.url,
			metaDescription: metaDescription,
			globals: globals
		});
	}
	
	latestTweet.get(function (tweet) {
		globals.twitterResponse = tweet;
		renderView();
	});
});


app.get('/portfolio', function(req, res){
	function renderView() {
		res.render('work', {
			title: 'Portfolio / ' + title,
			currentUrl: req.url,
			globals: globals,
			metaDescription: 'Sites that Tom Gallacher has worked on include; shortlist.com, stylist.co.uk, jarredchristmas.co.uk and weareyates.co.uk'
		});
	}
	
	latestTweet.get(function (tweet) {
		globals.twitterResponse = tweet;
		renderView();
	});
});

app.get('/projects', function(req, res){
	function renderView() {
		res.render('projects', {
			title: 'My Projects / ' + title,
			currentUrl: req.url,
			globals: globals,
			metaDescription: 'This is a list of projects that Tom Gallacher has worked on for fun and enjoyment and other various reasons.'
		});
	}
	
	latestTweet.get(function (tweet) {
		globals.twitterResponse = tweet;
		renderView();
	});
});

app.get('/gzippo', function(req, res){
	function renderView() {
		res.render('gzippo', {
			title: 'gzippo / ' + title,
			currentUrl: req.url,
			globals: globals,
			metaDescription: 'Gzippo is a NodeJS middleware to gzip expressjs / connect assets. Gzipping on the application layer is perfect in situations where you have no control over server configurations.'
		});
	}
	
	latestTweet.get(function (tweet) {
		globals.twitterResponse = tweet;
		renderView();
	});
});

app.error(function(err, req, res){
	function renderView() {
		console.log(err);
		res.render('500', {
			title: '500 Internal Server Error / ' + title,
			currentUrl: req.url,
			status: 500,
			globals: globals,
			metaDescription: metaDescription
		});
	}
	
	latestTweet.get(function (tweet) {
		globals.twitterResponse = tweet;
		renderView();
	});
});

app.use(function(req, res){
	function renderView() {
	  res.render('404', {
			title: '404 Not Found / ' + title,
			status: 404,
			currentUrl: req.url,
			globals: globals,
			metaDescription: metaDescription
		});
	}
	
	latestTweet.get(function (tweet) {
		globals.twitterResponse = tweet;
		renderView();
	});
});


// Only listen on $ node app.js

cluster = cluster(app)
	.use(cluster.stats())
	.use(cluster.pidfiles('pids'))
	.use(cluster.cli())
	.listen(3002);
	
	console.log(new Date() + ":  app starting in " + app.settings.env + " mode on port 3002 (pid: " + process.pid + (cluster.isMaster ? ", master" : "") + ")");
