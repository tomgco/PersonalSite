function Setup(config) {
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