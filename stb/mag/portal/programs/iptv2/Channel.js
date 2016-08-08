//<!--
if ( typeof(Api) == 'undefined' ){
	Api = new StbApi();
}

var switchTimeout = 3000;
function SwitchAudio(val){
	
	return false;
	
	switch(val){
		case 1:
			//спорт 2
			audio = 202;
		break;
		case 2:
			//euronews
			//audio = 2237;
		break;
		case 3:
			//Luxe TV HD
			//audio = 3017;
		break;
	} 
	if (Api.GetAudioPid() != audio) Api.SetAudioPid( audio );
}
function Channel()
{
	this.name = "undefined";
	this.currentNo = 1;
	this.prevNo = 1;
	this.delay = 350;
	this.delayTm = null;
	this.weekday = null;
	
	this.EpgFull = function(){
		if (this.weekday == null ){
			var date = new Date();
			this.weekday = date.getDay();
		}
	    chan = CurMenu.List[this.currentNo-1][2];
	    $.ajax({
	        type: "POST",
	        url: "../epg/index.php",
	        data: "chanID="+chan+"&weekday="+this.weekday,
	        success: function(msg){
				
	    	    if (msg != "0") {
	    			$("#EpgFull").html(msg);
					
	    	    }
	    	    else {
	    			epgActive = 0;
	    			document.getElementById("EpgFull").style.display = "none";
	    	    }
	        }
	    });
	}
	
	this.EpgFullNext = function(){
		if (this.weekday < 6){
			this.weekday++;
		} else {
			this.weekday = 0;
		}
		this.EpgFull();
	}
	
	this.EpgFullPrev = function(){
		if (this.weekday > 0){
			this.weekday--;
		} else {
			this.weekday = 6;
		}
		this.EpgFull();
	}
	
	this.LoadEpg = function(){
		chan = CurMenu.List[this.currentNo-1][2];
		Iframe.src = "../epg/index.php?curEpg="+chan;
	}

	this.Play = function()
	{   
		checkmcast = false;
		CheckBot.Reset();
        var i = this.currentNo - 1;
        if ( timeshiftStatus != 0 ) { 
            TimeshiftEnd();
        }
        
		if ( this.delayTm != null ){
			clearTimeout(this.delayTm);
		}
		
		this.delayTm = eval("setTimeout(function(){ChanObj.PlayNow();},"+this.delay+")");
		//Api.PlayTV(CurMenu.List[i][0]);
		
		//if ( CurMenu.IsShow() ){
			CurMenu.SetItemId(i);
		//}
		if (CurMenu.List[i][1] == "Спорт 2"){
		    setTimeout("SwitchAudio(1)", 4000);
		} 
		osdActive = 0;
		TopLine.Show("", 5001)
		
		this.LoadEpg();

		setTimeout("Setting.GetAudio()", 1000);
		ChanNumDiv.Show(this.currentNo, 5000);
		ChanNameDiv.Show(CurMenu.List[i][1]+ "<i>&nbsp;</i>", 5000);
		ClockDiv.Show("clock", 5000);
		AudioPIDs.Show("", 5000);
		var au = setTimeout("Api.AudioPIDs()", 3000);
	}
	
	this.PlayNow = function(){
		checkmcast = false;
		var i = this.currentNo - 1;
		Api.PlayOttTV(CurMenu.List[i][0]);
		setTimeout("ChanObj.PlayCheck()", 5000);
	}
	
	this.PlayCheck = function(){
		if (checkmcast == false ){
			//alert('НЕТ СИГНАЛА');
		}
		
		if (checkplay == true){
			var i = this.currentNo - 1;
			osdActive = 0;
			TopLine.Show("", 5001)
			ChanNumDiv.Show(this.currentNo, 5000);
			ChanNameDiv.Show(CurMenu.List[i][1] + " - <span style=\" font-size: 22px;\">НЕТ СИГНАЛА</span>", 5000);
			ClockDiv.Show("clock", 5000);
			if (CurMenu.List[i][0] != ''){
				//Api.PlayTV(CurMenu.List[i][0]);
			}
		}
	}
	
	this.Back = function()
	{
		var reg = this.currentNo;
		this.currentNo = this.prevNo;
		this.prevNo = reg;
		
		ChanNumDiv.Show(this.currentNo, switchTimeout);
		this.Play();
	}
	this.chanStr = "";
	this.DoSwitch = function()
	{
		if ( this.chanStr ){
			var chanNo = parseInt(this.chanStr);
			if ( MainMenu.List[chanNo-1] ){
				CurMenu = MainMenu;
				this.prevNo = this.currentNo;
				this.currentNo = chanNo;
				this.Play();
			}
			this.chanStr = "";
		}
		this.chanTm = null;
	}
	this.chanTm = null;
	this.Keypress = function( keyStr )
	{
		this.chanStr += keyStr;
		if ( this.chanTm != null ){
			clearTimeout(this.chanTm);
		}
		this.chanTm = eval("setTimeout(function(){"+this.name+".DoSwitch();},"+switchTimeout+")");
		ChanNumDiv.Show(this.chanStr, switchTimeout);
	}

	this.Next = function()
	{
		this.prevNo = this.currentNo;
		if ( this.currentNo < CurMenu.List.length ){
			this.currentNo += 1;
		} else {
			this.currentNo = 1;
		}
		//ChanNumDiv.Show(this.currentNo, switchTimeout);
		this.Play();
	}
	this.Prev = function()
	{
		this.prevNo = this.currentNo;
		if ( this.currentNo == 1 ){
			this.currentNo = CurMenu.List.length;
		} else {
			this.currentNo -= 1;
		}
		//ChanNumDiv.Show(this.currentNo, switchTimeout);
		this.Play();
	}
    
    this.CheckGET = function(){
        // если есть GET запрос на канал, то проигрываем запрошенный канал,
        // если нет, то проигрываем первый по списку
        var get = this.GET('chanID');
        if ( get != "" ){
            for ( j = 0; j<CurMenu.List.length; j++ ){
                if (CurMenu.List[j][2] == get){
                    this.currentNo = j+1;
                    break;
                }
            }
        }
    }
    
    this.GET = function(sParamName){  
        var Params = location.search.substring(1).split("&");
        var variable = "";
        
        for (var i = 0; i < Params.length; i++){
            if (Params[i].split("=")[0] == sParamName){
                if (Params[i].split("=").length > 1) variable = Params[i].split("=")[1];  
                return variable;  
            }  
        }  
        return "";  
    }  
}
//-->

