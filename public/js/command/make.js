function Make() {

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
}