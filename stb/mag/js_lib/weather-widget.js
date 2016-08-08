(function() {
		function WeatherWidget( div ){
			$.post("../portal/weather.php", { getWeather: "current" },
				function(data){
					$(div).html(data);
			});

		}
})();
