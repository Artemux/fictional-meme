/*
 * @author Vladimir Pavlov kolobokhtc@gmail.com
 */

var genreID = 0;
var status = "global";
var prevStatus = "global";
var slideShow = false;
var slideShowDelay = 2000;
var files;
var dirs;
var autocomleteStatus = true;
var searchTimer = null;
var autoCompleteTimer = null;
var busy = false;
var busyComplete = false;

var loading = false;

var StartupMenu = new MenuExtended();
var VodPlayer = new VodPlayer();
var Setting = new Settings();

var Popup = new StatusWindow();
var InfoDiv = new Status();
var topDiv = new Status();
var system = new Status();

var Volume = new VolumeObj();

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

$(document).ready(function(){
	//Полифил для функции bind
	if (!Function.prototype.bind) {
	  Function.prototype.bind = function(oThis) {
	    if (typeof this !== 'function') {
	      // closest thing possible to the ECMAScript 5
	      // internal IsCallable function
	      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
	    }

	    var aArgs   = Array.prototype.slice.call(arguments, 1),
	        fToBind = this,
	        fNOP    = function() {},
	        fBound  = function() {
	          return fToBind.apply(this instanceof fNOP
	                 ? this
	                 : oThis,
	                 aArgs.concat(Array.prototype.slice.call(arguments)));
	        };

	    if (this.prototype) {
	      // Function.prototype doesn't have a prototype property
	      fNOP.prototype = this.prototype;
	    }
	    fBound.prototype = new fNOP();

	    return fBound;
	  };
	}

	Clock("#header #left .clock");

	stbEvent.onEvent = EventConrol;

	InfoDiv.onload("InfoDiv");
	topDiv.onload("topDiv");
	system.onload("system");

	$("#hide_focus_from_search").focus();
	$("#search").attr("disabled",true);
	var search = document.getElementById('search');
	search.addEventListener('input', LiveAutoComplete, false);

	Server.init();
	//Setting.Init();
	Menu.init('playlist');

	Popup.init('Popup','popup', false);

	Server.dataReceivedCallback = function() {
		Menu.SetList(Data.getVideoNames());
		Menu.Render();
		Menu.SetActiveItem();
	}

	var StartupMenuData = [];

	StartupMenuData.push({type:'main_sections',name:"Видео", link: '/video/', extended: {'image':'./images/movies-icon.png'}});
	StartupMenuData.push({type:'main_sections',name:"Аудио", link: '/audio/', extended: {'image':'./images/music-icon.png'}});

	Server.createVideoList(StartupMenuData);

	Volume.init();

	Api.InitStb();
	Api.SetAlpha(10);
	Api.Navigation(true);
	Api.DisableServiceButton();
	Api.Stop();
	Api.SetFull();
	Api.ShowMediaWin();
	Api.SetListFilesExt(".mkv .mov .mpg .avi .ts .mp4 .jpeg .jpg .mp3 .wav");
	Api.EnableVKButton();
    //setTimeout(FlashOn,1000);

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

	if (loading){
		return false;
	}

	if (Api && Api.standBy == 0){
		switch(key)
		{
			case VK_POWER:
				if (alt === true ){
					Api.StandBy();
					if (VodPlayer.PlayStatus){
						VodPlayer.Play();
					}
					if (Api.standBy == 1){
						if (VodPlayer.PlayStatus){
							VodPlayer.Play();
						}
					}
				}
			break;
		}
	} else {

		switch(key)
		{

		case VK_UP:

				if (settingActive == 0)
				{
					if (VodPlayer.PlayStatus === false){
						if (!$("#search").attr("disabled")){
							$("#search").attr("disabled",true);
						}
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
						if (!$("#search").attr("disabled")){
							$("#search").attr("disabled",true);
						}
						Menu.Next();
					}
				} else {
					Setting.ElementNext();
				}
			break;
			case VK_GREEN:
				if (alt === false){
					$("#search").attr("disabled",false);
					$("#search").focus();

					Api.ShowKeyboard();
				}
			break;

			case VK_POWER:
			//case VK_VIDEO_MODE:
			case VK_OSD:

				if ( alt === false && shift === false){
					Setting.ContentNext();
					Setting.Render();
					txt = "<font style=\"font-size: 20px; float: right; color: white;\">" + Setting.GetContentName() + "<\/font>";
					InfoDiv.Show(txt, 2000);
				}

				if (alt === true && shift === false ){
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

			case VK_OK:

				if(!Api.ShowKeyboardStatus()) {
					$("#search").attr("disabled",true);
					$("#hide_focus_from_search").focus();
				}
				if (!$("#search").attr("disabled")){
					$("#search").attr("disabled",true);
					$("#hide_focus_from_search").focus();
					Search();
					Api.HideKeyboard();
					return;
				}

				if (VodPlayer.PlayStatus === true){
					var quality = Menu.getQuality();
					if ( VodPlayer.fileType == 'image' ){
						VodPlayer.Stop();
						VodPlayer.PlayNext();
						topDiv.Show('',5000);
						system.Hide();
					} else{
						VodPlayer.Play();
					}
				} else {
					Channel.Play();
				}
			break;

			case VK_YELLOW:
				if(alt === false) {
					VodPlayer.slideShow = false;
					$('.player-status-slideshow').removeClass("on").addClass("off");
					if ( VodPlayer.loop == false ){
						VodPlayer.loop = true;
						$('.player-status-loop').removeClass("off").addClass("on");
						txt = "<font style=\"font-size: 20px; float: right; color: white;\">Режим Повтора Вкл<\/font>";
					} else {
						VodPlayer.loop = false;
						$('.player-status-loop').removeClass("on").addClass("off");
						txt = "<font style=\"font-size: 20px; float: right; color: white;\">Режим Повтора Выкл<\/font>";
					}

					InfoDiv.Show(txt, 2000);
				}
			break;

			case VK_RED:
				if(alt === false) {
					Menu.ResetElemNum();
					Menu.nextQuality();
					var index = Menu.getQualitiesSelectedIndex();
					if(index < Menu.GetQualities().length) {
						var quality = Menu.getQuality(index);
					}
					Channel.Play(quality);

					// Menu.ChangePage("flag");
					// Menu.RecountPages();
					// Menu.SelectFirst();
				  Menu.SetQualityHtml();
					//  Menu.SetPageHtml();
					//  Menu.SetBreadcrumbs();
					//  Menu.SelectFirst();
					//  Menu.SetActiveItem();
				}
			break;

			case VK_BLUE:
				if(alt === false) {
					VodPlayer.loop = false;
					$('.player-status-loop').removeClass("on").addClass("off");
					if ( VodPlayer.slideShow == false ){
						VodPlayer.slideShow = true;
						$('.player-status-slideshow').removeClass("off").addClass("on");
						txt = "<font style=\"font-size: 20px; float: right; color: white;\">Режим SlideShow Вкл<\/font>";
					} else {
						VodPlayer.slideShow = false;
						$('.player-status-slideshow').removeClass("on").addClass("off");
						txt = "<font style=\"font-size: 20px; float: right; color: white;\">Режим SlideShow Выкл<\/font>";
					}
					InfoDiv.Show(txt, 2000);
				}
			break;



			case VK_PG_UP:
				if (VodPlayer.PlayStatus === false){
					Menu.PagePrev();
				} else {
					VodPlayer.PlayPrev();
				}
			break;

			case VK_PG_DOWN:
				if (VodPlayer.PlayStatus === false){
					Menu.PageNext();
				} else {
					VodPlayer.PlayNext();
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
					} else if(Api.ShowKeyboardStatus()) {
							var autotext = $('.autocomplete').html();
							if(autotext.length > 0) {
								var autotext = $('.autocomplete').html();
								$('#search').val(autotext);
							}
					} else {
						Channel.Play();
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
						Menu.ResetElemNum();
						Channel.Prev();
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
					if ($("#search").attr("disabled")){
						Channel.Prev();
					}
				} else {
					VodPlayer.Exit();
				}
			break;

			case 89: //VK_INFO:
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

			case VK_MENU:
				var StartupMenuData = [];
				StartupMenuData.push({type:'main_sections',name:"Видео", link: '/video/', description: {}});
				StartupMenuData.push({type:'main_sections',name:"Аудио", link: '/audio/', description: {}});

				Server.createVideoList(StartupMenuData);
			break;

			case 107: //VK_VOL_UP:
				Volume.Plus();
			break;

			case 109: //VK_VOL_DOWN:
				Volume.Minus();
			break;

			case VK_MUTE:
				if ( alt === true ){
					Volume.Mute();
				}
			break;

			case VK_EXIT:
				if (VodPlayer.PlayStatus === false){
					$("#search").attr("disabled", true);
					$("#hide_focus_from_search").focus();
					if (Data.getVideoType(Menu.GetItemId()) == 'main_sections'){
						window.location.href = Api.GetHomePage();
					} else {
						Menu.ResetElemNum();
						Channel.Prev();
					}


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

function LiveSearch(){
	if (autocomleteStatus == true){
		var text = $('#search').val();
		if (text.length >= 3 && !busy){
			$('detail-block').show();
			if (searchTimer){
				clearTimeout(searchTimer);
			}
			busy = true;
			var wrapper = Server.fetchSearch.bind(Server, text);
			searchTimer = setTimeout(wrapper, 1000);
			//Server.fetchSearch(text);
		} else if (text.length == 0) {
				clearTimeout(searchTimer);
				$('#search').val('');
				Popup.Hide();
				var div = document.createElement('div');
				div.innerHtml = "Поиск пуст ...";
				div.classList.add('unselected');
				$('#playlist').append(div);
				$('.detail-block').hide();
			}
	}
	busy = false;
}

function LiveAutoComplete(){
	if (autocomleteStatus == true){
		if (autoCompleteTimer){
			clearTimeout(autoCompleteTimer);
			autoCompleteTimer = null;
		}
		$('.autocomplete').html('');
		var text = $('#search').val();
		if (text.length > 0 && !busyComplete){
			busyComplete = true;
			$('detail-block').show();
			var wrapper = Server.fetchAutoComplete.bind(Server, text);
			autoCompleteTimer = setTimeout(wrapper, 500);
		} else if (text.length == 0) {
				if (autoCompleteTimer){
					clearTimeout(autoCompleteTimer);
					autoCompleteTimer = null;
				}
				$('#search').val('');
				Popup.Hide();
				var div = document.createElement('div');
				div.innerHtml = "Поиск пуст ...";
				div.classList.add('unselected');
				$('#playlist').append(div);
				$('.detail-block').hide();
				setTimeout(function() {
					$('#search').html("");
				}, 1000);
			}
	}
	busyComplete = false;
}

function Search(){
	Menu.ResetElemNum();
	var text = $('#search').val();
	if (text.length >= 3){
		Channel.Search(text);
	}
}

function FSKeyListener(event)
{
	//var key = event.keyCode > 0 ? event.keyCode : event.charCode;
	var shift = event.shiftKey;
	var key = event.which;
	var alt = event.altKey;
	pat = /^(\S+)_(\S+)/;
	//$(".header").append(event.keyCode + ' which: ' + event.which );
	//alert(key + ' alt: ' + alt + ' shift: ' + shift);
    return KeyAction(key, shift, alt);
}

function objToString(o){var s='{';for(var p in o)
s+=p+': "'+o[p]+'",';return s+'}';}
