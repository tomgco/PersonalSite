/*
 * This is simple wrapper for retrieving a user's
 * latest tweet via the twitter REST API.
 */


// Require http module
var http = require('http');

/*
 * Latest tweet constructor
 */
LatestTweet = function () {
	
	this.debugMode = false;
	this.user = null;
	this.cachedTweet = [{ text : "Could not retrieve latest tweet. Sozzer!" }];
	this.lastAccessTime = null;
	this.options = null;

	this.debug = function (obj) {
		if (this.debugMode) {
			console.log("latest-tweet.js debug output:");
			console.log(obj);
		}
	};

};

/*
 * Set debug mode
 */
LatestTweet.prototype.setDebugMode = function (debugMode) {
	this.debugMode = debugMode;
};

/*
 * Required before calling get() to set the user
 */
LatestTweet.prototype.setUser = function (user) {
	this.user = user;
	this.options = {
		host : "api.twitter.com",
		port : 80,
		path : "/1/statuses/user_timeline.json?screen_name=" +
						this.user +
						"&count=5&trim_user=true&include_rts=false&include_entities=false&exclude_replies=true"
	};
};


/*
 * Retrieves the user's (set with setUser()) most recent
 * tweet and passes it to the given callback. The function
 * caches the last tweet it receives, so if the rate limit
 * is hit, the cached tweet it retrieved.
 */
LatestTweet.prototype.get = function (callback) {

	var that = this,
			now = Date.now();
	
	if (!this.user) {
		
		// Need user to be defined
		throw new Error("User is not defined. Call setUser() first");

	} else if (this.lastAccessTime && now - this.lastAccessTime < 60000) {

		this.debug("Looking in the cache");

		// Cached tweet was retrieved less than a minute ago
		// so save resources and serve that up
		callback(that.cachedTweet);

	} else {
		
			that.debug("Opening connection");

		// Cache is over a minute old, retrieve new tweet

		var req = http.get(that.options, function (res) {
			
			that.debug("Rate limit: " + parseInt(res.headers["x-ratelimit-remaining"],10));

			if (res.statusCode !== 200 && res.statusCode !== 201) {

				that.debug("Status code: " + res.statusCode);

				that.debug("Serving cached tweet");

				callback(that.cachedTweet);

			} else if (parseInt(res.headers["x-ratelimit-remaining"],10) === 0) {

				callback(that.cachedTweet);

			} else {

				that.debug("Connection did not error, collecting data");
		
				var data = "";
				res.on('data', function (chunk) {
					data += chunk;
				});

				res.on('end', function () {
					that.debug("Connection closed with 'end' event");
					that.lastAccessTime = Date.now();
					var tweets = JSON.parse(data);

					tweets.forEach(function(tweet) {
						var text = tweet.text;
						text = text.replace(/([A-Za-z]{3,9}):\/\/([-;:&=\+\$,\w]+@{1})?([-A-Za-z0-9\.]+)+:?(\d+)?((\/[-\+~%/\.\w]+)?\??([-\+=&;%@\.\w]+)?#?([\w]+)?)/g,
	"<a target=\"_blank\" href=\"$&\">$&</a>");
						text = text.replace(/(^|[^a-z0-9_])#([a-z0-9_]+)/gi, "$1#<a href=\"https://twitter.com/#!/search/%23$2\">$2</a>");
						text = text.replace(/(^|[^a-z0-9_])@([a-z0-9_]+)/gi, "$1@<a href=\"https://www.twitter.com/$2\">$2</a>");
						tweet.text = text;
					});

					that.cachedTweet = tweets;
					callback(that.cachedTweet);
				});

			}
					
		}).on('error', function (e) {
			that.debug("Connection closed with 'error' event");
			callback([{ text : "An error occured while retrieving latest tweet. Sorry!" }]);
		});
	}

};

module.exports = new LatestTweet();