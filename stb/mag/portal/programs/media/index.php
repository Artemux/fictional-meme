<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>

<head>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
	<meta name="author" content="Vladimir" /> 
	<meta http-equiv="Content-Language" content="ru"/>
	 
    <script type="text/javascript" src="../js_lib/jquery-1.5.min.js"></script>
	<script language="javascript" src="../js_lib/MagApi.js"></script>   
    
    <script language="javascript" src="./js/VodPlayer.js"></script>
    <script language="javascript" src="./js/Volume.js"></script>
	<script language="javascript" src="./js/menu.js"></script>
	<script type="text/javascript" src="./js/Status.js"></script>
    <script language="javascript" src="./js/function.js"></script>
    <script language="javascript" src="../js_lib/PlayerSettings.js"></script>
	<script type="text/javascript" src="../js_lib/clock.js"></script>
	<script type="text/javascript" src="../js_lib/weather-widget.js"></script>
    <script type="text/javascript" src="./js/index.js"></script>
    <script type="text/javascript" src="../js_lib/event.js"></script>
	
    <link rel="stylesheet" type="text/css" href="./css/main.css" />
	<title>Media</title>
</head>

<body>

<div id="global" style="display: block;">
	<div id="header">
		<div id="left">
			<div class="image">
				<img src="./images/clock-v2.png" alt=""></img>
			</div>
					
			<div class="clock">
				11:30
				<br/>
				<span>12 сентября 2012</span>
			</div>
		</div>
		<div id="right">
		</div>
	</div><!-- #header-->
    <div class="title">USB STORAGE MEDIA</div>
    <div class="main">
		<div id="nav"></div>
        <div id="playlist_block">
        	<div id="playlist"></div>
        </div>
		<div id="page"></div>
    </div>
	
    <div class="footer">
		<div class="rounded green">&nbsp</div> Добавить Samba сервер
    </div>
</div>
<div id="InfoDiv" class="statusclass" style="visibility: hidden;"></div>
    <div id="popup">
        <div id="attr"></div>   
        <div id="detailed_info"></div>
        <div class="popup_menu">
            <div class="row" style="">
                <div class="cell" style="width: 160px; text-align: left;"><img src="./image/system/ButtonBack.png"/> закрыть</div>
                <div class="cell" id="deleteNPVR" style="width: 160px; text-align: center;"></div>
                <div class="cell" style="width: 180px;"><img src="./image/system/ButtonEnter.png"/> просмотр</div>
            </div>
        </div>
    </div>
    <div id="topDiv">
        <div id="clockDiv"></div>
        <div id="film_name"></div>
    </div>
    <div id="system">
    	<div id="box">
    		<div id="play_status" class="play"></div>
    		<div id="progress_bar">
    			<div id="progress_bar_block">
    				<div id="ProgressBar"></div>
    			</div>
    		</div>
    		<div id="timebar">
    			<div id="time" style="position: relative; margin-top: 2px;"></div>
    		</div>
    	
    	</div>
    </div>
	<div id="video_settings" style=" z-index: 999;display: none; color: white; width: 300px; height: 200px; top: 170px; left: 200px; position: absolute; background: url(./image/system/settings.png) no-repeat;">
		<div class="video_settings_block" style="padding: 45px 10px 10px 22px; display: block;">
			<div id="aspect" onfocus="setVideoParam('aspect');" onclick="videoSettings('aspect')" class="settingElement"></div>
			<div id="content" onfocus="setVideoParam('content');" onclick="videoSettings('content')" class="settingElement"></div>
			<div id="audio" onfocus="setVideoParam('audio');" onclick="videoSettings('audio')" class="settingElement"></div>
		</div>
	</div>
	<div id="Muted" style="display: none; position: fixed; top: 50%; left: 50%; margin: -64px 0 0 -64px;"><img title="" alt="" src="./image/system/muted.png"/></div>
	<div id="VolumeBlock" style="z-index: 999; position: fixed; right: 10px; overflow: hidden; width: 5%; height: 560px;">
		<div id="Volume" style="z-index: 999;margin-top: 50px; width: 100%; height: 400px;">
		</div>
	</div>
</body>
</html>