$(function() {
	var reset = false;
	var finished = true;
	var elmnt = $('#main-content');
	var width = elmnt.width() / 2;
	var height = elmnt.height() / 2;
	var offset = elmnt.offset();


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
});