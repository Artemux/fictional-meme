var settingActive = 0;
var oldAudio;
var defAudio = 0;
var settingElement;
var settingElementId = 0;
var settingElementArray = new Array('aspect', 'content', 'audio');
var aud = "";
if ( typeof(Api) == 'undefined' ){
	Api = new StbApi();
}

function Settings(){
	this.aspectId = 0;
	this.contentId = 0;
	this.audioId = 0;
	
	this.oldAudio;
	this.defAudio = 0;
	this.settingActive = 0;
	this.Element;
	this.ElementId = 0;
	this.ElementArray = new Array('aspect', 'content', 'audio');
	this.AspectArray = new Array('Auto', '20:9', '16:9', '4:3');
	this.ContentArray = new Array('Auto', 'Box', 'PanScan', 'Full', 'Увеличенный', 'Оптимальный');
	this.AudioArray = new Array();
	
	this.Init = function(){
		this.SetValues();
	}
	
	this.GetAudio = function(){
		this.AudioArray = null;
		this.audioId = 0;
		
		var data = Api.GetAudioPids();
		this.AudioArray = eval(data);
	}
	
	this.SetValues = function(){
		var data = Api.GetVideoAspect().toString(16);
		if (data == 0){
			data = "00";
		}
		this.contentId = parseInt(data.substr(0, 1));
		this.aspectId = parseInt(data.substr(1, 1));
	}
	
	this.SetVideo = function(){
		var value = '0x'+ this.contentId.toString() + this.aspectId.toString();
		Api.SetVideoAspect(value);
	}
	
	this.SetAudio = function(){
		Api.SetAudioPid(this.AudioArray[this.audioId].pid);
	}
	
	this.Set = function( direction ){
		if (this.ElementArray[this.ElementId] == 'aspect'){
			if ( direction == 'left' ){
				this.AspectPrev();
			} else {
				this.AspectNext();
			}
		} else if (this.ElementArray[this.ElementId] == 'content'){
			if ( direction == 'left' ){
				this.ContentPrev();
			} else {
				this.ContentNext();
			}
		} else if (this.ElementArray[this.ElementId] == 'audio'){
			if ( direction == 'left' ){
				this.AudioPrev();
			} else {
				this.AudioNext();
			}
		}
		this.Render();
	}
	this.AudioNext = function(){
		if (this.audioId < this.AudioArray.length - 1 ){
			this.audioId++;
  		} else {
			this.audioId = 0;
  		}
  		this.SetAudio();  
	}
	
	this.AudioPrev = function(){
		if (this.audioId > 0 ){
			this.audioId--;
		} else {
			this.audioId = this.AudioArray.length - 1;
	  	} 
	  	this.SetAudio(); 
	}
		
	this.AspectNext = function(){
		if (this.aspectId < this.AspectArray.length - 1 ){
			this.aspectId++;
  		} else {
			this.aspectId = 0;
  		}
  		this.SetVideo();  
	}
	
	this.AspectPrev = function(){
		if (this.aspectId > 0 ){
			this.aspectId--;
		} else {
			this.aspectId = this.AspectArray.length - 1;
	  	} 
	  	this.SetVideo(); 
	}
		
	this.ContentNext = function(){
		if (this.contentId < this.ContentArray.length - 1 ){
			this.contentId++;
  		} else {
			this.contentId = 0;
  		}
  		this.SetVideo();  
	}
	
	this.ContentPrev = function(){
		if (this.contentId > 0 ){
			this.contentId--;
		} else {
			this.contentId = this.ContentArray.length - 1;
	  	} 
	  	this.SetVideo(); 
	}	
	
	this.ElementNext = function(){
	   	document.getElementById(this.ElementArray[this.ElementId]).className = "settingElement";
	  		if (this.ElementId < this.ElementArray.length - 1 ){
	  			this.ElementId++;
	  		} else {
	  			this.ElementId = 0;
	  		}
	  	document.getElementById(this.ElementArray[this.ElementId]).className = "settingElementActive";  	
	}
	
	this.ElementPrev = function(){
	   	document.getElementById(this.ElementArray[this.ElementId]).className = "settingElement";
	  		if (this.ElementId > 0 ){
	  			this.ElementId--;
	  		} else {
	  			this.ElementId = this.ElementArray.length - 1;
	  		}   
	  	document.getElementById(this.ElementArray[this.ElementId]).className = "settingElementActive";	
	}	
		
	this.Render = function(){
		document.getElementById(this.ElementArray[this.ElementId]).className = "settingElementActive";		
		if (typeof(this.AspectArray[this.aspectId]) != 'undefined'){
			aspect = this.AspectArray[this.aspectId];
		} else {
			aspect = 'unknown';
		}
		
		if (typeof(this.ContentArray[this.contentId]) != 'undefined'){
			content = this.ContentArray[this.contentId];
		} else {
			content = 'unknown';
		}

	    document.getElementById("aspect").innerHTML="Aspect: "+aspect;
	    document.getElementById("content").innerHTML="Video content:"+content;
	    document.getElementById("audio").innerHTML="Audio PID:"+Api.GetAudioPid();
		return 1;
	}
}
