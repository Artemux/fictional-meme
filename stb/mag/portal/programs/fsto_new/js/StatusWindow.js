/*
 * @author Vladimir Pavlov kolobokhtc@gmail.com
 */
var StatusWindow = function() {

	this.tmId = null;
	this.e = null;
	this.name = "";
	this.animation = false;
	
	this.init = function(className, divID, animation) {
		this.name = className;
		this.e = $('#'+divID);
		
		this.animation = animation;

	}
	this.ResetTm = function() {
		if (this.tmId != null) {
			clearTimeout(this.tmId);
			this.tmId = null;
		}
	}
	this.Hide = function(param) {

		this.ResetTm();
		
		if ( this.animation == true ){
			this.e.fadeOut('fast');
		} else {
			this.e.hide();
		}
		
		
	}
	this.Show = function(text, ms) {
		
		if (!text){
			text = '';
		}
		
		if (!ms){
			ms = 'always';
		}
		
		this.ResetTm();
		if (text == "show")
			text = "No EPG for this channel";
		if (text != '')
			this.e.html(text);

		if ( this.animation == true ){
			this.e.fadeIn('slow');
		} else {
			this.e.show();
		}

		if (ms != 'always') {
			this.tmId = eval("setTimeout(function(){" + this.name + ".Hide();}," + ms + ")");
		}
	}
	
	this.IsShow = function(){

		if (this.e.css('display') == 'none'){
			return false;
		} else {
			return true;
		}
		
	}

}