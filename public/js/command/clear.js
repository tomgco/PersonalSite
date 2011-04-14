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
}