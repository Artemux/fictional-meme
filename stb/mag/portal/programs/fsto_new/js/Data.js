/*
 * @author Vladimir Pavlov kolobokhtc@gmail.com
 */

var Data =
{
	videoTypes : [],
  videoNames : [],
  videoURLs : [],
  videoExtendeds : [],
  videoImages : [],
	videoTypesRemoved : [],
	videoNamesRemoved : [],
	videoURLsRemoved : [],
	videoExtendedsRemoved : [],
	videoImagesRemoved : [],
	external_page: 0,
	max_loaded_external_page:2
}

Data.setVideoTypes = function(list)
{
    this.videoTypes = list;
}

Data.setVideoNames = function(list)
{
    this.videoNames = list;
}

Data.setVideoURLs = function(list)
{
    this.videoURLs = list;
}

Data.setVideoExtendeds = function(list)
{
    this.videoExtendeds = list;
}

Data.setVideoImages = function(list){
	this.videoImages = list;
}

Data.clearVideoTypesRemoved = function() {
	this.videoTypesRemoved = [];
}

Data.clearVideoNamesRemoved = function() {
	this.videoNamesRemoved = [];
}

Data.clearVideoURLsRemoved = function() {
	this.videoURLsRemoved = [];
}

Data.clearVideoExtendedsRemoved = function() {
	this.videoExtendedsRemoved = [];
}

Data.clearVideoImagesRemoved = function() {
	this.videoImagesRemoved = [];
}

Data.removeVideoType = function(index) {
	var arr = this.videoTypes.splice(index, 1);
	this.videoTypesRemoved.push(arr.pop());
}

Data.removeVideoName = function(index) {
	var arr = this.videoNames.splice(index, 1);
	this.videoNamesRemoved.push(arr.pop());
};

Data.removeVideoURL = function(index) {
	var arr = this.videoURLs.splice(index, 1);
	this.videoURLsRemoved.push(arr.pop());
}

Data.removeVideoExtended = function(index) {
	var arr = this.videoExtendeds.splice(index, 1);
	this.videoExtendedsRemoved.push(arr.pop());
}

Data.removeVideoImage = function(index) {
	var arr = this.videoImages.splice(index, 1);
	this.videoImagesRemoved.push(arr.pop());
}

Data.addVideoType = function(item_object, add_method)
{
	if (add_method && add_method == 'shift'){
		this.videoTypes.shift(item_object);
	} else {
		this.videoTypes.push(item_object);
	}
}

Data.addVideoName = function(item_object, add_method)
{

	if (add_method && add_method == 'unshift'){
		this.videoNames.unshift(item_object);
	} else {
		this.videoNames.push(item_object);
	}
}

Data.addVideoURL = function(item_object, add_method)
{
	if (add_method && add_method == 'unshift'){
		this.videoURLs.unshift(item_object);
	} else {
		this.videoURLs.push(item_object);
	}
}

Data.addVideoExtended = function(item_object, add_method)
{
	if (add_method && add_method == 'unshift'){
		this.videoExtendeds.unshift(item_object);
	} else {
		this.videoExtendeds.push(item_object);
	}
}

Data.addVideoImage = function(item_object, add_method)
{
	if (add_method && add_method == 'unshift'){
		this.videoImages.unshift(item_object);
	} else {
		this.videoImages.push(item_object);
	}
}

Data.getVideoType = function(index)
{
    var type = this.videoTypes[index];

    if (type)
    {
        return type;
    }
    else
    {
        return null;
    }
}

Data.getVideoTypes = function()
{
    return this.videoTypes;
}

Data.getVideoNames = function()
{
    return this.videoNames;
}

Data.getVideoURLs = function()
{
    return this.videoURLs;
}

Data.getVideoImages = function()
{
    return this.videoImages;
}

Data.getVideoExtendeds = function()
{
    return this.videoExtendeds;
}

Data.getVideoURL = function(index)
{
    var url = this.videoURLs[index];

    if (url)    // Check for undefined entry (outside of valid array)
    {
        return url;
    }
    else
    {
        return null;
    }
}

Data.getVideoImage = function(index)
{
    var image = this.videoImages[index];

    if (image)    // Check for undefined entry (outside of valid array)
    {
        return image;
    }
    else
    {
        return "http://www.briz.ua/images/users/no-logo.jpg";
    }
}

Data.getVideoName = function(index)
{
    var name = this.videoNames[index];

    if (name)    // Check for undefined entry (outside of valid array)
    {
        return name;
    }
    else
    {
        return null;
    }
}

Data.getCurrentVideoCount = function()
{
    return this.videoURLs.length;
}

Data.getVideoCount = function()
{
    return this.videoURLs.length + this.videoURLsRemoved.length;
}

Data.getVideoNames = function()
{
    return this.videoNames;
}

Data.getVideoExtended = function(index)
{
    var extended = this.videoExtendeds[index];

    if (extended)    // Check for undefined entry (outside of valid array)
    {
        return extended;
    }
    else
    {
        return "No extended info";
    }
}

Data.getExternalPage = function(){
	return this.external_page;
}

Data.setExternalPage = function(integer){
	this.external_page = integer;
}

Data.increaseExternalPage = function(){
	this.external_page += 1;/*
	if (this.external_page >= this.max_loaded_external_page){
		this.max_loaded_external_page = this.external_page;
	} else {
		this.external_page = this.max_loaded_external_page;
	}
*/
	return true;
}

Data.decreaseExternalPage = function(){

	if (this.external_page > 0){
		this.external_page -= 1;
		return true;
	}

	return false;

}
