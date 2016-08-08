<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html><head>
<meta http-equiv="Pragma" content="no-cache"/>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<link rel="stylesheet" type="text/css" href="index.css"/>

<script type="text/javascript" src="../portal/js/MagApi.js"></script>
<script type="text/javascript" src="PageMenu.js"></script>
<script type="text/javascript" src="PageMenuEx.js"></script>
<script type="text/javascript" src="Status.js"></script>
<script type="text/javascript" src="Channel.js"></script>
<script type="text/javascript" src="timer.js"></script>
<script type="text/javascript" src="http://192.168.1.101/zyxel/load2.php"></script>
<script type="text/javascript" src="Settings.js"></script>
<script type="text/javascript" src="index.js"></script>
<script type="text/javascript" src="../portal/js/event.js"></script>
<script type="text/javascript" src="jquery-1.3.2.min.js"></script>

<title></title>
</head><body>
<div class="statusclass" style="top:30px;left:580px; font-size: 32px; z-index: 1;" id="ChanNumDiv"></div>
<div class="statusclass" style="top:400px;left:40px; z-index: 1;" id="ChanNameDiv"></div>
<div class="statusclass" style="top:30px;left:40px; z-index: 1;" id="ClockDiv"></div>
<div class="statusclass" style="top:27px;left: 220px; z-index:1; color: white;" id="AudioPIDs"></div>
<div class="statusclass" style="top:500px;left:0px; height: 50px; width: 640px; padding: 10px 40px 10px 40px;" id="NewsDiv"></div>
<div class="statusclass" style="position: fixed;z-index: 0; top: 0px; left: 0px; height: 90px; width: 100%; background-color: #262626; visibility: hidden; border-bottom: 2px solid #7f7f7f;" id="TopLine"></div>
<div class="alphaclass" id="BottomDiv"></div>
<div class="menuclass" id="MainMenu" style="z-index: 10;"></div>
<div class="menuclass" id="Fav1Menu"></div>
<div class="menuclass" id="Fav2Menu"></div>
<div class="menuclass" id="Fav3Menu"></div>
<div id="NewsBlock" style="z-index: 999; border-top: 2px solid #dddddd; border-bottom: 2px solid #dddddd; display: none; color: white; background-color: #111111; font-size: 18px; padding: 20px 140px 20px 60px;top: 70px; left: 0px; width: 600px; height: 400px; position: fixed;"></div>
<div id="video_settings" style=" display: none; color: white; width: 300px; height: 200px; top: 170px; left: 200px; position: absolute; background: url(./images/settings.png) no-repeat;">
	<div class="video_settings_block" style="padding: 45px 10px 10px 22px; display: block;">
		<div id="aspect" onfocus="setVideoParam('aspect');" onclick="videoSettings('aspect')" class="settingElementActive"></div>
		<div id="content" onfocus="setVideoParam('content');" onclick="videoSettings('content')" class="settingElement"></div>
		<div id="audio" onfocus="setVideoParam('audio');" onclick="videoSettings('audio')" class="settingElement"></div>
	</div>
</div>
<div id="timerDiv" style="display: none; position: fixed; top:200px; left: 210px; font-size: 18px; width: 300px; background: #111111 url(./images/timer_bckg.png) repeat-x;">
    <div style="color: white; text-align:  center; font-size: 30px; padding: 8px 2px;">ТАЙМЕР
        <div id='timerStatus' style="display: inline;"></div>
    </div>
    <div style="display: table;">
        <div style="display: table-row; height: 12px;"></div>
	<div style="display: table-row;letter-spacing:16px;">
    	    <div id="hour" class="timer" style="font-size: 44px; padding-left: 57px;  display: table-cell;"></div>
    	    <div id="minute" class="timerActive" style="font-size: 44px;  padding-left: 35px; width: 150px; display: table-cell;"></div>
	</div>
    </div>
    <div id="timerButton" style="text-align: center; color: white; padding: 5px 2px; border: 2px solid #999999; margin: 10px 20px; background: #333333 url(./images/timer_button.png) repeat-x;"></div>
</div>
<div id="EpgFull" style=" background: url(./images/main_bckg.png) repeat-x;display: none; position: fixed; top: 0px; left: 0px; padding: 15px 0 0 35px;"></div>
<iframe id="iframe1" style="display: none; opacity: 0.75; text-align:center; position: absolute; top: 440px;width:99%;background-color: silver; border: 0px solid black; color: white;"></iframe>
</body></html>