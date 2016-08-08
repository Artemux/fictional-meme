/*
 * @author Vladimir Pavlov kolobokhtc@gmail.com
 */
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
	this.audioModeId = 0;
	
	this.oldAudio;
	this.defAudio = 0;
	this.settingActive = 0;
	this.Element;
	this.ElementId = 0;
	this.ElementArray = new Array('aspect', 'content', 'audio');
	this.AspectArray = new Array('Auto', '20:9', '16:9', '4:3');
	this.ContentArray = new Array('Auto', 'Box', 'PanScan', 'Full', 'Увеличенный', 'Оптимальный');
	this.AudioArray = new Array();
	this.AudioModeArray = new Array('Stereo', 'Mono', 'Mono Left', 'Mono Right');
	
	this.Init = function(){
		this.SetValues();
		this.SetVideo();
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
		
		if (Api.GetEnv('video_content_mode')){
			this.contentId = Api.GetEnv('video_content_mode')
		} else {
			this.contentId = parseInt(data.substr(0, 1));
		}

		this.aspectId = parseInt(data.substr(1, 1));
	}
	
	this.SetVideo = function(){
		var value = '0x'+ this.contentId.toString() + this.aspectId.toString();
		Api.SetVideoAspect(value);
	}
	
	this.SetAudio = function(){
		Api.SetAudioPid(this.AudioArray[this.audioId].pid);
	}
	
	this.SetAudioMode = function(){
		Api.SetStereoMode(this.audioModeId);
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
			if (direction == 'up'){
				this.AudioPrev();
			} else if (direction == 'down'){
				this.AudioNext();
			} else if ( direction == 'left' ){
				this.AudioPrev();
				//this.AudioModePrev();
			} else {
				this.AudioNext();
				//this.AudioModeNext();
			}
		}
		this.Render();
	}
	
	this.GetAudioLang = function(){
		if (typeof(this.AudioArray[this.audioId]) != 'undefined'){
			var lang = this.AudioArray[this.audioId].lang;
			
			lang = lang+'';
			lang = lang.replace(/\,/, '');
			if (lang != ''){
				return lang;
			} else {
				return this.AudioArray[this.audioId].pid;
			}
		} else { 
			return 'none';
		}
	}
	
	this.GetAudioModeName = function(){
		if (typeof(this.AudioModeArray[this.audioModeId]) != 'undefined'){
			audioMode = this.AudioModeArray[this.audioModeId];
		} else {
			audioMode = 'unknown';
		}
		return audioMode;
	}
	
	this.GetAspectName = function(){
		if (typeof(this.AspectArray[this.aspectId]) != 'undefined'){
			aspect = this.AspectArray[this.aspectId];
		} else {
			aspect = 'unknown';
		}
		return aspect;
	}
	
	this.GetContentName = function(){
		if (typeof(this.ContentArray[this.contentId]) != 'undefined'){
			content = this.ContentArray[this.contentId];
		} else {
			content = 'unknown';
		}
		return content;
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
		
	this.AudioModeNext = function(){
		if (this.audioModeId < this.AudioModeArray.length - 1 ){
			this.audioModeId++;
  		} else {
			this.audioModeId = 0;
  		}
  		this.SetAudioMode();	
	}
	
	this.AudioModePrev = function(){
		if (this.audioModeId > 0 ){
			this.audioModeId--;
		} else {
			this.audioModeId = this.AudioModeArray.length - 1;
	  	} 
	  	this.SetAudioMode(); 
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
		document.getElementById("aspect").innerHTML="Aspect: "+this.GetAspectName();
	    document.getElementById("content").innerHTML="Video content:"+this.GetContentName();
	    document.getElementById("audio").innerHTML="Audio: "+this.GetAudioLang() + '&nbsp;' + this.GetAudioModeName();

		return 1;
	}
	this.Save = function(){
		var saved = Api.GetEnv('video_content_mode');
		if (saved != this.contentId){
			Api.SetEnv('video_content_mode '+this.contentId);
		}
		
	}

}
