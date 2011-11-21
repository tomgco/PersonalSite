
/**
 * Module dependencies.
 * To Compile Javascript:
 * closure command/clear.js command/command.js command/echo.js command/help.js command/make.js command/projects.js config/config.js main.js init.js tweet.js animation.js setup/setup.js
 */

var express = require('express'),
		exec = require('child_process').exec,
		uname = "",
		title = 'Tom Gallacher',
		metaDescription = 'Hi my name is Tom Gallacher and I am a software engineer / web developer from Bournemouth, United Kingdom. I love programming, the surrounding technologies, live music and photography. tomg.co is just my own personal website experiment using nodejs and portfolio',
		gzippo = require('gzippo'),
		latestTweet = require("./modules/latest-tweet"),
		cluster = require('cluster'),
		stylus = require('stylus'),
		numCPUs = require('os').cpus().length;

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	//app.use(gzippo.gzip());
	app.use(app.router);
	app.use(stylus.middleware({ src: __dirname + '/public/', compress: true }));
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
			metaDescription: 'Tom Gallacher has worked on the following sites; shortlist.com, stylist.co.uk, jarredchristmas.co.uk, sunperks.co.uk and weareyates.co.uk'
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
			metaDescription: 'Projects that Tom Gallacher has or is currently working on for enjoyment and other various reasons.'
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
			title: 'gzippo - A nodejs gzip middleware for connect/express.js ' + title,
			currentUrl: req.url,
			globals: globals,
			metaDescription: 'Gzippo is a NodeJS middleware for express gzip / connect gzip support. Can be used by adding express.gzip() or replace express.static() with express.staticGzip() '
		});
	}

	latestTweet.get(function (tweet) {
		globals.twitterResponse = tweet;
		renderView();
	});
});

app.get('/twitter-feed', function(req, res){
	function renderView() {
		res.render('partials/tweets.jade', {
			layout: 'tweet-layout',
			globals: globals
		});
	}

	latestTweet.get(function (tweet) {
		globals.twitterResponse = tweet;
		renderView();
	});
});

//app.error(function(err, req, res){
//	function renderView() {
//		console.log(err);
//		res.render('500', {
//			title: '500 Internal Server Error / ' + title,
//			currentUrl: req.url,
//			status: 500,
//			globals: globals,
//			metaDescription: metaDescription
//		});
//	}
//
//	latestTweet.get(function (tweet) {
//		globals.twitterResponse = tweet;
//		renderView();
//	});
//});
//
//app.get('*', function(req, res){
//	function renderView() {
//	  res.render('404', {
//			title: '404 Not Found / ' + title,
//			status: 404,
//			currentUrl: req.url,
//			globals: globals,
//			metaDescription: metaDescription
//		});
//	}
//
//	latestTweet.get(function (tweet) {
//		globals.twitterResponse = tweet;
//		renderView();
//	});
//});

// Only listen on $ node app.js

if (cluster.isMaster) {
	// Fork workers.
	for (var i = 0; i < numCPUs; i++) {
		var worker = cluster.fork();
		console.log('worker ' + worker.pid + ' started.');
	}

	cluster.on('death', function(worker) {
		console.log('worker ' + worker.pid + ' died');
	});
} else {
	app.listen(3002);
}

// cluster = cluster(app)
// 	.use(cluster.stats())
// 	.use(cluster.pidfiles('pids'))
// 	.use(cluster.cli())
// 	.listen(3002);

// console.log(new Date() + ":  app starting in " + app.settings.env + " mode on port 3002 (pid: " + process.pid + (cluster.isMaster ? ", master" : "") + ")");
