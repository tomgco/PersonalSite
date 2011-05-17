
/**
 * Module dependencies.
 * To Compile Javascript: 
 * java -jar /Users/Tom/Downloads/compiler-latest/compiler.jar --js command/echo.js etc.. --js_output_file commands.min.js
 * java -jar /Users/Tom/Downloads/compiler-latest/compiler.jar --js tweet.js --js main.js --js setup/setup.js --js config/config.js --js_output_file terminal.min.js
 */

var express = require('express'),
		exec = require('child_process').exec,
		uname = "",
		title = 'Tom Gallacher - Software Engineer',
		gzip = require('connect-gzip');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(gzip.staticGzip(__dirname + '/public/'));
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

app.get('/work', function(req, res){
	res.render('work', {
		title: 'Work / ' + title,
		currentUrl: req.url
	});
});

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3002);
  console.log("Express server listening on port %d", app.address().port);
}
