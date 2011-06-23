(function() {
	var s = document.createElement('script'), t = document.getElementsByTagName('script')[0];
	s.type = 'text/javascript';
	s.async = true;
	s.src = 'http://api.flattr.com/js/0.6/load.js?mode=auto';
	t.parentNode.insertBefore(s, t);
})();
(function (window, document) {
	var ref = document.getElementsByTagName('script')[0],
	script = document.createElement('script'),
	secure = window.location.protocol === 'https:';
	script.async = true;
	script.src = secure ? 'https://secure-platform.tiptheweb.org/tip/button.js': 'http://platform.tiptheweb.org/tip/button.js';
	ref.parentNode.insertBefore(script, ref);
}(this, this.document));
