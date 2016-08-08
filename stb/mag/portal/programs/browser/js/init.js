//$("html").onkeydown(function (e){keyListener(e)});

if ( typeof(Api) == 'undefined' ){
	Api = new StbApi();
	
	//stbww = stbWebWindow;
}

$(document).ready(function(){

	stbWindowMgr.openWebWindow('http://www.briz.ua')
})