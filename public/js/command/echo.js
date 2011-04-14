function Echo() {

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
}