/*
 * @author Vladimir Pavlov kolobokhtc@gmail.com
 */
	var VK_0 = 48;
	var VK_1 = 49;
	var VK_2 = 50;
	var VK_3 = 51;
	var VK_4 = 52;
	var VK_5 = 53;
	var VK_6 = 54;
	var VK_7 = 55;
	var VK_8 = 56;
	var VK_9 = 57;
    var VK_LEFT = 37;
	var VK_UP = 38;
	var VK_RIGHT = 39;
	var VK_DOWN = 40;
	var VK_OK = 13;  
	var VK_BACK = 8;
	var VK_VOL_UP = 43;
	var VK_VOL_DOWN = 45;
	var VK_MUTE = 96;
	var VK_CHAN_UP = 9;
	var VK_CHAN_DOWN = 9;
	var VK_PG_UP = 33;
	var VK_PG_DOWN = 34;
    var VK_EPG = 119;
	var VK_OSD = 117;   
	var VK_REV = 98;
	var VK_STOP = 115;
	var VK_PLAY = 114;
	var VK_FF = 102;
    var VK_SREV = -1;
	var VK_INFO = 121;
	var VK_PAUSE = -1;
	var VK_SFF = -1; 
    var VK_MTS = 114;
    var VK_TEXT = 134;
    var VK_SEEK = 135;
    var VK_CAPTURE = 32;
    var VK_VOD = -1;
    var VK_IPTV = -1;
    var VK_DVB = -1;
    var VK_PVR = -1;
    var VK_EXIT = 27;
    var VK_MENU = 122;
    var VK_RED = 112;
    var VK_GREEN = 113;
    var VK_YELLOW = 114;
    var VK_BLUE = 115;
    var VK_TV = 121;
    var VK_SETUP = 120;
    var VK_REFRESH = 116;
    var VK_POWER = 117;
    var VK_AUDIO_MODE = 71;
    var VK_VIDEO_ASPECT = 72;
    var VK_VIDEO_MODE = 73;
    var VK_FAV = 74;
    var FlashDriveOn = 112;
    var FlashDriveOff = 113;
	var VK_BUTTON = 108;
    
if ( typeof(stb)=='undefined' ){
	var stb;
	stb = gSTB;	
}

var orderPlayUrl = "";

function StbApi()
{
	
	this.standBy = 1;
	this.deviceAID = 0;
	
	this.SetTime = function(){
		this.SetDefaults();
	}
    
    this.SetDefaults = function(){

		var CONCAT = ' "|" ', 
			str    = '',
			portal1 = this.GetHomePage(), 
			ntpurl = '172.17.24.14',
			mcip   = '',		//'224.5.1.253',
			mcport = '',		//'9000',
			mcip_img = '',		//'224.5.1.254',
			mcport_img = '',	//'9001',
			update_url = 'igmp://224.5.1.254:9001',
			bootstrap_url = 'igmp://224.5.1.253:9000',
			showlogo = 'no',
			graphicres = '720',
			user_id = '1',
			logo_x = '0',
			logo_y = '0',
			bg_color = '0x00000000',
			fg_color = '0x00787878',
			input_buffer_size = '500';
		
		//if ( this.GetHttpStreamModeStatus() ) this.SetEnv('use_http');
		
		if ( this.GetEnv('ntpurl') != ntpurl) str += 'ntpurl ' + ntpurl;
		if ( this.GetEnv('mcip_conf') != mcip) str += CONCAT + 'mcip_conf ' + mcip; 
		if ( this.GetEnv('mcport_conf') != mcport) str += CONCAT + 'mcport_conf ' + mcport;
		if ( this.GetEnv('mcip_img_conf') != mcip_img) str += CONCAT + 'mcip_img_conf ' + mcip_img;
		if ( this.GetEnv('mcport_img_conf') != mcport_img) str += CONCAT + 'mcport_img_conf ' + mcport_img;
		if ( this.GetEnv('update_url') != update_url) str += CONCAT + 'update_url ' + update_url;
		if ( this.GetEnv('bootstrap_url') != bootstrap_url) str += CONCAT + 'bootstrap_url ' + bootstrap_url;
		if ( this.GetEnv('showlogo') != showlogo) str += CONCAT + 'showlogo ' + showlogo;
		if ( this.GetEnv('graphicres') != graphicres) str += CONCAT + 'graphicres ' + graphicres;
		if ( this.GetEnv('bg_color') != bg_color) str += CONCAT + 'bg_color ' + bg_color;
		if ( this.GetEnv('fg_color') != fg_color) str += CONCAT + 'fg_color ' + fg_color;
		if ( this.GetEnv('logo_x') != logo_x) str += CONCAT + 'logo_x ' + logo_x;
		if ( this.GetEnv('logo_y') != logo_y) str += CONCAT + 'logo_y ' + logo_y;
		if ( this.GetEnv('user_id') != user_id) str += CONCAT + 'user_id ' + user_id;
		if ( this.GetEnv('portal1') != portal1) str += CONCAT + 'portal1 ' + portal1;
		if ( this.GetEnv('input_buffer_size') != input_buffer_size) str += CONCAT + 'input_buffer_size ' + input_buffer_size;
		
		if ( str.length > 0){
			this.SetEnv( str );
		}
		this.SetWebProxy();
		//this.RouteAdd();
		
    }
    
	this.SetFull = function(){ 
	}
    
    this.InitStb = function(){
    	stb.InitPlayer();
    	Api.SetTopWin(0);
    	Api.Navigation(false);
    	stb.SetAudioLangs('rus', 'eng');
    	//Api.SetVideoAspect(0x10);
		stb.SetPIG(1, 0, 0, 0);
    }
    
    this.InitWebbrowser = function(){
    }
    
    this.SaveVolume = function(){
    }
    
    this.GetEnv = function( value ) 	{ return stb.RDir('getenv '+value); }
    this.GetAudioPid = function()   	{ return stb.GetAudioPID(); };
    this.GetAudioPids = function()   	{ return stb.GetAudioPIDs(); };
    this.GetStereoMode = function ()	{ return stb.GetStereoMode(); };
    this.GetEventCode = function()  	{ return 1; };   
    this.GetMenuType = function()   	{ return 1; }; 
	this.GetLoaderUrl = function()		{ 
		
		var url = "http://briz.ua/stb/mag/portal/programs/iptv/httpLoader.php?mac="+this.GetDeviceMac();
		
		if ( this.GetHttpStreamModeStatus() ){
			url = "http://briz.ua/stb/mag/portal/programs/iptv2/httpLoader.php?mac="+this.GetDeviceMac()+"&use_http=1";
		} 
	
		return url; 
	};
	this.GetOttLoaderUrl = function()	{ return "http://briz.ua/stb/mag/portal/programs/iptv2/httpLoader.php?mac="+this.GetDeviceMac()+"&use_http=1"; };
	this.GetInterfaceUrl = function()	{ return "http://briz.ua/stb/mag/portal/httpLoader.php?mac="+this.GetDeviceMac(); };
    this.GetVodServer = function()  	{ return "http://briz.ua/stb/mag/portal/programs/media/"; };
    this.GetIptvServer = function() 	{ return "http://briz.ua/stb/mag/portal/programs/iptv_ott/index.html"; };
	this.GetSambaPage = function() 		{ return "http://briz.ua/stb/mag/portal/programs/samba/index.html"; };
    this.GetHomePage = function()   	{ return "http://briz.ua/stb/mag/portal/"; };
    this.GetConfigPage = function() 	{ return 1; };
    this.GetMainPage = function()   	{ return 1; };
    this.GetFWVersion = function()  	{ return stb.RDir("ImageVersion"); };
    this.GetDisplayMode = function() 	{ return 1; };
    this.GetVideoAspect = function() 	{ return stb.GetAspect(); };
    this.GetVideoContent = function() 	{ return 1; };
    this.GetDeviceModel = function() 	{ return stb.GetDeviceModel(); };
    this.GetDeviceMemory = function() 	{ return 1; };
	this.GetDeviceIP = function()  		{ return stb.RDir("IPAddress").replace(/\n/gi, '') };
	this.GetDeviceWIP = function()  	{ return stb.RDir("wifi_ip").replace(/\n/gi, '') };
    this.GetDeviceMac = function()  	{ return stb.GetDeviceMacAddress(); };
    this.GetFWUpgradeStatus = function(){ return 1; };
    this.GetFWUpgradeStatusPercent = function() { return 1; };
    this.GetSmbGroups = function( )		{ return stb.GetSmbGroups(); };
    this.GetSmbServers = function( json )		{ return stb.GetSmbServers(json); };
    this.GetSmbShares = function( json )		{ return stb.GetSmbShares(json); };
	this.GetWifiLinkStatus = function()	{ return stb.GetWifiLinkStatus(); }
	this.GetLanLinkStatus = function()	{ return stb.GetLanLinkStatus(); }
    
	this.SetWebProxy = function ()			{
		var routerDHCP = /192\.168\.\d{1,3}\.\d{1,3}/;
		if ( !routerDHCP.test(this.GetDeviceIP()) ){
			stb.SetWebProxy("192.168.1.114", "3128", this.GetDeviceIP(), this.GetDeviceMac().replace(/:/gi, '-'), 'briz.ua');
		}	
	};
	
	this.NeedProxy = function(){
		var routerDHCP = /192\.168\.\d{1,3}\.\d{1,3}/;
		
		if ( !routerDHCP.test(this.GetDeviceIP()) && !this.GetWifiLinkStatus() ){
			return true;
		}	
		
		return false;
	}
    this.SetEnv = function( value )			{ stb.RDir ('setenv ' + value); };
    this.SetAudioPid = function( value )    { stb.SetAudioPID( value ); };
    this.SetStereoMode = function ( value )	{ stb.SetStereoMode( value ); };
    this.SetMenuType = function( type )     { return 1; };
    this.SetVodServer = function( server )  { return 1; };
    this.SetIptvServer = function( server ) { return 1; };
    this.SetHomePage = function( server )   { return 1; };
    this.SetConfigPage = function( server ) { return 1; };
    this.SetMainPage = function( server )   { return 1; };
    this.SetDisplayMode = function( value ) { return 1; };
    this.SetVideoAspect = function( value ) { stb.SetAspect( value ); };
    this.SetVideoContent = function( value ){ return 1; };
    this.SetFirmwareURL = function ( url )  { return 1; };
    this.SetModalMode = function ( value )  { return 1; };
    this.SetEventListener = function ( value ){ return 1; };
	
    this.IsPlaying = function ()			{ return stb.IsPlaying();}
	this.SetWindow = function(x, y, w, h)	{ return 1; };
	this.SetVolume = function(vol) 			{ stb.SetVolume(vol) };
	this.GetVolume = function() 			{ return stb.GetVolume(); };
	this.GetMute = function() 				{ return stb.GetMute(); }
	this.Stop = function()  				{ stb.Stop(); };
	this.Pause = function() 				{ stb.Pause(); };
	this.Contin = function() 				{ stb.Continue(); };
	this.SetPosition = function(position) 	{ stb.SetPosTime(position); };
	this.GetPosition = function() 			{ return stb.GetPosTime(); };
	this.SetSpeed = function(speed) 		{ stb.SetSpeed(speed); };
	this.GetSpeed = function(speed) 		{ return stb.GetSpeed(); };
    
    this.SetListFilesExt = function ( val )	{ stb.SetListFilesExt( val ); };
    this.ListDir = function( dir )			{ return stb.ListDir(dir); }
    
    this.GetUserData = function( val )		{ return stb.LoadUserData(val);}
    this.SetUserData = function( val, data ){ return stb.SaveUserData(val, data);}
    
    this.DisableInternalKey = function( param ){
	}

	this.VolUp = function(){
		if (stb.GetVolume() < 100){
			stb.SetVolume(stb.GetVolume()+5)
		}
		return stb.GetVolume();
	}
	
	this.VolDown = function(){
		if (stb.GetVolume() > 0){
			stb.SetVolume(stb.GetVolume()-5)
		}
		return stb.GetVolume();
	}

	this.Mute = function() { 
		if ( stb.GetMute() == 0 ){
			stb.SetMute(1);
		} else {
			stb.SetMute(0);
		}
	}
	
	this.StandBy = function(){
		if (this.standBy == 1){		
			stb.StandBy(true);
			this.standBy = 0;
		} else {
			stb.StandBy(false);
			this.standBy = 1;
		}
	}	
	
	this.NextAudioChannel = function(){
	}
	
	this.PlayTV = function(peer){
		
		if ( this.GetHttpStreamModeStatus() ){
			stb.Play(peer);
		} else {
			stb.Play('udp://'+peer);
		}
		
	}
	this.PlayOttTV = function(peer){
		stb.Play(peer);
	}
	
	this.PlayVOD = function(name, server){
	}
	
	this.PlayMedia = function( file ){
		stb.Play('auto ' + file);
	}
	
	this.PlayMediaProxy = function(file){
		proxy_url = 'http://'+this.GetDeviceIP()+':'+this.GetDeviceMac().replace(/:/gi, '-')+'@192.168.1.114:3128';
		stb.Play('auto ' + file, proxy_url);
	}
	
	this.Stop = function() 			{ stb.Stop(); }
	this.Pause = function() 		{ stb.Pause(); }
	this.Continue = function() 		{ stb.Continue(); }
	this.GetMediaLen = function ()	{ return stb.GetMediaLen(); }
	
	this.ShowMediaWin = function(){
		stb.SetWinAlphaLevel(0, 255) 
		stb.SetWinAlphaLevel(1, 255)
		Api.SetTopWin(0);
	}

	this.ShowBrowserWin = function(){
		stb.SetWinAlphaLevel(0, 255) 
		stb.SetWinAlphaLevel(1, 140)
		//Api.SetTopWin(0);
	}
	
	this.SetAlpha = function(lvl){
		stb.SetTransparentColor(0x000000); 
		stb.SetWinAlphaLevel(0, 240) 
		stb.SetWinAlphaLevel(1, 200) 
		stb.SetAlphaLevel( parseInt(255/10*lvl) );
	}
	this.SetTopWin = function ( val ){
		stb.SetTopWin(val);
	}
	this.SetAudioNext = function(){
	}
    
    this.FirmwareUpgrade = function ( value ){       
    }
    
    this.HdmiPlugged = function(){
    }
    
    this.HdmiUnPlugged = function(){
    }
    
    this.AudioPIDs = function(){
	}
	
	this.GetHttpStreamModeStatus = function(){
		
		if ( this.GetEnv('use_http') === '' ){
			return false;
		}
		
		return true;
		
	}
	
	this.EnableHttpStreamMode = function(){
		
		return this.SetEnv('use_http 1');
		
	}
	
	this.DisableHttpStreamMode = function(){
		
		return this.SetEnv('use_http');
		
	}
	
	this.SwitchHttpStreamMode = function(){
				
		if ( !this.GetHttpStreamModeStatus() ){
			this.EnableHttpStreamMode();			
		} else {
			this.DisableHttpStreamMode();
		}
		
	}
	
	this.AddSmbServer = function( server_url, server_dir, local_name, login, password){
		
		if ( this.isSmbServerExists(server_url, server_dir) == true ){
			this.DeleteSmbServer(local_name);
		}
		
		stb.ExecAction("make_dir /media/" + local_name);
		var smb_result=stb.RDir('mount cifs //'+server_url+'/'+server_dir+' /media/'+local_name+' username='+login+',password='+password+',iocharset=utf8');

		if( smb_result=='Ok' ){
			var text=stb.LoadUserData('smb_data');
			
			var serv_url_str='url:"'+server_url+'",';
			var serv_folder_str='folder:"'+server_dir+'",';
			var serv_login_str='login:"'+login+'",';
			var serv_pass_str='pass:"'+password+'",';
			var serv_local_str='local:"'+local_name+'"';
			
			if( text != '' && text != '[]'){
				var tempstr=text.substr(0,text.length-1)+',{'+serv_url_str+serv_folder_str+serv_login_str+serv_pass_str+serv_local_str+'}]';
			} else {
				var tempstr='[{'+serv_url_str+serv_folder_str+serv_login_str+serv_pass_str+serv_local_str+'}]';
			}
			stb.SaveUserData('smb_data',tempstr);
				
		} else {
			alert(smb_result);
		}
	}
	
	this.DeleteSmbServer = function( local_name ){
		var text=stb.LoadUserData('smb_data');
		if(text==''){text='[]';}
		
		var array=eval(text);
		var tempstr='[';
		for(var i=0;i<=array.length-1;i++){
			if( array[i].local == local_name ){
				array.splice(i,1);
			}
			if( i<array.length-1 || i==array.length-1 ){
				tempstr += objToString(array[i]) + ',';
			}
			
			if( i == (array.length-1) ){
				tempstr = tempstr.substr(0,tempstr.length-1);
			}
		}
		tempstr += ']';
		if( array.length == 0 ) { tempstr = ''; }
		stb.ExecAction("umount_dir /media/"+local_name);
		stb.RDir('RemoveDir /media/'+local_name);
		stb.SaveUserData('smb_data',tempstr);
	}
	
	this.MountAllSmb = function(){
		
		var text=stb.LoadUserData('smb_data');
		if(text==''){text='[]';}
			
		var array = eval(text);

		for(var i = 0;i < array.length; i++)
		{		
			stb.ExecAction("make_dir /media/" + array[i].local);
			var smb_result=stb.RDir('mount cifs //'+array[i].url+'/'+array[i].folder+' /media/'+array[i].local+' username='+array[i].login+',password='+array[i].pass+',iocharset=utf8');
		}
		
	}
	
	this.UnmountAllSmb = function(){
		
		var text=stb.LoadUserData('smb_data');
		if(text==''){text='[]';}
			
		var array=eval(text);
		for(var i=0;i<array.length;i++)
		{		
			stb.ExecAction("umount_dir /media/"+array[i].local);
			stb.RDir('RemoveDir /media/'+array[i].local);
		}
		stb.SaveUserData('smb_data','');	
	}
	
	this.isSmbServerExists = function( server_url, server_dir ){
		
		var text=stb.LoadUserData('smb_data');
		if(text==''){text='[]';}
			
		var array=eval(text);
		for(var i=0;i<array.length;i++)
		{
			if(array[i].url == server_url && array[i].folder == server_dir ){
				return true;
			}
		}
		return false;
		
	}
	
	this.RouteAdd = function(){
		var ip = stb.RDir('IPAddress');
		gw = ip.split('.');
		gw[3]='1';
		gw = gw.join('.');
		stb.RDir("SetLogo ; route add -net 192.168.1.0/24 gw "+gw+"; route add -net 172.17.0.0/16 gw "+gw+"; route add -net 172.18.0.0/16 gw "+gw+";");
		return TRUE;
	}
	
	this.GetDeviceAID = function(){
		this.deviceAID = this.GetEnv('deviceAID');
		return this.deviceAID;
	}
	
	this.SetDeviceAID = function( id ){
		this.deviceAID = id;
		this.SetEnv( 'deviceAID '+this.deviceAID  );
	}
	
	this.SetupDlg = function(){
		stb.StartLocalCfg();
	}
	
	this.EnableServiceButton = function(){
		stb.EnableServiceButton(true);
	}
	
	this.DisableServiceButton = function(){
		stb.EnableServiceButton(false);
	}
	
	this.EnableVKButton = function(){
		stb.EnableVKButton(true);
	}
	
	this.DisableVKButton = function(){
		stb.EnableVKButton(false);
	}
	this.ShowKeyboard = function(){
		stb.ShowVirtualKeyboard();
	}
	this.HideKeyboard = function(){
		stb.HideVirtualKeyboard();
	}
	this.Navigation = function(bool){
		stb.EnableSpatialNavigation(bool);
	}
	
	this.Debug = function ( val ){ return 1; }
	
}

function CheckStateChange(){
}
