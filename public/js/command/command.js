function Command() {
	new Clear();
	new Echo();
	new Help();
	new Make();
	new Projects();
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
}