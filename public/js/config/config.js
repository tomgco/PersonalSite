function Config(configData) {
	var apiLocation = configData.apiLocation;

	Config.prototype.getApiLocation = function() {
		return apiLocation;
	};

}