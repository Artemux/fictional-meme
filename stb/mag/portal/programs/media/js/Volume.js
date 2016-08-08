function VolumeObj(){
	this.value = Api.GetVolume();
	this.tmId = null;
	
	this.Show = function(){	
		if ( this.tmId != null ){
			clearTimeout(this.tmId);
		}
		
		$("#VolumeBlock").css('visibility', 'visible');
		this.tmId = this.SetTm(2000);
	}
	this.Hide = function(){
		$("#VolumeBlock").css('visibility', 'hidden');
		this.tmId = null;
	}
	this.Mute = function(){
		Api.Mute();
		if ( Api.GetMute() == 1 ){
			$("#Muted").css('display', 'block');
		} else {
			$("#Muted").css('display', 'none');
		}
	}
	this.Plus = function(){
		if ( Api.GetMute() == 1 ){
			this.Mute();//unMute
		}
		this.value = Api.VolUp();
		this.VolumeRender(this.value);
		this.Show();
	}
	this.Minus = function(){
		if ( Api.GetMute() == 1 ){
			this.Mute();//unMute
		}
		this.value = Api.VolDown();
		this.VolumeRender(this.value);
		this.Show();
	}
	
	this.VolumeRender = function( val ){
		var delimetr = 5;
		var vol_max = 100;
		var vol_min = 0;
		var html = "";
	
		var volBlocks = vol_max/delimetr;
		var $div = $("#Volume");
		
		for ( i = 1; i <= volBlocks; i++){
			if (val < i*delimetr){
				html = '<div id="block" class="empty"></div>' + html;
			} else if ( val == i*delimetr){
				html = '<div id="block" class="full">'+val+'</div>' + html;
			} else {
				html = '<div id="block" class="full"></div>' + html;
			}
		}
		html = '<div class="image">+</div>'+html;
		html += '<div class="image">-</div>';
		$div.html(html);
	}
	
	this.SetTm = function (time){
		return setTimeout("Volume.Hide()", time);
	}
}