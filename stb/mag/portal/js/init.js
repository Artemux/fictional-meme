if ( typeof(Api) == 'undefined' ){
	Api = new StbApi();
}

var Menu = new MenuObj();



$(document).ready(function() {
	$("html").keyup(function(e) {
			Menu.keyListener(e);
		});

	/*$("html").keydown(function(e) {
		Menu.keyListener(e);
	});
*/
	Clock("#header #left .clock");
	WeatherWidget("#header #right");
	
	Menu.Init();
	Api.SetDefaults();
	
	//Api.SetAutoUpdate(); 
	
	$.post("./plugins/news/news.php", { getNews: "check" },
		function(data){
			if (data == 1) {
				$('#newMessage').show();
			}
  	});
	
	//Menu.SwitchBG($("ul.nav_list li.active a").attr('id'));
	
})