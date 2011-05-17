(function($){
	$.fn.latestTweets = function(options){
		var that = this;
		
		var defaultOptions = {
			user: "twitter",
			numberOfTweets: 4,
			callback: function(){}
		};
		
		that.options = $.extend({}, defaultOptions, options);
		
		return this.each(function(){
			
			var init = function() {
				$.ajax({
					url: "http://api.twitter.com/1/statuses/user_timeline/" + that.options.user + ".json",
					dataType: 'jsonp',
					success: addToElement
				});
			};
			
			var addToElement = function(data, testStatus, xhr) {
				var element = '';
				
				for(var i = 0; i < that.options.numberOfTweets; i++) {
					if (typeof data[i] != 'undefined') {
						element += '<div class="tweet">' + createTweetContainerAndAppend(data[i]).text() + '</div>';
					}
				}
				var tweets = element.replace(/([A-Za-z]{3,9}):\/\/([-;:&=\+\$,\w]+@{1})?([-A-Za-z0-9\.]+)+:?(\d+)?((\/[-\+~%/\.\w]+)?\??([-\+=&;%@\.\w]+)?#?([\w]+)?)/g,
	"<a target=\"_blank\" href=\"$&\">$&</a>");
				tweets = tweets.replace(/(^|[^a-z0-9_])#([a-z0-9_]+)/gi, "$1#<a href=\"https://twitter.com/#!/search/%23$2\">$2</a>");
				tweets = tweets.replace(/(^|[^a-z0-9_])@([a-z0-9_]+)/gi, "$1@<a href=\"https://www.twitter.com/$2\">$2</a>");
				element = tweets;
				$(that).html(element);
				
				that.options.callback();
			};
			
			var createTweetContainerAndAppend = function(tweet) {
				return $("<p/>").text(tweet.text);
			};
			
			init();
		
		});
	};
})(jQuery);