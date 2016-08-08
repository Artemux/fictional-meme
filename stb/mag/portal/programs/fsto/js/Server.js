/*
 * @author Vladimir Pavlov kolobokhtc@gmail.com
 */
var Server = {
	playlistType : 'file',	
	playlistFile : 'playlist.m3u',	
	
	dataReceivedCallback : null,
	loader: null

}

Server.init = function() {

	this.loader = HtmlLoader;

	if (!this.loader){
		alert('Loader needed!!!');
	}
	
	this.loader.dataReceivedCallback = function(data, add_method){
		Server.createVideoList(data, add_method);
	}
	
	return true;
}

Server.fetchSubSections = function(url, add_method) {

	Popup.Show('Loading Sections...', 'always');
	this.loader.GetSubSections(url, add_method);

}

Server.fetchListSection = function(url, add_method) {

	Popup.Show('Loading Sections...', 'always');
	this.loader.GetListSection(url, add_method);

}

Server.fetchFolders = function(url, folder_id, add_method) {

	Popup.Show('Loading Folders...', 'always');
	this.loader.GetFolders(url, folder_id, add_method);

}

Server.fetchFiles = function(url, folder_id, add_method) {

	Popup.Show('Loading Files...', 'always');
	this.loader.GetFiles(url, folder_id, add_method);

}

Server.fetchSearch = function(name,add_method) {

	Popup.Show('Loading files...', 'always');
	this.loader.GetSearch(name, add_method);

}

Server.createVideoList = function(items, add_method) {
	Popup.Show('Preparing...', 'always');
	
	var videoTypes = [];
	var videoNames = [];
	var videoURLs = [];
	var videoExtendeds = [];
	var videoImages = [];

	var add_method = add_method;
	//console.log(items);
	
	$.each(items, function(index, item) {
		var type = item.type;
		var link = item.link;
		var name = item.name;
		var extended = item.extended;

		//console.log("type: " + type + " link: " + link + " name: " + name);
		if (link && name) {
			
			if (add_method){
				Data.addVideoType(type, add_method);
				Data.addVideoName(name, add_method);
				Data.addVideoURL(link, add_method);
				Data.addVideoExtended(extended, add_method);
			} else {
				videoTypes[index] = type;
				videoNames[index] = name;
				videoURLs[index] = link;
				videoExtendeds[index] = extended;
			}
			
		}

	});
	
	if (!add_method){
		Data.setVideoTypes(videoTypes);
		Data.setVideoNames(videoNames);
		Data.setVideoURLs(videoURLs);
		Data.setVideoExtendeds(videoExtendeds);
	}
	
	
	Popup.Show('Complete!', 1000);
	if (this.dataReceivedCallback) {
		this.dataReceivedCallback(add_method);
	}
}
