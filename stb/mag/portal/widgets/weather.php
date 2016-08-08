<?php
function GetCurTemperature(){
    $weather = @simplexml_load_file("http://192.168.1.100/dlink2/data/weather.xml");
    return $weather->current->t;
}

function GetCurWeather(){
	$weather = @simplexml_load_file("http://192.168.1.100/dlink2/data/weather.xml");
	$arr['temp'] = $weather->current->t;
	$currImg = explode(".",$weather->current->pict);
	$arr['pict'] = $currImg[0];
	return json_encode($arr);
}
function ShowWeather(){
    echo '
    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
    <html>
    <head>	
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <meta http-equiv="Content-Language" content="ru"/>
        <meta http-equiv="Pragma" content="no-cache"/>
        
	   	<script type="text/javascript" src="./js/jquery-1.5.min.js"></script>
	    <script type="text/javascript" src="./js/main.js"></script>
	    <script type="text/javascript" src="./js/clock.js"></script>
	    <script type="text/javascript" src="./js/MagApi.js"></script>
        <link rel="stylesheet" type="text/css" href="./css/main.css" />
    </head>
    <body>
    <div class="top">
        <div class="system">
            <div class="logo">
                <div style="font-size: 22px;"><b></b></div>
                <div style="font-size: 16px;"><strong><font color="#E07810"></font></strong></div>
            </div>
            <div style="top:30px;left:520px; position: fixed;" id="ClockDiv">12:30</div>
        </div>
        <div class="main" style="height: 520px;padding-top: 30px;color: white; font-size: 16px;">
            <div style="top: 100px; width: 700px; text-align: center; font-size: 32px; position: fixed;">ПРОГНОЗ ПОГОДЫ</div>';
    $weather = @simplexml_load_file("http://192.168.1.100/dlink2/data/weather.xml");
    if ($weather == ""){ 
        //echo "  <div class=\"weather_container\" align=\"center\">
		//		    <h2>No data for Weather plugin<h2>
        //            try again later
        //        </div>";
        return 0;
    }
    //print_r($weather);
    preg_match_all("/\d+:\d+:\d+/", $weather->current->time, $dateupdate);
    $currImg = explode(".",$weather->current->pict);
    $firstImg = explode(".",$weather->forecast->day[0]->pict);
    $secondImg = explode(".",$weather->forecast->day[1]->pict);
    $thirdImg = explode(".",$weather->forecast->day[2]->pict);
    $fourthImg = explode(".",$weather->forecast->day[3]->pict);
    $imageurl = "./plugins/weather/clipart/";
         echo"<div id=\"line\" style=\"height: 230px; top: 180px;\"></div>
                <div id=\"weather_main\" style=\" left: 20px;top:140px; position:  relative; overflow: hidden; width: 660px; \">
                 <div id=\"weather_block\" style=\"margin-left: 226px; position: relative; width: 1200px; height: 230px;\">   
                    <div id=\"cur\" class=\"weatherBodyActive\" align=\"center\" style=\"\">
                        <span><b>Текущая погода</b></span><br/><br/>
                        <img src=\"".$imageurl.$currImg[0].".png\" width=\"75px\"><br/>
                        По ощущениям: <b>".$weather->current->t_flik."</b> °C<br/>
                        Давление: <b>".$weather->current->p."</b> мм.рт.ст.<br/>
                        Ветер: <b>".GetWindDirection($weather->current->w_rumb)."</b>, ".$weather->current->w." м/с<br/>
                        Влажность: <b>".$weather->current->h."</b>%<br/>
                    </div>";       
        echo"
                    <div id=\"1\" class=\"weatherBody\"  align=\"center\" style=\"\">
                        <span>на <b>".$weather->forecast->day[0]['hour']."ч 00 мин.</b></span><br/><br/>
                        <img src=\"".$imageurl.$firstImg[0].".png\" width=\"75px\"><br/>
                        Температура: ".$weather->forecast->day[0]->t->min." - ".$weather->forecast->day[0]->t->max." °C<br/>
                        Давление: ".$weather->forecast->day[0]->p->min." - ".$weather->forecast->day[0]->p->max." мм.рт.ст.<br/>
                        Ветер: ".GetWindDirection($weather->forecast->day[0]->wind->rumb).", ".$weather->forecast->day[0]->wind->min." - ".$weather->forecast->day[0]->wind->max." м/с<br/>
                        Влажность: ".$weather->forecast->day[0]->hmid->min." - ".$weather->forecast->day[0]->hmid->max."%<br/>
                    </div>";
        echo"
                    <div id=\"2\" class=\"weatherBody\"  align=\"center\" style=\"\">
                        <span>на <b>".$weather->forecast->day[1]['hour']."ч 00 мин.</b></span><br/><br/>
                        <img src=\"".$imageurl.$secondImg[0].".png\" width=\"75px\"><br/>
                        Температура: ".$weather->forecast->day[1]->t->min." - ".$weather->forecast->day[1]->t->max." °C<br/>
                        Давление: ".$weather->forecast->day[1]->p->min." - ".$weather->forecast->day[1]->p->max." мм.рт.ст.<br/>
                        Ветер: ".GetWindDirection($weather->forecast->day[1]->wind->rumb).", ".$weather->forecast->day[1]->wind->min." - ".$weather->forecast->day[1]->wind->max." м/с<br/>
                        Влажность: ".$weather->forecast->day[1]->hmid->min." - ".$weather->forecast->day[1]->hmid->max."%<br/>
                    </div>";
        echo"
                    <div id=\"3\" class=\"weatherBody\"  align=\"center\" style=\"\">
                        <span>на <b>".$weather->forecast->day[2]['hour']."ч 00 мин.</b></span><br/><br/>
                        <img src=\"".$imageurl.$thirdImg[0].".png\" width=\"75px\"><br/>
                        Температура: ".$weather->forecast->day[2]->t->min." - ".$weather->forecast->day[2]->t->max." °C<br/>
                        Давление: ".$weather->forecast->day[2]->p->min." - ".$weather->forecast->day[2]->p->max." мм.рт.ст.<br/>
                        Ветер: ".GetWindDirection($weather->forecast->day[2]->wind->rumb).", ".$weather->forecast->day[2]->wind->min." - ".$weather->forecast->day[2]->wind->max." м/с<br/>
                        Влажность: ".$weather->forecast->day[2]->hmid->min." - ".$weather->forecast->day[2]->hmid->max."%<br/>
                    </div>";
//        echo"
//                    <div id=\"4\" class=\"weatherBody\"  align=\"center\" style=\"float:left;font-size: 12px; padding: 4px;\">
//                        <span>на <b>".$weather->forecast->day[3]['hour']."ч 00 мин.</b></span><br/>
//                        <img src=\"".$imageurl.$fourthImg[0].".png\" width=\"75px\"><br/>
//                        Температура: ".$weather->forecast->day[3]->t->min." - ".$weather->forecast->day[3]->t->max." °C<br/>
//                        Давление: ".$weather->forecast->day[3]->p->min." - ".$weather->forecast->day[3]->p->max." мм.рт.ст.<br/>
//                        Направление ветра: ".GetWindDirection($weather->forecast->day[3]->wind->rumb)."<br/>	
//                        Скорость ветра: ".$weather->forecast->day[3]->wind->min." - ".$weather->forecast->day[3]->wind->max." м/с<br/>
//                        Влажность: ".$weather->forecast->day[3]->hmid->min." - ".$weather->forecast->day[3]->hmid->max."%<br/>
//                    </div>";
    echo '      </div>
            </div>           
        <div id="back_button" style="width: 221px; margin-top: 150px;"><img src="./images/button_back.png"/></div>        
        </div>
        
    <div class="bottom">
        <p></p>
    </div>';
}
function GetWindDirection($value){
    $wind=getTextRumb($value);
    switch($wind) {
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
	echo GetCurWeather();
}
?>