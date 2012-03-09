function Clear() {

	init();

	function init() {
		$(document).bind("Clear.Init", onCommandInit);
	}

	function onCommandInit() {
		$("#terminal").html("");
		$(".command").val("");
		//$(document).trigger("Terminal.Util.Clear");
	}
}function Command() {
	new Clear();
	new Echo();
	new Help();
	new Make();
	new Projects();
	new Ls();
	init();

	function init() {
		$(document).bind("Terminal.Model.Init", onModelInit);
	}

	function onModelInit() {
		assignEventListeners();
	}

	function assignEventListeners() {
		$(document).bind("Command.echo", echo);
		$(document).bind("Command.help", help);
		$(document).bind("Command.make", make);
		$(document).bind("Command.clear", clear);
		$(document).bind("Command.projects", projects);
		$(document).bind("Command.ls", ls);
	}

	function echo() {
		$(document).trigger("Echo.Init");
	}

	function help() {
		$(document).trigger("Help.Init");
	}

	function make() {
		$(document).trigger("Make.Init");
	}

	function clear() {
		$(document).trigger("Clear.Init");
	}

	function projects() {
		$(document).trigger("Projects.Init");
	}

	function ls() {
		$(document).trigger("Ls.Init");
	}
}function Echo() {

	init();

	function init() {
		$(document).bind("Echo.Init", onCommandInit);
	}

	function onCommandInit() {
		var echoString = Terminal.prototype.parsedCommand().params.join(" ");
		$("#terminal").append(echoString + "<br />");
		$(".command").val("");
		//$(document).trigger("Terminal.Util.Clear");
	}
}function Help() {

	init();

	function init() {
		$(document).bind("Help.Init", onCommandInit);
	}

	function onCommandInit() {
		var echoString = Terminal.prototype.parsedCommand().params.join(" ");
		$("#terminal").append("This is a list of commands that you can currently use!<br /><br />");
		$.each($.data(document, 'events').Command, function(key, value) {
			$("#terminal").append(value.namespace + "<br />");
		});
		$(".command").val("");
		//$(document).trigger("Terminal.Util.Clear");
	}
}function Make() {

	init();

	function init() {
		$(document).bind("Make.Init", onCommandInit);
	}

	function onCommandInit() {
		var string = "";
		var echoString = Terminal.prototype.parsedCommand().params.join(" ");
		switch (echoString) {
			case "me a sandwich":
				string = "No.";
				break;
			default:
				string = "make: *** No targets specified and no makefile found. Stop.";
		}
		$("#terminal").append(string + "<br />");
		$(".command").val("");
		//$(document).trigger("Terminal.Util.Clear");
	}
}function Projects() {

	init();

	function init() {
		$(document).bind("Projects.Init", onCommandInit);
	}

	function onCommandInit() {
		var projects = {
				"www.shortlist.com": "ShortList: A free lifestyle magazine.",
				"www.stylist.co.uk": "Stylist Magazine.",
				"www.jarredchristmas.com": "Jarred Christmas: A google maps based gig site - currently not live.",
				"www.gawkwall.com": "Gawk Wall, A social video site, which i'm currently developing an iPhone app for.",
				"www.tomg.co": "This site built using javascript, Php and soon to be 'node.js'",
				"www.tomg.co/followme": "Follow Me: A service to follow the ones you love on their jounery home."
		};
		var paramsString = Terminal.prototype.parsedCommand().params.join(" ");
		var string ='';
		if (projects[paramsString] !== undefined) {
			string = "Project Information for: " + paramsString + "<br />";
			string += "<br />" + "<a target=\"_blank\" href=\"http://" + paramsString + "\">" + paramsString + "</a>" + " - " +  projects[paramsString];
		} else {
			string = "These are the the following projects I am currently / have worked on:<br />";
			$.each(projects, function(key, value) {
					string += "<br />" + "<a target=\"_blank\" href=\"http://" + key + "\">" + key + "</a>" + " - " + value;
			});
		}
		$("#terminal").append(string + "<br />");
		$(".command").val("");
	}
}function Ls() {

  init();

  function init() {
    $(document).bind("Ls.Init", onCommandInit);
  }

  function onCommandInit() {
    var dir = [
        "How.I.Met.Your.Mother.S01E01.I.am.joking.got.you.mp4.torrent"
      , "node-v0.6.12.pkg"
      , "porn"
      , "me.jpg"
      , "index.js"
    ];
    var string ='';
    for (var i = 0; i < dir.length; i++) {
      string += dir[i] + '<br />';
    }
    $("#terminal").append(string + "<br />");
    $(".command").val("");
  }
}function Config(configData) {
	var apiLocation = configData.apiLocation;

	Config.prototype.getApiLocation = function() {
		return apiLocation;
	};

}function Terminal(configData) {
	var global = this;
	var historyPosition = 0;
	var history = [];
	//move to localStorage

	function init() {
		setup = new Setup();
		command = new Command();

		addEventListeners();

		$(document).trigger("Terminal.Model.Init");

		appendToContent();
	}

	function addEventListeners() {
		$(document).bind("keydown", textFocus);
		$(document).bind("Terminal.Cursor.Start", startCursorBlink);
		$(document).bind("Terminal.ParseCommand", parseCommand);
		$('.command').bind("keydown", updateTextInput);
		$('.command').bind("keyup", checkKeyPress);
	}

	function textFocus() {
		$('.command').focus();
	}

	function startCursorBlink() {
		cursorBlink = setInterval(function() {
			$(".cursor").toggleClass("hidden");
		}, 500);
	}

	function updateTextInput() {
		$('.text-input').html($('.command').val() + "<span class=\"cursor\">&nbsp;</span>");
	}

	function parseCommand() {
		var inputString = $('.command').val();
		_gaq.push(['_trackEvent', 'Commands', inputString]);
		Terminal.prototype.parsedCommand = function() {
			var input = inputString.split(" ").reverse();
			return command = {
				name: input.pop(),
				params: input.reverse()
			};
		};
		$(".text-input").remove();
		var commandName = Terminal.prototype.parsedCommand().name;
		$("#terminal").append(inputString);
		$("#terminal").append("<br />");
		if (commandName) {
			var commandExists = false;
			$.each($.data(document, 'events').Command, function(key, value) {
				if (value.namespace == commandName) {
					commandExists = true;
					$(document).trigger("Command." + commandName);
				}
			});
			if (!commandExists) {
				$("#terminal").append(commandName + ": command not found<br />");
				$(".command").val("");
			}
			history.push(inputString);
			historyPosition = history.length;
		}
		appendToContent();
	}

	function checkForCommands() {

	}

	function checkKeyPress(event) {
		if (event.keyCode == '13') {
			$(document).trigger("Terminal.ParseCommand");
			event.preventDefault();
		} else if (event.keyCode == '38') {
			traverseHistory();
		} else if (event.keyCode == '40') {
			traverseHistoryDown();
		} else {
			updateTextInput();
		}
	}

	function traverseHistory() {
		if ((history.length != 0) && (historyPosition != 0)) {
			historyPosition--;
			$(".command").val(history[historyPosition]);
			$(".text-input").html(history[historyPosition]);
		}
	}

	function traverseHistoryDown() {
		if ((history.length != 0) && (historyPosition != 0)) {
			historyPosition++;
			$(".command").val(history[historyPosition]);
			$(".text-input").html(history[historyPosition]);
		}
	}

	function appendToContent() {
		$("#terminal").append("guest@tomg.co:/$&nbsp;<span class=\"text-input\"><span class=\"cursor\">&nbsp;</span>");
		$(".command").val("");
		$("#terminal").attr({ scrollTop: $("#terminal").attr("scrollHeight") });
	}

	init();
}$(function() {
	terminal = new Terminal();
});

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-24124485-1']);
_gaq.push(['_setDomainName', 'tomg.co']);
_gaq.push(['_setAllowLinker', true]);
_gaq.push(['_trackPageview']);
_gaq.push(['_trackPageLoadTime']);

(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();(function($){
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
					url: "https://api.twitter.com/1/statuses/user_timeline/" + that.options.user + ".json",
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
})(jQuery);$(function() {
	var reset = false;
	var finished = true;
	var elmnt = $('#main-content');
	var width = elmnt.width() / 2;
	var height = elmnt.height() / 2;
	var offset = elmnt.offset();

	if ($('#main-content').children('#terminal').length > 0) {
		elmnt.mousemove(function(e){
			var x = e.pageX - offset.left;
			var y = e.pageY - offset.top;
		
			if ((x < width) && (y < height)) {
				elmnt.attr('class', 'top-left');
			} else if ((x < width) && (y > height)) {
				elmnt.attr('class', 'bottom-left');
			} else if ((x > width) && (y < height)) {
				elmnt.attr('class', 'top-right');
			} else if ((x > width) && (y > height)) {
				elmnt.attr('class', 'bottom-right');
			}
		});
	
		elmnt.mouseout(function(e) {
			elmnt.attr('class', 'normal');
		});
	}
});function Setup(config) {
	var config = config;

	init();

	function init() {
		$(document).bind("Terminal.Model.Init", onModelInit);
	}

	function onModelInit() {
		$(document).trigger("keydown");
		$(document).trigger("Terminal.Cursor.Start");
	}
}