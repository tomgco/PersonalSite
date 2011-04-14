function Terminal(configData) {
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
		$("#terminal").append("guest@tomgallacher.info:/$&nbsp;<span class=\"text-input\"><span class=\"cursor\">&nbsp;</span>");
		$(".command").val("");
		$("#terminal").attr({ scrollTop: $("#terminal").attr("scrollHeight") });
	}

	init();
}