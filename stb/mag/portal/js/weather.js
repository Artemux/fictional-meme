var WeatherWidget = function(div) {

	$.ajax({
		type : 'post',
		url : './programs/weather_ajax.php',
		dataType : 'json',
		data : 'getCurWeather=1',
		beforeSend : function() {
			//$('#loading').show();
		},
		success : function(data) {
			var html = '<img width="75px" src="./images/weather/'+data.pict+'" alt="" />';
			html += '<div class="temp">' + data.temp + '</div>';

			$(div).html(html);
		},
		error: function(){
			$(div).html('Ошибка!');
		}
	});

	setTimeout("WeatherWidget('" + div + "')", 2 * 60 * 60 * 1000);
}
