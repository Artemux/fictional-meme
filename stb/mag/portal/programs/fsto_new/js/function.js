/*
 * @author Vladimir Pavlov kolobokhtc@gmail.com
 */

if ( typeof(Api) == 'undefined' ){
	Api = new StbApi();
}

var filename = new Array();
var description = new Array();
var image = new Array();
var name = new Array();
var stop_time1 = new Array();
var num_page;
var page;
var page_element = 11;
var curpos;
var setfocus;
var playurl = "";
var switchtimer = null;
var duration = 0;
var filmname;
var inc = 10;
var global_state = 0;
var start_time = 0;
var stop_time = 15;
var stop_time_ed;
var current_time = 0;
var stop_time_ed = 0;
var timer_status;
var cur_timer;
var wooYayIntervalId = 0;
var statusIntervalId = 1;
var bWidth;
var req;
var filmname;
var FilmID;
var sendWatched = true;
var clockID = null;
var filter = "all";
var filterRus = [];
filterRus["all"] = "Все фильмы";
filterRus["watched"] = "Просмотренные";
filterRus["boevik"] = "Боевик";
filterRus["komedia"] = "Комедия";
filterRus["mult"] = "Мультфильм";
filterRus["drama"] = "Драма";
filterRus["travel"] = "Приключения";
filterRus["npvr"] = "ТВ запись"
var setting = [];
setting[1] = "aspect";
setting[2] = "content";
setting[3] = "audio";

//setCookie("foo", "bar", "Mon, 01-Jan-2001 00:00:00 GMT", "/");

function ShowClock(val){
    if (val == "on"){
    	clearTimeout(clockID)
    	var time = new Date();
    	var clockHour = time.getHours();
    	var clockMinute = time.getMinutes();
    	if (clockMinute < 10){
    	    clockMinute = "0"+clockMinute;
    	}
    	var text = "<img src=\"./image/system/clock.png\"><span style=\"color: white; position: relative;top: -4px;font-size: 32px;\">&nbsp;"+clockHour+":"+clockMinute+"</span>";
    	document.getElementById("clockDiv").innerHTML = text;
    	var clockID = eval("setTimeout(function(){ShowClock('on')}, 10000)")
    }
    else{
    	clearTimeout(clockID);
    	clockId = null;
    }
}

function setCookie (name, value, expires, path, domain, secure) {
        document.cookie = name + "=" + escape(value) +
        ((expires) ? "; expires=" + expires : "") +
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") +
        ((secure) ? "; secure" : "");
}

//myVar = GetCookie("foo");
function getCookie(name) {
	var cookie = " " + document.cookie;
	var search = " " + name + "=";
	var setStr = null;
	var offset = 0;
	var end = 0;
	if (cookie.length > 0) {
		offset = cookie.indexOf(search);
		if (offset != -1) {
			offset += search.length;
			end = cookie.indexOf(";", offset)
			if (end == -1) {
				end = cookie.length;
			}
			setStr = unescape(cookie.substring(offset, end));
		}
	}
	return(setStr);
}
/*
function ChangePlaylistPage(pageNum)
{
	if( Api.GetEventCode() == 0 )
	{
		if (pageNum<=num_page) SetPlaylist(pageNum, filter);
	}
}
*/
function VODContinue()
{
	tempLastFilmTime = getCookie("timeToSave");
	if ( typeof(tempLastFilmTime)=='string' )
	{
		tempLastFilmTime = tempLastFilmTime.split("|");
		lastFilmTime = tempLastFilmTime[1]*1;
		lastFilmName = tempLastFilmTime[0];
	}

	if( lastFilmName == filmname )
	{
		current_time = lastFilmTime;
		duration = current_time;
		timer_status = 2;
		setTimeout('timer(timer_status)',1);
		CreateTime( current_time );
		Api.SetPosition( lastFilmTime );
	}
	else return;
}

function VODPlay(dir, filename, useProxy)
{

	// if (VodPlayer.PlayStatus === false){
        $("body").css("background-image","url()");
		document.getElementById("global").style.display = "none";
		filmname = dir+filename;
		if ( VodPlayer.filmPlayed == filmname &&  VodPlayer.loop == false ){
			VodPlayer.Exit();
		} else {
			VodPlayer.filmPlayed = filmname;
			//alert('need proxy:' + Api.NeedProxy());
			if (Api.NeedProxy()){
				Api.PlayMediaProxy(filmname);
			} else {
				Api.PlayMedia(filmname);
			}

			filename = Data.getVideoName(Menu.GetItemId())
			VodPlayer.GetFileType(filename);
			VodPlayer.PlayStatus = true;
			global_state = 0;

			//setTimeout(SetMediaLen,2000);

			document.getElementById("film_name").innerHTML = "<b>\""+filename+"\"</b>";
			document.getElementById("play_status").className = "play";

			//setTimeout(VODContinue,2000);
		}
//	}
}
function SetMediaLen(){
		stop_time = Api.GetMediaLen();
		stop_time_ed = CreateTime( stop_time );
		if (cur_timer) cur_timer=0;
		cur_timer = setTimeout('timer(0)',1);
}

function CheckRewind()
{
	document.getElementById("play_status").className = "pause";
	inc = 10;
	clearInterval ( wooYayIntervalId );
}

function CheckStopping()
{
	if( Api.GetEventCode() == 6 )//Stopping
	{
		if( switchtimer ) clearTimeout(switchtimer);
		switchtimer = setTimeout( CheckStopping,3000 );
	}
	else
	{
		KeyHandler(event);
	}
}

function CreateTime(temp_time, status)
{
	var hours = 0;
	var minutes = 0;
	var seconds = 0;

	seconds = temp_time-minutes*60-hours*3600;

	if ( seconds >= 60 )
		{
			minutes += Math.floor( temp_time/60 );
		}
	if ( minutes >= 60 )
	{
		hours += Math.floor( minutes/60 );
	}
	if ( hours != 0 ) minutes -= hours*60;
	seconds = temp_time-minutes*60-hours*3600;

	if ( minutes <= 9 ) minutes = '0'+minutes;
	if ( seconds <= 9 ) seconds = '0'+seconds;
	time = hours+':'+minutes+':'+seconds;
	if (status == 'set')
	{
		time = time+"/"+stop_time_ed;
		document.getElementById("time").innerHTML = time;
		document.getElementById("ProgressBar").style.borderLeftWidth = bWidth;
		if ( global_state ==1 || global_state == 2 )
		{
			document.getElementById("play_status").className = "pause";
		}
		else if ( global_state == 0 )
		{
			document.getElementById("play_status").className = "play";
		}
	}
	return time;
}

function timer(status)
{
	if ( status == 0 )//initialize
	{
		current_time = start_time;
		clearTimeout(cur_timer,'set');
		cur_timer = setTimeout('timer()',1);
	}
	else if ( status == 1 )//pause
	{
		clearTimeout( cur_timer );
	}
	else//timer
	{
		UWTime = stop_time-600;
		if ( current_time < stop_time )
		{
			current_time++;
			duration++;
			CreateTime(current_time,'set');
			if(cur_timer) clearTimeout(cur_timer);
			cur_timer = setTimeout('timer()',1000);
			bWidth = Math.floor((current_time/stop_time)*4*100);
			document.getElementById("ProgressBar").style.borderLeftWidth = bWidth+"px";
		}
		else if ( current_time >= stop_time )
		{
			current_time=0;
			VodPlayer.Stop();
            //sendWatched = true;
		}
	}
}
