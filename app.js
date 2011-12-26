
/**
 * Module dependencies.
 * To Compile Javascript:
 * closure command/clear.js command/command.js command/echo.js command/help.js command/make.js command/projects.js config/config.js main.js init.js tweet.js animation.js setup/setup.js
 */

var express = require('express'),
		exec = require('child_process').exec,
		uname = "",
		title = 'Tom Gallacher',
		metaDescription = 'Tom Gallacher; Developer, NodeJS privateer, Siri abuser and way too Linux-y to own a Mac, let alone several. Often seen happily writing code without any knowledge of his surroundings.',
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
	app.use(stylus.middleware({ src: __dirname + '/public/', compress: true }));
	//app.use(express.staticCache({ maxLength: 1048576 }));
	app.use(gzippo.staticGzip(__dirname + '/public'));
	app.use(gzippo.compress());
	//app.use(express.static(__dirname + '/public'));
	app.use(app.router);
	app.use(express.favicon(__dirname + '/public/favicon.ico'));
	exec("uname -a", function(err, stdout) {
		uname = stdout.toString();
	});
	latestTweet.setUser("tomgco");
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res){
	var currentDate = new Date();
	var ipAddress = null;
	ipAddress = req.headers['x-forwarded-for'];
	if (ipAddress === undefined) {
		ipAddress = req.connection.remoteAddress;
	}

	function renderView(tweet) {
		res.render('index', {
			title: title,
			uname: uname,
			status: 200,
			time: currentDate.toGMTString(),
			ipAddress: ipAddress,
			currentUrl: req.url,
			metaDescription: metaDescription,
			globals: { twitterResponse: tweet }
		});
	}

	latestTweet.get(renderView);
});


app.get('/portfolio', function(req, res){
	function renderView(tweet) {
		res.render('work', {
			title: 'Portfolio / ' + title,
			currentUrl: req.url,
			status: 200,
			globals: { twitterResponse: tweet },
			metaDescription: 'Tom Gallacher has developed; shortlist.com, stylist.co.uk, jarredchristmas.co.uk, sunperks.co.uk and weareyates.co.uk'
		});
	}

	latestTweet.get(renderView);
});

app.get('/projects', function(req, res){
	function renderView(tweet) {
		res.render('projects', {
			title: 'My Projects / ' + title,
			currentUrl: req.url,
			globals: { twitterResponse: tweet },
			status: 200,
			metaDescription: 'Tom Gallacher loves random projects including; Syma 107 Helicopter Interface for arduino, tomg.co, usb ghost and others'
		});
	}

	latestTweet.get(renderView);
});

app.get('/gzippo', function(req, res){
	function renderView(tweet) {
		res.render('gzippo', {
			title: 'gzippo - A nodejs gzip middleware for connect/express.js ' + title,
			currentUrl: req.url,
			globals: { twitterResponse: tweet },
			status: 200,
			metaDescription: 'Gzippo is a NodeJS middleware for express gzip / connect for gzip support. Using Node\'s built in Zlib API'
		});
	}

	latestTweet.get(renderView);
});

app.get('/twitter-feed', function(req, res){
	function renderView(tweet) {
		res.render('partials/tweets.jade', {
			layout: 'tweet-layout',
			status: 200,
			globals: { twitterResponse: tweet }
		});
	}

	latestTweet.get(renderView);
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
app.get('*', function(req, res){
	function renderView(tweet) {
	  res.render('404', {
			title: '404 Not Found / ' + title,
			status: 404,
			currentUrl: req.url,
			globals: { twitterResponse: tweet },
			metaDescription: metaDescription
		});
		console.log('404: Access at: ' + req.url);
	}

	latestTweet.get(renderView);
});

// Only listen on $ node app.js

if (cluster.isMaster) {
	// Fork workers.
	for (var i = 0; i < numCPUs; i++) {
		var worker = cluster.fork();
		console.log('worker ' + worker.pid + ' started at ' + new Date());
	}

	cluster.on('death', function(worker) {
		console.log('worker ' + worker.pid + ' died');
	});
} else {
	app.listen(3002);
}
