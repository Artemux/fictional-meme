var Timer = function(){
    Api = new StbApi();
    var currentTime = new Date();
    var hour = currentTime.getHours();
    var minute = currentTime.getMinutes();
    this.status = 'off';
    this.timeArr = new Array();
    if (hour < 10) hour = "0"+hour;
    if (minute < 10) minute = "0"+minute;
    this.timeArr['hour'] = hour;
    this.timeArr['minute'] = minute;
    this.tmId = null;
    this.name = '';
    
    this.onload = function( id ){
        this.id = id;
        this.el = document.getElementById(id);
    }
    this.Show = function (){
        $("#"+this.id).css("display", "block")
        this.Status();
        this.Render();
    }
    
    this.Hide = function(){
        $("#"+this.id).css("display", "none");
    }
    
    this.Status = function (){
        if (this.status == 'on'){
            status = "<font color=\"red\">включен</font>";
            button = "Остановить";
        }
        else {
            status = "<font color=\"green\">выключен</font>";
            button = "Запустить";
        }
        $("#"+this.id).find("#timerStatus").html(status);
        $("#"+this.id).find("#timerButton").html(button);        
    }
    
    this.StartAlarm = function (){
        this.status = 'on'; 
        this.Alarm();    
    }
    
    this.StopAlarm = function (){
        this.status = 'off';
        this.Status();
    }
    
    this.Alarm = function (){
        this.Status();
        if (this.tmId != null){
            clearTimeout(this.tmId);
            this.tmId = null;
        };
        
        if (this.status == 'on'){
            var currentTime = new Date();
            var hour = currentTime.getHours();
            var minute = currentTime.getMinutes(); 
            if (hour < 10) hour = "0"+hour;
            if (minute < 10) minute = "0"+minute;           
            alarmStr = this.timeArr['hour']+":"+this.timeArr['minute']//+":"+this.timeArr['second'];
            timeStr = hour+":"+minute//+":"+second;
            if (alarmStr == timeStr){
                this.StopAlarm();
                this.AlarmAction();
            }
            this.tmId = eval("setTimeout(function(){"+this.name+".Alarm()}, 1000)"); 
        }   
    }
    
    this.AlarmAction = function(){
        this.Hide();
        Api.StandBy();
    }
    
    this.Render = function (){
        if (this.id != null){
            $("#"+this.id).find("#hour").html(this.timeArr['hour']);
            $("#"+this.id).find("#minute").html(this.timeArr['minute']);
        }
    }
    
    this.RenderElement = function ( el ){
        if (this.id != null){
            $("#"+this.id).find("#"+el).html(this.timeArr[el]);
        }
    }
    
    this.Increase = function ( el ){
        if ( el == 'hour') max = 23;
        else max = 59;
        
        if ( this.timeArr[el] < max){
            this.timeArr[el]++// = parseInt(this.timeArr[el]) + 1;
        }
        else {
            this.timeArr[el] = '0';
        }
        
        if ( this.timeArr[el] < 10)  this.timeArr[el] = "0"+this.timeArr[el];
        
        this.RenderElement( el ); 
         
    }

    this.Decrease = function ( el ){ 
        if ( el == 'hour') max = 23;
        else max = 59;
        
        if ( this.timeArr[el] > 0){
            this.timeArr[el]--;
        }
        else {
            this.timeArr[el] = max;
        }
        
        if ( this.timeArr[el] < 10)  this.timeArr[el] = "0"+this.timeArr[el];
        this.RenderElement( el );  
    } 
}