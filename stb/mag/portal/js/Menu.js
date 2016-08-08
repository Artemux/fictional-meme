var MenuObj = function() {

	this.type = 'nav_list';
	this.typeOld = 'nav_list';
	this.elId = 1;
	this.elIdOld = 1;
	this.elMax = 1;
	this.elCols = 0;
	this.elRows = 1;
	this.rowId = 1;
	this.inetState = false;
	this.popupClass = '.popup';
	this.popup = false;
	this.noInetMsg = '<h2>Нет интернета</h2><br/><p>Подключите приставку к роутеру.</p>';
	this.proxy = '';
	this.useProxy = true;

	this.Init = function() {
		this.GetLength();

		if ($.cookie('menuActive') == null){
			$.cookie('menuActive', 'TV');
		}

		$('#'+$.cookie('menuActive')).parent('li').attr('class','active');
		this.Action($.cookie('menuActive'), 'menu');

		this.CheckInternet();

		var proxyName = Api.GetDeviceIP();

		var proxyPassword = Api.GetDeviceMac().replace(/:/gi, '-');//.toUpperCase();

		/*
		 *	@Fix
		 *	disable the proxy if user connected to router
		 */
		var routerDHCP = /192\.168\.\d{1,3}\.\d{1,3}/;

		if ( Api.GetWifiLinkStatus() ){
			this.useProxy = false;
		}

		if ( routerDHCP.test(Api.GetDeviceIP()) ){
			this.useProxy = false;
		}

		if (this.useProxy === true){
			this.proxy = "proxy=http://" + proxyName + ":" + proxyPassword + "@192.168.1.114:3128";
		} else {
			this.proxy = 'a=1';
		}

	}

	this.UnbindKey = function() {
		$('html').unbind('keyup');
	}

	this.BindKey = function() {
		$("html").keyup(function(e) {
			Menu.keyListener(e);
		});
	}

	this.Action = function(key, type) {
		this.HideAlert();

		if(type == 'menu') {
			$.cookie('menuActive',key);
			$('ul.nav_list li.active').addClass('visited');
			switch(key) {
				case 'TV':
					this.Load("./TV.html");
				break;
				case 'SOFT':
					this.Load("./SOFT.html");
				break;
				case 'ACCOUNT':
					this.UnbindKey();
					this.Load("./account.php");
				break;
				case 'SETTINGS':
					Api.SetupDlg();
				break;
				default:
					this.ShowAlert('No such action');
				break;
			}
		} else {
			$('#loading').show();
			switch(key){
				case 'watchTV':
					window.location.href=Api.GetIptvServer();
				break;
				case 'USBFLASH':
					window.location.href=Api.GetVodServer();
				break;
				case 'Youtube':
					if (this.IsInternet()){
						window.location.href="./programs/youtube/index.html?"+this.proxy+"&referrer="+Api.GetHomePage();
					} else {
						$('#loading').hide();
						this.PopupShow(this.noInetMsg);
					}
				break;
				case 'Ex':
					if (this.IsInternet()){
						window.location.href="./programs/ex_old/index.html?"+this.proxy+"&referrer="+Api.GetHomePage();
					} else {
						$('#loading').hide();
						this.PopupShow(this.noInetMsg);
					}
				break;
				case 'ExNew':
					if (this.IsInternet()){
						window.location.href="./programs/ex/index.html?"+this.proxy+"&referrer="+Api.GetHomePage();
					} else {
						$('#loading').hide();
						this.PopupShow(this.noInetMsg);
					}
				break;
				case 'Browser':
					if (this.IsInternet()){
						window.location.href="./programs/browser/index.html";
					} else {
						$('#loading').hide();
						this.PopupShow(this.noInetMsg);
					}
				break;
				case 'DivanTV':
					if (this.IsInternet()){
						window.location.href="http://divan.tv/p/?referer=http://briz.ua/stb/mag/portal/";
					} else {
						$('#loading').hide();
						this.PopupShow(this.noInetMsg);
					}
				break;
				case 'MEGOGO':
					if (this.IsInternet()){
						window.location.href="http://megogo.net/p/?referer=http://briz.ua/stb/mag/portal/";
					} else {
						$('#loading').hide();
						this.PopupShow(this.noInetMsg);
					}
				break;
				case 'Picasa':
					if (this.IsInternet()){
						window.location.href="./programs/picasa/picasa_main.html";
					} else {
						$('#loading').hide();
						this.PopupShow(this.noInetMsg);
					}
				break;
				case 'FSTO':
					window.location.href="./programs/fsto/index.html";
				break;
				case 'AuraHD':
					if (this.IsInternet()){
						window.location.href="http://online-media.infomir.com.ua/public_html/?language=&except=online_cinema&referer=http://briz.ua/stb/mag/portal/";
					} else {
						$('#loading').hide();
						this.PopupShow(this.noInetMsg);
					}
				break;
				case 'Tweeter':
					window.location.href="./programs/tweeter/index.html";
				break;
				case 'Wikipedia':
					window.location.href="./programs/wikipedia/index.html";
				break;
				case 'GOROSKOP':
					window.location.href="./programs/goroskop.php";
				break;
				case 'WEATHER':
					this.Load("./programs/weather_ajax.php?all=1");
				break;
				case 'NEWS':
					window.location.href="./programs/dailyNews/index.php";
				break;
				default:
					$('#loading').hide();
					//console.log(type, key);
					//this.ShowAlert('No such page');
				break;
			}
		}
	}

	this.GetLength = function() {
		this.elMax = $('ul.' + this.type + ' li').size();
		this.GetRows();
	}

	this.GetRows = function(){
		elements = $('ul.' + this.type + ' li');

		if (elements.length > 0){

			var ofTop1 = elements[0].offsetTop;
			var ofTop2 = ofTop1;
			this.elCols = 0;
			this.elRows = 1;
			this.rowId = 1;

			for( var i = 0; i < elements.length; i++){
				if (ofTop1 == elements[i].offsetTop && ofTop2 == elements[i].offsetTop){
					this.elCols++;
				} else {
					ofTop2 = elements[i].offsetTop;
					this.elRows++;
				}
			}
		}
	}

	this.SetType = function(type) {
		this.typeOld = this.type;
		this.elIdOld = this.elId;
		this.type = type;
		this.elId = 1;
		this.GetLength();
	}

	this.Back = function() {
		if(this.type != this.typeOld) {
			this.type = this.typeOld;
			this.elId = this.elIdOld;
		}
		this.GetLength();
		if (this.type == 'nav_list'){
			var el = $("ul." + Menu.type + ' li.visited');
			el.removeClass('visited');
			el.addClass('active');
		}
	}

	this.BackController = function() {
		this.Back();
		this.UnbindKey();
		this.BindKey();
	}

	this.SetActive = function() {
		$("ul." + this.type + ' li:first').attr('class', 'active');
	}

	this.SwitchBG = function(name) {
		if(this.type == 'nav_list') {
			//$("#header").css('background', 'url("./images/' + name + '_bg.jpg") transparent');
		}
	}

	this.ShowAlert = function(txt) {
		$("#alert").html(txt).show();
	}
	this.HideAlert = function() {
		$("#alert").empty().hide();
	}

	this.Load = function(url, data) {
		$.ajax({
			type : 'get',
			url : url,
			dataType : 'html',
			data : data,
			error: function(jqXHR, textStatus, errorThrown){
				alert(jqXHR.responseText);
			},
			beforeSend : function() {
				$('#loading').show();
			},
			success : function(html) {
				$('#description').html(html);

			},
			complete : function() {
				$('#loading').hide();
				if (Menu.type == 'nav_list'){
					Menu.SetType('main_list');
				}
				Menu.SetActive();
			}
		});
	}
	this.Prev = function() {
		var cur = $('ul.' + this.type + ' li.active');
		var prev = cur.prev('li');

		if(prev.html() != null) {
			cur.removeClass('active');
			prev.addClass('active');

			this.SwitchBG(prev.children('a').attr('id'));
		}
	}

	this.Next = function() {
		var cur = $('ul.' + this.type + ' li.active');
		var next = cur.next('li');

		if(next.html() != null) {
			cur.removeClass('active');
			next.addClass('active');

			this.SwitchBG(next.children('a').attr('id'));
		}
	}

	this.NextRow = function(){
		if (this.elRows > this.rowId){

			var cur = $('ul.' + this.type + ' li.active');
			var curSave = cur;
			var next = '';
			for(var i = 0; i < this.elCols; i++){
				next = curSave.next('li');
				curSave = next;
			}

			if(next.html() != null) {
				this.rowId++;
				cur.removeClass('active');
				next.addClass('active');
				return true;
			} else {
				return false;
			}
		}
	}

	this.PrevRow = function(){
		if (this.elRows > 1){

			var cur = $('ul.' + this.type + ' li.active');
			var curSave = cur;
			var next = '';
			for(var i = 0; i < this.elCols; i++){
				next = curSave.prev('li');
				curSave = next;
			}

			if(next.html() != null) {
				this.rowId--;
				cur.removeClass('active');
				next.addClass('active');
				return true;
			}
		}

		return false;
	}

	this.CheckInternet = function(){
		/*
		$.ajax({
			url: "http://ex.ua",
			dataType: 'html',
			success: function( data ){
				Menu.inetState = true;
			},
			error: function( data ){
				Menu.inetState = false;
			},
		});
		*/
		this.inetState = true;

	}

	this.IsInternet = function(){
		return true;
		return this.inetState;

	}

	this.IsPopup = function(){
		return this.popup;
	}
	this.ShowNews = function( html ){

		$('#loading').show();
		$.post("./plugins/news/news.php", {
			getNews : "new"
		}, function(data) {
			$('#loading').hide();
			$("#NewsBlock").html(data).show();
			$("#newMessage").hide();
			$("#NewsContainer").show();
		});

		this.popup = true;
	}
	this.HideNews = function(){

		$("#NewsContainer").hide();
		$("#NewsBlock").html("");

		this.popup = false;
	}

	this.PopupShow = function( html ){
		$(this.popupClass).html(html);
		$(this.popupClass+'_overlay').show();

		this.popup = true;
	}

	this.PopupHide = function(){
		$(this.popupClass).html('');
		$(this.popupClass+'_overlay').hide();

		this.popup = false;
	}

	this.keyListener = function(event) {
		var handled = true;
		//var key = event.keyCode > 0 ? event.keyCode : event.charCode;
		var shift = event.shiftKey;
		var key = event.which;
		var alt = event.altKey;
		pat = /^(\S+)_(\S+)/;
		//alert(event.keyCode);
		//alert(key + ' = ' + alt);
		switch(key) {
			case 85: // патч из-за бага в приставке шлет не верный код VK_Power и только onkeyup методе
				if(alt === false) {
					Api.StandBy();
				}
			break;
			case VK_7:
				window.location.href="./programs/fsto_new/index.html";
			break;
			case VK_6:
				//window.location.href="system/pages/loader/index.html";
				//window.location.href="system/settings/index.html";
				//window.location.href="file://home/web/system/settings/index.html";
				/*
				var text = 'Http режим активирован';
				Api.SwitchHttpStreamMode()

				if ( !Api.GetHttpStreamModeStatus() ){
					text = 'Udp режим активирован';
				};

				this.PopupShow(text);
				setTimeout('Menu.PopupHide()', 2000);
				*/
			break;
			case VK_LEFT:
				if (!Menu.IsPopup()){
					Menu.Prev();
				}
				break;
			case VK_RIGHT:
				if (!Menu.IsPopup()){
					Menu.Next();
				}
				break;
			case VK_DOWN:
				if (!Menu.IsPopup()){
					if (Menu.type == 'nav_list'){
						var el = $("ul." + Menu.type + ' li.active a');
						Menu.Action(el.attr('id'), el.attr('rel'));
					} else {
						Menu.NextRow();
					}
				} else {
					$cont = $("div#NewsBlock");
		            if ( $("#NewsContainer").css("display") == 'block' ){
		                $height = $cont.css("height").replace("px", "")/-2;
		                if ( $cont.css("marginTop").replace("px", "") > $height ){
		                    $cont.animate({marginTop:'-=29px'}, 0, function(){});
		                }
		            }
				}
				break;
			case VK_UP:
				if (!Menu.IsPopup()){
					if (Menu.PrevRow() == false){
						Menu.Back();
					}
				} else {
					if ( $("#NewsContainer").css("display") == 'block' ){
		                if ( $cont.css("marginTop").replace("px", "") < 0 ){
		                    $("div#NewsBlock").animate({marginTop:'+=29px'}, 0, function(){});
		                }
		            }
				}
			break;
			case VK_OK:
				if (Menu.IsPopup()){
					Menu.PopupHide();
					Menu.HideNews();
				} else {
					var el = $("ul." + Menu.type + ' li.active a');
					Menu.Action(el.attr('id'), el.attr('rel'));
				}

			break;
			case VK_RED:
				if (alt === false){
					//$('#loading').show();
					//window.location.href="http://172.17.24.14/server/mag/portal/";
				}
			break;
			case VK_GREEN:
				if(alt === false) {
					if (Menu.IsPopup()){
						Menu.HideNews();
					} else {
						Menu.ShowNews();
					}
				}
			break;
			case VK_EXIT:
			case VK_BACK:
				if (Menu.IsPopup()){
					Menu.PopupHide();
					Menu.HideNews();
				} else {
					Menu.Back();
				}
			break;
			case VK_MENU:
			case VK_SETUP:
				Api.SetupDlg();
			break;
			case VK_REFRESH:
				window.location.reload();
			break;

		}
		return;
	}
}
