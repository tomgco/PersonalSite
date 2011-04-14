function Help() {

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
}