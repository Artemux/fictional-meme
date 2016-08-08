// DLINK DIB-120 version 0.01

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
	var VK_BACK = 113;
	var VK_VOL_UP = 93;
	var VK_VOL_DOWN = 91;
	var VK_MUTE = 92;
	var VK_CHAN_UP = -1;
	var VK_CHAN_DOWN = -1;
	var VK_PG_UP = 33;
	var VK_PG_DOWN = 34;
    var VK_EPG = 32;
	var VK_OSD = 131;   
	var VK_REV = 120;
	var VK_STOP = 121;
	var VK_PLAY = 122;
	var VK_FF = 123;
    var VK_SREV = 117;
	var VK_INFO = 132;
	var VK_PAUSE = 118;
	var VK_SFF = 119; 
    var VK_MTS = 133;
    var VK_TEXT = 134;
    var VK_SEEK = 135;
    var VK_CAPTURE = 115;
    var VK_VOD = 124;
    var VK_IPTV = 125;
    var VK_DVB = 126;
    var VK_PVR = 127;
    
    
if ( typeof(stb)=='undefined' ){
		stb=new Stb();
}
if ( typeof(stb_media)=='undefined' ){
		stb_media=new Stb_Media();
}
if ( typeof(webbrowser)=='undefined' ){
		var webbrowser=new Webbrowser();
}
if ( typeof(network)=='undefined' ){
		var network=new Network();
}
if ( typeof(device)=='undefined' ){
		device=new Device();
}
if ( typeof(stb)=='undefined' ){
		stb=new Stb();
}
if ( typeof(stb_media)=='undefined' ){
		stb_media=new Stb_Media();
}

var orderPlayUrl = "";
function StbApi()
{
	this.SetTime = function(){
	    stb.timeZone = 42;			                            // Russian Federation +2:00
	    stb.timeServer = "172.17.24.14";                        // NTP server
	    stb.ntpUpdate();                                        // make updte time info              
	}
    
	this.SetFull = function(){ 
		stb_media.setPIG(1);
		stb_media.setPIG(0);
	}
    
    this.InitStb = function(){
        // инициализация начальных установок приставки
        stb_media.setTransparentColor(0xFF000000);
        stb_media.setAlphaLevel(255);
        if (network.igmp != 2) network.igmp = 2                 // устанавливаем IGMP v2
        if (network.netmode != 1) network.netmode = 1;          // устанвливаем DHCP
        if (stb.timeZone != 46) stb.timeZone = 46;              // Russina Federation +3:00
        if (stb.timeServer != "172.17.24.14") stb.timeServer = "172.17.24.14";
        stb.ntpUpdate();                                        // устанавливаем правильное время на приставке
    }
    
    this.InitWebbrowser = function(){
        webbrowser.vodServer = "http://192.168.1.100/dlink2/vod/index.html";
        webbrowser.iptvServer = "http://192.168.1.100/dlink2/iptv/index.html";
        webbrowser.homepage = "http://172.17.24.13/server/portal/index.html";
        webbrowser.configpage = "http://172.17.24.13/server/portal/setup/settings.html";
        webbrowser.mainpage = "http://172.17.24.13/server/portal/index.html";
    }
    
    this.SaveVolume = function(){
        stb.save_vol();
    }
    
    this.GetAudioPid = function()   { return stb_media.getAudioPID(); };
    this.GetEventCode = function()  { return stb_media.eventCode; };   
    this.GetMenuType = function()   { return stb.menutype; };  
    this.GetVodServer = function()  { return webbrowser.vodServer; };
    this.GetIptvServer = function() { return webbrowser.iptvServer; };
    this.GetHomePage = function()   { return webbrowser.homepage; };
    this.GetConfigPage = function() { return webbrowser.configpage; };
    this.GetMainPage = function()   { return webbrowser.mainpage; };
    this.GetFWVersion = function()  { return device.version; };
    this.GetDisplayMode = function(){ return stb.displaymode; };
    this.GetVideoAspect = function(){ return stb.aspect; };
    this.GetVideoContent = function(){ return stb.content; };
    this.GetDeviceModel = function(){ return device.model; };
    this.GetDeviceMemory = function(){ return device.memsize; };
    this.GetDeviceIP = function()   { return network.netip; };
    this.GetDeviceMac = function()  { return device.macaddr; };
    this.GetFWUpgradeStatus = function() { return stb.fwUpgradeStatus; };
    this.GetFWUpgradeStatusPercent = function() { return stb.fwUpgradeDownloadPercent; };
    
    this.SetAudioPid = function( value )    { stb_media.setAudioPID( value ); };
    this.SetMenuType = function( type )     { stb.menutype = type;}
    this.SetVodServer = function( server )  { webbrowser.vodServer = server; };
    this.SetIptvServer = function( server ) { webbrowser.vodServer = server; };
    this.SetHomePage = function( server )   { webbrowser.homepage = server; };
    this.SetConfigPage = function( server ) { webbrowser.configpage = server; };
    this.SetMainPage = function( server )   { webbrowser.mainpage = server; };
    this.SetDisplayMode = function( value ) { stb.displaymode = value; };
    this.SetVideoAspect = function( value ) { stb.aspect = value; };
    this.SetVideoContent = function( value ){ stb.content = value; };
    this.SetFirmwareURL = function ( url )  { stb.fwUpdateUrl = url; };
    this.SetModalMode = function ( value )  { stb.ismodal = value};
    
	this.SetWindow = function(x, y, w, h){ stb_display.setPIG(1, w, x, y); }
	this.SetVolume = function(vol){ stb_media.setVolume(vol) ; }
	this.GetVolume = function(vol){ return stb_media.getVolume() ; }
	this.Mute = function() {stb.mute();}
	this.Stop = function(){ stb_media.stop(); }
	this.Pause = function(){ stb_media.pause(); }
	this.Contin = function(){ stb_media.continuePlay(); }
	this.SetPosition = function(position){ stb_media.setPosition(position); }
	this.GetPosition = function(position) { return stb_media.getPosition(); }
	this.SetSpeed = function(speed) { stb_media.setSpeed(speed);}
	this.GetSpeed = function(speed) { return stb_media.getSpeed();}
    
    this.DisableInternalKey = function( param ){
	    stb.disableinternalkey = param;
	}
	
	this.StandBy = function (){
	    stb.standby();
	}
    
	this.NextAudioChannel = function()
	{
		if (stb_media.audio_channel < 4)
		{++stb_media.audio_channel;}
		else stb_media.audio_channel=0;
		return stb_media.audio_channel;
	}
	this.PlayTV = function(peer)
	{
		if ( stb_media.eventCode == 0 ){
			stb_media.play("udp://"+peer);
		} else {
			this.Stop();
			orderPlayUrl = "udp://"+peer;
			setTimeout(CheckStateChange, 100);
		}
	}
	this.PlayTV2 = function(){
			stb_media.play("udp://34234:1234");
	}
	this.PlayVOD = function(name, server)
	{
		//alert(name+":"+server);
		if(stb_media.eventCode==6)//Stopping
		{	
			//stb.print("(CAUTION):Player is stopping previous,So Wait and try again latter.....!!");
			if(switchtimer) clearTimeout(switchtimer);
			Api.Pause();
			Api.Stop();
			switchtimer=setTimeout(Api.PlayVOD(name),3000);//1000 =1 secs(timeout value)
		}
		else
		{
			
			//document.getElementById("global").style.display="none";
			//reklama("copyright");
			if ( stb_media.eventCode == 0 )
			{
				stb_media.play("rtsp://"+server+"/"+name+".ts");
			}
			else
			{
				this.Stop();
				orderPlayUrl = "rtsp://172.17.24.14/"+name+".ts";
				setTimeout(CheckStateChange, 100);
			}
		}
	}
	this.SetAlpha = function(lvl)//0..10
	{
		//stb_media.setTransparentColor(0x00000000, false);
		stb_media.setAlphaLevel( parseInt(255/10*lvl) );
	}
	this.SetAudioNext = function()
	{
	    if ( stb_media.audio_channel < 3 ){
		++stb_media.audio_channel;
	    } else {
		stb_media.audio_channel = 0;
	    }
	    return stb_media.audio_channel;
	}
    
    this.FirmwareUpgrade = function ( value ){
        switch (value)
        {
            case "usb":
                stb.fwUpgrade(0);
            break;
            case "url":
                stb.fwUpgrade(1);
            break;
            case "mcast":
            break;
        }
        
    }
    
    this.HdmiPlugged = function(){
            if ( this.GetDisplayMode() < 14 ) this.SetDisplayMode(23); 
    }
    this.HdmiUnPlugged = function(){
            if ( this.GetDisplayMode() > 13 ) this.SetDisplayMode(9);
    }
    
    this.AudioPIDs = function(){
	    var pids = stb_media.getAudioPIDS();
	    var temp = pids.indexOf(",")
	    if ( temp != -1 ){
		$("#AudioPIDs").html("звуковые дорожки");
		return 1;  		// 2 or more audio pids 
	    }
	    else {
		$("#AudioPIDs").html("");
		return 0;		// only one audio pid
	    }
	}
}

function CheckStateChange()
{
	if ( orderPlayUrl ){
		if ( stb_media.eventCode == 0 ){
			stb_media.play(orderPlayUrl);
		} else {
			stb_media.stop();
			setTimeout(CheckStateChange, 100);
		}
	}
}

var FWUP_UNKNOW_STATUS         = 0;
var FWUP_WAIT_STATUS           = 1;
var FWUP_BUSY_STATUS           = 2;
var FWUP_DOWNLOAD_START        = 3;
var FWUP_DOWNLOAD_FINISH       = 4;
var FWUP_INFO_DOWNLOAD_START   = 5;
var FWUP_INFO_DOWNLOAD_FINISH  = 6;
var FWUP_WRITE_START           = 7;
var FWUP_WRITE_FINISH          = 8;
var FWUP_DOWNLOAD_FAIL         = 9;
var FWUP_INFO_DOWNLOAD_FAIL    = 10;
var FWUP_WRITE_FAIL            = 11;
var FWUP_RAMDISK_FAIL          = 12;
var FWUP_USB_FAIL              = 13;
var FWUP_FIRM_FILE_FAIL        = 14;
var FWUP_URL_FILE_FAIL         = 15;
var FWUP_INFO_FILE_FAIL        = 16;
var FWUP_EXECMD_FAIL           = 17;
var FWUP_FIRM_MD5_FAIL         = 18;
var FWUP_USER_CANCEL           = 19;
