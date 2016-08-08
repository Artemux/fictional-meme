$("html").keypress (function (e){keyListener(e)});

var genreID = 0;
var status = "global";
var prevStatus = "global";
var slideShow = false;
var slideShowDelay = 2000;
var files;
var dirs;
var VodPlayer = new VodPlayer();
var Setting = new Settings();
var Menu = new Menu();
var InfoDiv = new Status();
var topDiv = new Status();
var system = new Status();


Menu.Init("playlist", "Menu");

var arrGenre = new Array(3);
arrGenre[0] = "films";
arrGenre[1] = "photos";
arrGenre[3] = "musics";

var rusGenre = new Array(3);
rusGenre[0] = "фильмы";
rusGenre[1] = "фотографии";
rusGenre[2] = "музыка";

if ( typeof(Api) == 'undefined' ){
	Api = new StbApi();
}

var Volume = new VolumeObj();

$(document).ready(function(){
	Clock("#header #left .clock");
	WeatherWidget("#header #right");
	
	stbEvent.onEvent = EventConrol;
	
	Api.InitStb();
	Api.SetAlpha(10);
	Api.Navigation(true);
	Api.DisableServiceButton();
	Api.Stop();
	Api.SetFull();
	Api.ShowMediaWin();
	Api.SetListFilesExt(".mkv .mov .mpg .avi .ts .mp4 .jpeg .jpg .mp3 .wav");
	
	Api.MountAllSmb();
	
	InfoDiv.onload("InfoDiv"); 
	topDiv.onload("topDiv"); 
	system.onload("system"); 
	
    Menu.Info("Обработка данных...");
    Setting.Init(); 
    
    setTimeout(FlashOn,1000);
});

function FlashOn(){
	Menu.Info("Чтение данных...");
	Menu.SetDefault();
	Menu.LoadPlaylist();
	Menu.ShowInfo();
}

function FlashOff(){
	Menu.Info("Отсутствует флешка.");
}

function EventConrol(code){
	switch (code)
	{
		case '1':
			// end of film
			VodPlayer.Stop();
		break;
		case '2':
			// media info getted
			setTimeout(Setting.GetAudio(),15);
			setTimeout(SetMediaLen,10);
		break;
		case '5':
			// error no such media
			VodPlayer.Stop();
		break;
		default:
			//alert('no event getted');
		break;
	}
}

window.onunload = function() {
	Api.Stop();
}

function VodPlay(id){
	if ( Api.IsPlaying() === false){	
		$("#global").css("opacity",1);
		VODPlay(Menu.dir, Menu.files[id].name);
	}
}

var KeyAction = function(key, shift, alt){
	if (Api.standBy == 0){
		switch(key)
		{
			case VK_POWER:
				if (alt === true ){
					Api.StandBy();
					if (Api.standBy == 1){
						VodPlayer.Play();
					}	
				}
			break;
		}
	} else {
		switch(key)
		{	
			case VK_GREEN:
				if (alt === false) window.location.href = Api.GetSambaPage();
			break;
			case VK_RED:
				Api.SetWebProxy();
				
				//VODPlay('http://ru.fishki.net/picsw/052013/24/auto/video/6.flv','', true);
				
				VODPlay('http://fs.to/get/dl/5s6pxwb9jatqcljapytfxp4ty.0.1139013157.2185543202.1414679917/The.Judge.2014.1080p.HC.WEBRip.x264.mkv','', true);
				//VODPlay('http://n25.filecdn.to/ff/MzBhODJjZGUxYjYwMTA2NDU4YjVkZDUzZWQ0ZWYwMzN8ZnN0b3wxODQxODg4NDg2fDEwMDAwfDB8MHw5fDI1fGFiZDYxNjBlZGRkZjY2MTc0NjAwNTAyNmIzZjBiM2YxfDF8MTA6MC4yMzo2LjI1Om4uMzM6ZS4xMzppLjIzOm4uNDE6MXwwfDE5NDU3MTAyNjN8MTQxNDY3NzY3Ni42MDk1/Planeta.obezjan.Revolyutsiya.2014.D.WEB-DL.1080p.mkv','', true);
			break;
			case FlashDriveOn:
				if (alt === true){
					FlashOn();
				}
			break;
			case FlashDriveOff:
				if (alt === true){
					FlashOff();
				}
			break;
			
			case VK_POWER:
				if (alt === true ){
					Api.StandBy();
					if (Api.standBy == 1){
						VodPlayer.Play();
					}	
				}
			break;
			
			case VK_AUDIO_MODE:
				if ( alt === true ){
					Setting.AudioModeNext();
					Setting.Render();
					txt = "<font style=\"font-size: 20px; float: right; color: white;\">" + Setting.GetAudioModeName() + "<\/font>";
					InfoDiv.Show(txt, 2000);					
				}
			break;
			
			case VK_VIDEO_ASPECT:
				if ( alt === true ){
					Setting.AspectNext();
					Setting.Render();
					txt = "<font style=\"font-size: 20px; float: right; color: white;\">" + Setting.GetAspectName() + "<\/font>";
					InfoDiv.Show(txt, 2000);
				}
			break;
			
			case VK_VIDEO_MODE:
				if ( alt === true ){
					Setting.ContentNext();
					Setting.Render();
					txt = "<font style=\"font-size: 20px; float: right; color: white;\">" + Setting.GetContentName() + "<\/font>";
					InfoDiv.Show(txt, 2000);
				}
			break;	
					
			case VK_OK:
				if (VodPlayer.PlayStatus === true){
					if ( VodPlayer.fileType == 'image' ){
						VodPlayer.Stop();
						VodPlayer.PlayNext();
						topDiv.Show('',5000);
						system.Hide();
					} else{
						VodPlayer.Play();
					}
				} else {
					var $a = $("#el"+Menu.element);
					eval($a.attr('name'));
				}
			break;

			case VK_YELLOW:
				if(alt === false) {	
					if ( VodPlayer.loop == false ){
						VodPlayer.loop = true;
						txt = "<font style=\"font-size: 20px; float: right; color: white;\">Режим Повтора Вкл<\/font>";
					} else {
						VodPlayer.loop = false;
						txt = "<font style=\"font-size: 20px; float: right; color: white;\">Режим Повтора Выкл<\/font>";
					}
					
					InfoDiv.Show(txt, 2000);
				}
			break;
			
			case VK_BLUE:
				if(alt === false) {
					if ( VodPlayer.slideShow == false ){
						VodPlayer.slideShow = true;
						txt = "<font style=\"font-size: 20px; float: right; color: white;\">Режим SlideShow Вкл<\/font>";
					} else {
						VodPlayer.slideShow = false;
						txt = "<font style=\"font-size: 20px; float: right; color: white;\">Режим SlideShow Выкл<\/font>";
					}
					InfoDiv.Show(txt, 2000);
				}
			break;
			
			case VK_UP:
				if (settingActive == 0)
				{
					if (VodPlayer.PlayStatus === false){
						Menu.Prev();
					}
				} else {
					Setting.ElementPrev();
				}
			break;
			case VK_DOWN:
				if (settingActive == 0)
				{
					if (VodPlayer.PlayStatus === false){
						Menu.Next();
					}
				} else {
					Setting.ElementNext();
				}
			break;
			case VK_PG_UP:
				if (VodPlayer.PlayStatus === false){
					Menu.PrevPage()
				}
			break;
			case VK_PG_DOWN:
				if (VodPlayer.PlayStatus === false){
					Menu.NextPage()
				}
			break;
			case VK_STOP:
			if (VodPlayer.PlayStatus === true){
				if (alt === true){
					VodPlayer.Exit();
				}
			}
			break;
			case VK_PLAY:
				if (VodPlayer.PlayStatus === true){
					if ( alt === true){
						VodPlayer.Play();
					}
				}
			break;
			case VK_RIGHT:
				if (settingActive == 0)
				{
					if (VodPlayer.PlayStatus === true){
						if ( VodPlayer.fileType == 'image' ){
							VodPlayer.Stop();
							VodPlayer.PlayNext();
							topDiv.Show('',5000);
							system.Hide();
						} else {
							VodPlayer.FF();
						}
					}
				} else {
					Setting.Set('right');
				}
			break;
			case VK_FF:
				if (VodPlayer.PlayStatus === true){
					if ( alt === true){
						VodPlayer.FF();
					}
				}
			break;
			case VK_LEFT:
				if (settingActive == 0)
				{
					if (VodPlayer.PlayStatus === true){
						if ( VodPlayer.fileType == 'image' ){
							VodPlayer.Stop();
							VodPlayer.PlayPrev();
							topDiv.Show('',5000);
							system.Hide();
						} else{
							VodPlayer.REV();
						}
					} else {
						Menu.ChangeDir(-1);
					}
				} else {
					Setting.Set('left');
				}
			break;
			case VK_REV:
				if (VodPlayer.PlayStatus === true){
					if ( alt === true){
						VodPlayer.REV();
					}
				}
			break;
			case VK_BACK:
				if (VodPlayer.PlayStatus === false){
					Menu.ChangeDir(-1);
				} else {
					VodPlayer.Exit();
				}
			break;
			case VK_INFO:
				if (VodPlayer.PlayStatus === true){
					if (alt === true){

						if (topDiv.IsShow() == true || system.IsShow() == true ){
							topDiv.Hide();
							system.Hide();
						} else {
							if ( VodPlayer.fileType == 'image' ){
								topDiv.Show('','always');
								system.Hide();
							} else {
								topDiv.Show('','always');
								system.Show('','always');
							}
						}
					}
				}
			break;
			case VK_SETUP:
				x = document.getElementById("video_settings").style.display;
				
				if(x == 'none') {
					Setting.Render();		
					document.getElementById("video_settings").style.display = "block";
					settingActive = 1;
				} else {
					document.getElementById("video_settings").style.display = "none";
					settingActive = 0;
				}
				break;
			break;
			
			case VK_1:
				Api.AddSmbServer('172.17.24.14','vladimir','vladimir','vladimir','sc174661');
			break;
			case VK_2:
				Api.DeleteSmbServer('vladimir');
			break;
			case VK_3:
				Api.UnmountAllSmb();
			break;
			case VK_4:
				alert(Api.GetUserData('smb_data'));
			break;
			case VK_6:
				Api.MountAllSmb();
			break;
			case VK_VOL_UP:
				Volume.Plus();
			break;
			
			case VK_VOL_DOWN:
				Volume.Minus();
			break;
			
			case VK_MUTE:
				if ( alt === true ){
					Volume.Mute();
				}
			break;
			
			case VK_EXIT:
				if (VodPlayer.PlayStatus === false){
					window.location.href = Api.GetHomePage();
				} else {
					VodPlayer.Exit();
				}
			break;
			
			case VK_REFRESH:
				window.location.reload();
			break;
				
			default:
				keyrtn=false;
			break;
		}
	}
}
function keyListener(event)
{
	var handled = true;
	var key = event.keyCode > 0 ? event.keyCode : event.charCode;
	var shift =  event.shiftKey;
	var key = event.which;
	var alt = event.altKey;
	pat = /^(\S+)_(\S+)/;
    KeyAction(key, shift, alt);   
	return 1;
}

function objToString(o){var s='{';for(var p in o)
s+=p+': "'+o[p]+'",';return s+'}';}