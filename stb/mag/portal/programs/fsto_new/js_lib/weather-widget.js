/*
 * @author Vladimir Pavlov kolobokhtc@gmail.com
 */
var WeatherWidget = function(div) {

	$.ajax({
		type : 'post',
		url : '../weather.php',
		dataType : 'json',
		data : 'getCurWeather=1',
		beforeSend : function() {
			//$('#loading').show();
		},
		success : function(data) {
			var html = '<img width="75px" src="./images/weather/'+data.pict+'.png" alt="" />';
			html += '<div class="temp">' + data.temp[0] + '</div>';
					
			$(div).html(html);
		},
		error: function(){
			$(div).html('Ошибка!');
		}
	});
	
	setTimeout("WeatherWidget('" + div + "')", 2 * 60 * 60 * 1000);
}