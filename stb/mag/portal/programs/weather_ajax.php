<?php

function GetWeatherSource() {

  $res = @simplexml_load_file("http://192.168.1.100/dlink2/data/weather.xml");

  return $res;

}

function GetCurrentWeatherSource() {

  $res = @simplexml_load_file("http://192.168.1.100/dlink2/data/weather_current.xml");

  return $res;

}

function getDateFormatted($date) {

  $date = str_replace("T", " ", $date);
  $unixtime = strtotime($date);
  return array('data' => date('j-m-Y', $unixtime), 'time' => date('G:i:s', $unixtime));

}

function GetWeatherIcon($api_icon, $useImagePath = TRUE) {

  $imageurl = ($useImagePath) ? "./images/weather/" : "";
  $api_icon = trim($api_icon);
  $transc_array = array(

    '01d' => '_0_sun.png',
    '02d' => '_1_sun_cl.png',
    '03d' => '_2_cloudy.png',
    '04d' => '_3_pasmurno.png',
    '09d' => '_5_rain.png',
    '10d' => '_4_short_rain.png',
    '11d' => '_6_lightning.png',
    '13d' => '_9_snow.png',
    '50d' => '_3_pasmurno.png',
    '01n' => '_0_moon.png',
    '02n' => '_1_moon_cl.png',
    '03n' => '_2_cloudy.png',
    '04n' => '_3_pasmurno.png',
    '09n' => '_5_rain.png',
    '10n' => '_4_short_rain.png',
    '11n' => '_6_lightning.png',
    '13n' => '_9_snow.png',
    '50n' => '_3_pasmurno.png',
    'not' => '_255_NA.gif'

  );
  //var_dump ($transc_array[$api_icon]);
  return (isset($transc_array[$api_icon])) ?
                $imageurl.$transc_array[$api_icon] : $imageurl.$transc_array['not'];


}

function GetCurTemperature(){
    //$weather = @simplexml_load_file("http://192.168.1.100/dlink2/data/weather.xml");
    //return $weather->current->t;
    $weather = GetCurrentWeatherSource();
    return $weather->current->temperature->value;

}

function GetCurrentWeather() {

  $weather = GetCurrentWeatherSource();
  $temp = round($weather->temperature['value']);
  $arr['temp'] = ($temp > 0) ? "+" . $temp : $temp;
  
	$currImg = $weather->weather['icon'];
	$arr['pict'] = GetWeatherIcon($currImg, FALSE);
	return json_encode($arr);


}

function ShowWeather(){

    $weather = GetWeatherSource();//@simplexml_load_file("http://192.168.1.100/dlink2/data/weather.xml");

    if (!$weather){
      $infa = " <link rel=\"stylesheet\" type=\"text/css\" href=\"../css/programs.css\" />
      <div class=\"weather_container\" style=\"position:  relative; overflow: hidden; width: 50%; \">
          <h4>Нет данных прогноза погоды.<br> Приносим свои извинения за неудобства!<h4>
                  В связи с прекращением функционирования поставщика данных прогнозов погоды,<br>
                  данный сервис не будет работать до 30 октября 2015г.
              </div>";

        return $infa;
    }

    $curr_Weather = GetCurrentWeatherSource();
    
    $cur_temp = @round($curr_Weather->temperature['value']);
    $cur_temp_sign = ($cur_temp > 0) ? "+".$cur_temp : $cur_temp;

    
                    echo"
                     <link rel=\"stylesheet\" type=\"text/css\" href=\"./css/programs.css\" />
                     <div id=\"weather_main\" style=\"position:  relative; overflow: hidden; width: 100%; \">
                             <div id=\"weather_block\" style=\"margin-left: 30%;position: relative; width: 1200px; height: 230px;\">
                                <div id=\"cur\" class=\"weatherBodyActive\" align=\"center\" style=\"\">
                                    <span><b>Текущая погода</b></span><br/><br/>
                                    <img src=\"".GetWeatherIcon($curr_Weather->weather['icon']). "\" width=\"75px\"><br/>
                                    По ощущениям: <b>". $cur_temp_sign . "</b> °C<br/>
                                    Давление: <b>".$curr_Weather->pressure['value'] * 0.75 . "</b> мм.рт.ст.<br/>
                                    Ветер: <b>".GetWindDirection($curr_Weather->wind->direction['code']) . "</b>, ".$curr_Weather->wind->speed['value']." м/с<br/>
                                    Влажность: <b>".$curr_Weather->humidity['value'] . "</b>%<br/>
                                </div>";

                    $ix = 0;

                    foreach ($weather->forecast->time as $timeblock) {

                      $ix++;
                      $data_from = getDateFormatted($timeblock['from']);
                      $data_to = getDateFormatted($timeblock['to']);
                      $date = $data_from['data'];
                      $time_from = $data_from['time'];
                      $time_to = $data_to['time'];
                      $raw_temp = @round($timeblock->temperature['value']);
                      $real_temp = ($raw_temp > 0) ? "+".$raw_temp : $raw_temp;


                      echo "

                      <div id=\"". $ix ."\" class=\"weatherBody\"  align=\"center\" style=\"\">
                          <span>на <b>".$date ." c " . $time_from . " по " . $time_to . "</b></span><br/><br/>
                          <img src=\"".GetWeatherIcon($timeblock->symbol['var']) . "\" width=\"75px\"><br/>
                          Температура: <b>". $real_temp . "</b> °C<br/>
                          Давление: <b>".$timeblock->pressure['value'] * 0.75 . "</b> мм.рт.ст.<br/>
                          Ветер: <b>".GetWindDirection($timeblock->windDirection['code'])."</b>, ".$timeblock->windSpeed['mps'] ." м/с<br/>
                          Влажность: <b>".$timeblock->humidity['value'] ."</b>%<br/>
                      </div>";
                    }

                    echo '      </div>
                            </div>
                        <div id="back_button" style="width: 221px; margin-top: 150px;"><img src="./images/button_back.png"/></div>
                        </div> ';
    echo '
        <div class="clearfix">&nbsp;</div>
		<script type="text/javascript" src="./programs/js_lib/weather.js"></script>
        ';
}
function GetWindDirection($value){
    //$wind=getTextRumb($value);
    switch($value) {
		case "N":	$wind_direction = "С"; break;
		case "NNE":	$wind_direction = "С-СВ"; break;
		case "NE":	$wind_direction = "СВ"; break;
		case "ENE":	$wind_direction = "В-СВ"; break;
		case "E":	$wind_direction = "В"; break;
		case "ESE":	$wind_direction = "В-ЮВ"; break;
		case "SE":	$wind_direction = "ЮВ"; break;
		case "SSE":	$wind_direction = "Ю-ЮВ"; break;
		case "S":	$wind_direction = "Ю"; break;
		case "SSW":	$wind_direction = "Ю-ЮЗ"; break;
		case "SW":	$wind_direction = "ЮЗ"; break;
		case "WSW":	$wind_direction = "З-ЮЗ"; break;
		case "W":	$wind_direction = "З"; break;
		case "WNW":	$wind_direction = "З-СЗ"; break;
		case "NW":	$wind_direction = "СЗ"; break;
		case "NNW":	$wind_direction = "С-СЗ"; break;
    }
    return $wind_direction;
}

function getTextRumb ($w_rumb) {
    if ($w_rumb >=0 && $w_rumb < 20) $wind_direction = "N";
	elseif ($w_rumb >=20 && $w_rumb < 35) $wind_direction = "NNE";
	elseif ($w_rumb >=35 && $w_rumb < 55) $wind_direction = "NE";
	elseif ($w_rumb >=55 && $w_rumb < 70) $wind_direction = "ENE";
	elseif ($w_rumb >=70 && $w_rumb < 110) $wind_direction = "E";
	elseif ($w_rumb >=110 && $w_rumb < 125) $wind_direction = "ESE";
	elseif ($w_rumb >=125 && $w_rumb < 145) $wind_direction = "SE";
	elseif ($w_rumb >=145 && $w_rumb < 160) $wind_direction = "SSE";
	elseif ($w_rumb >=160 && $w_rumb < 200) $wind_direction = "S";
	elseif ($w_rumb >=200 && $w_rumb < 215) $wind_direction = "SSW";
	elseif ($w_rumb >=215 && $w_rumb < 235) $wind_direction = "SW";
	elseif ($w_rumb >=235 && $w_rumb < 250) $wind_direction = "WSW";
	elseif ($w_rumb >=250 && $w_rumb < 290) $wind_direction = "W";
	elseif ($w_rumb >=290 && $w_rumb < 305) $wind_direction = "WNW";
	elseif ($w_rumb >=305 && $w_rumb < 325) $wind_direction = "NW";
	elseif ($w_rumb >=325 && $w_rumb < 340) $wind_direction = "NNW";
	else $wind_direction = "N";
	return $wind_direction;
}

if (isset($_GET['curTemp'])){
    if ($_GET['curTemp'] == 1){
        echo GetCurTemperature();
    }
}
if (isset($_GET['all'])){
        if ($_GET['all'] == 1){
        echo ShowWeather();
    }
}

if (isset($_POST['getCurWeather'])){
	echo GetCurrentWeather();
}
?>
