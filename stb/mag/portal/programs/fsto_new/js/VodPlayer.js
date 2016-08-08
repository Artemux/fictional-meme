/*
 * @author Vladimir Pavlov kolobokhtc@gmail.com
 */
function VodPlayer()
{
    this.sendAjax = false;
    this.dir = "/media/usbdisk/";
    this.PlayStatus = false;
    this.fileType = 'video';
    this.slideShow = true;
    this.slideShowDelay = 1000;
    this.slideShowTmId = null;
    this.loop = false;
    this.filmPlayed = '';

	var count = 0;

	this.Dir = function( dir ){

	}

	this.FF = function(){
		if ( global_state == 0 ) VodPlayer.Play();
		global_state = 1;
		count++;
		clearInterval ( wooYayIntervalId );
		if ( count >= 10 ){
			count = 0;
			if ( inc <= 240 ) inc = inc+10;
		}

		if (current_time+inc < stop_time){
			current_time = current_time+inc;
			CreateTime( current_time );
		}
		else{}
		document.getElementById("play_status").className = "ff";
		now = CreateTime( current_time );
		document.getElementById("time").innerHTML = now+"/"+stop_time_ed;
		bWidth = Math.floor( ( current_time/stop_time )*4*100 );
		document.getElementById("ProgressBar").style.borderLeftWidth = bWidth+"px"; //��������� �������� ����
		wooYayIntervalId = setInterval ( "CheckRewind()", 500 ); // �������� �� ���������� ������
	}

	this.REV = function(){
		if ( global_state == 0 ) this.Play();
		global_state=1;
		count++;
		clearInterval ( wooYayIntervalId );
		if ( count >= 10 ){
			if ( inc<=240 ) inc = inc+10;
		}
		if ( current_time-inc > start_time ){
			current_time = current_time-inc;
			CreateTime( current_time,'set' );
		}
		else{}
		document.getElementById("play_status").className = "rev";
		now = CreateTime( current_time );
		document.getElementById("time").innerHTML=now+"/"+stop_time_ed;
		bWidth = Math.floor( ( current_time/stop_time )*4*100 );
		document.getElementById("ProgressBar").style.borderLeftWidth = bWidth+"px";
		wooYayIntervalId = setInterval ( "CheckRewind()", 500 );
	}

	this.Play = function(){
		this.PlayStatus = true;
		if ( global_state == 1 ) // ���� ����������� ��������� ������
		{
			if ( current_time <= 0 ) current_time = 0;
			else if ( current_time >= stop_time ) current_time = stop_time;
			global_state = 0;
			duration = current_time;
			timer_status = 2;
			setTimeout('timer(timer_status)',1);
			CreateTime( current_time );
			if (this.fileType != 'music'){
				topDiv.Hide();
				system.Hide();
			}
			//ShowTime('off');
			Api.SetPosition( current_time );
			Api.Continue();
			keyrtn = false;
		}
		else if ( global_state == 2 ) //����� ����� �� �����
		{
			global_state = 0;
			if (this.fileType != 'music'){
				topDiv.Hide();
				system.Hide();
			}
			//ShowTime('off');
			if ( !cur_timer )
			{
				timer_status = 2;
				setTimeout('timer(timer_status)',1);
			}
			else
			{
				timer_status = 2;
				setTimeout('timer(timer_status)',1);
			}
			Api.Continue();
			keyrtn=false;
		}
		else if ( global_state == 0 ) //����� �������������
		{
			Api.Pause();
			global_state = 2;
			timer_status = 1;
			setTimeout('timer(timer_status)',1);
			//ShowTime('on');
			topDiv.Show('','always');
			system.Show('','always');
			document.getElementById("play_status").className = "pause";
		}
		else {alert("else");}
	}

	this.PlayNext = function(){
		if (Menu.IsLastElement()){
			this.Exit();
		} else {
			Menu.Next();
			Channel.Play();
		}

	}

	this.PlayPrev = function(){
		Menu.Prev();
		Channel.Play();
	}

	this.Stop = function(){
		defAudio = 0;

		Api.Stop();
		this.PlayStatus = false;

		if ( this.loop == true ){
			this.Loop();
		}

		if ( this.slideShow == true && this.loop == false ){
			this.SlideShow();
		}

		if ( this.loop == false && this.slideShow == false ){
			this.Exit();
			topDiv.Hide();
			system.Hide();
		}

	}

	this.Exit = function(){

		if ( cur_timer ) clearTimeout( cur_timer );
		params = filmname+"|"+current_time;
		setCookie("timeToSave", params, "", "/");
		clearTimeout(this.slideShowTmId);
		this.slideShowTmId = null;
		Api.Stop();
		this.PlayStatus = false;
		this.filmPlayed = '';
		Api.SetTopWin(0);
		$("body").css("background-image","url(./images/bg-main-list-blue.png)");
		document.getElementById("global").style.display = "block";
		topDiv.Hide();
		system.Hide();
    $("#search").attr("disabled", false);
    $("#hide_focus_from_search").focus();
	}

	this.SlideShow = function(){
		if ( this.slideShowTmId != null){
			clearTimeout(this.slideShowTmId);
			this.slideShowTmId = null;
		}
		this.slideShowTmId = eval("setTimeout(function(){VodPlayer.PlayNext();},"+this.slideShowDelay+")");
	}

	this.Loop = function(){
		Channel.Play();
	}

	this.VolumeUp = function(){
		Api.GetVolume(volume);
		if (volume <= 100)
			{
				volume=volume+1;
				Api.SetVolume(volume);
			}
		else {}
	}

	this.VolumeDown = function(){
		Api.GetVolume(volume);
		if (volume >= 0)
		{
			volume=volume-1;
			Api.SetVolume(volume);
		}
	}

	this.Mute = function(){
			Api.Mute();
			keyrtn=false;
	}

	this.MediaInfo = function(){
		return 0;
	}

	this.GetFileType = function( filename ){

		var image_pat = /(?:\.jpg|\.jpeg)/;
		var music_pat = /(?:\.wav|\.mp3)/;

		if ( filename.toLowerCase().search(image_pat) != -1 ){
			topDiv.Show('',5000);
			system.Hide();
			this.slideShowDelay = 3000;
			this.fileType = 'image';
		} else if ( filename.toLowerCase().search(music_pat) != -1 ){
			$("body").css("background-image","url(./image/system/music_bg.jpg)");
			topDiv.Show('','always');
			system.Show('','always');
			this.slideShowDelay = 500;
			this.fileType = 'music';
		} else {
			topDiv.Show('',5000);
			system.Show('',5000);
			this.slideShowDelay = 500;
			this.fileType = 'video';
		}
		return this.fileType;

	}
}
