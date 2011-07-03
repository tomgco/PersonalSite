$(function() {
	var reset = false;
	var finished = true;
	var elmnt = $('#main-content');
	var width = $('#main-content').width() / 2;
	var height = $('#main-content').height() / 2;
	var offset = $('#main-content').offset();


	$('#main-content').mousemove(function(e){
		var x = e.pageX - offset.left;
		var y = e.pageY - offset.top;
		
		if ((x < width) && (y < height)) {
			elmnt.attr('class', 'top-left');
		}
		
		if ((x < width) && (y > height)) {
			elmnt.attr('class', 'bottom-left');
		}

		if ((x > width) && (y < height)) {
		elmnt.attr('class', 'top-right');
		}
		
		if ((x > width) && (y > height)) {
			elmnt.attr('class', 'bottom-right');
		}
		
	});
});