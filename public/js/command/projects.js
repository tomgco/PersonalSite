function Projects() {

	init();

	function init() {
		$(document).bind("Projects.Init", onCommandInit);
	}

	function onCommandInit() {
		var projects = {
				"www.shortlist.com": "ShortList: A free lifestyle magazine.",
				"www.stylist.co.uk": "Stylist Magazine.",
				"www.jarredchristmas.com": "Jarred Christmas: A google maps based gig site - currently not live.",
				"www.gawkwall.com": "Gawk Wall, A social video site, which i'm currently developing an iPhone app for.",
				"www.tomg.co": "This site built using javascript, Php and soon to be 'node.js'",
				"www.tomg.co/followme": "Follow Me: A service to follow the ones you love on their jounery home."
		};
		var paramsString = Terminal.prototype.parsedCommand().params.join(" ");
		var string ='';
		if (projects[paramsString] !== undefined) {
			string = "Project Information for: " + paramsString + "<br />";
			string += "<br />" + "<a target=\"_blank\" href=\"http://" + paramsString + "\">" + paramsString + "</a>" + " - " +  projects[paramsString];
		} else {
			string = "These are the the following projects I am currently / have worked on:<br />";
			$.each(projects, function(key, value) {
					string += "<br />" + "<a target=\"_blank\" href=\"http://" + key + "\">" + key + "</a>" + " - " + value;
			});
		}
		$("#terminal").append(string + "<br />");
		$(".command").val("");
	}
}