//<!--
var alphaBy = "";
var rusMonth = new Array();
rusMonth[0] = 'января';
rusMonth[1] = 'февраля';
rusMonth[2] = 'марта';
rusMonth[3] = 'апреля';
rusMonth[4] = 'мая';
rusMonth[5] = 'июня';
rusMonth[6] = 'июля';
rusMonth[7] = 'августа';
rusMonth[8] = 'сентября';
rusMonth[9] = 'октября';
rusMonth[10] = 'ноября';
rusMonth[11] = 'декабря';

function Status()
{
	this.tmId = null;
	this.e = null;
	this.name = "";
	this.onload = function(id)
	{
		this.name = id;
		this.e = document.getElementById(id);
	}
	this.ResetTm = function()
	{
		if ( this.tmId != null ){
			clearTimeout(this.tmId);
			this.tmId = null;
		}
	}
	this.Hide = function(param)
	{
		if (param != 'clock'){
			this.ResetTm();
			this.e.style.visibility = "hidden";
			//document.getElementById("iframe1").style.display="none";
			if ( alphaBy == this.name ){
				//Stb.SetAlpha(10);
				alphaBy = "";
			}
		}
		else {
			this.Show('clock', 'always');
		}
	}
	this.Show = function(text, ms)
	{
		this.ResetTm();
		if (text == "show") text = "No EPG for this channel";
		if (text != '') this.e.innerHTML = text;
		if (text == "clock") {
			var currentTime = new Date();
			var hour = currentTime.getHours();
			var minute = currentTime.getMinutes();
			var month = currentTime.getMonth();
			var day = currentTime.getDate();
			var year = currentTime.getFullYear();
			data = day + " " + rusMonth[month] + " " + year;
			if(minute < 10) {
				minute = "0" + minute;
			}
		
			var text = hour + ":" + minute;
			text += "<br/><span>" + data + "</span>"
			
			this.e.innerHTML = text;
			if (ms == 'always') this.tmId = eval("setTimeout(function(){"+this.name+".Show('clock', 'always');},10000)");
		}
		this.e.style.visibility = "visible";
		// document.getElementById("iframe1").style.display="block";
		

		if (ms != 'always'){
			this.tmId = eval("setTimeout(function(){"+this.name+".Hide();},"+ms+")");
		}

		if ( alphaBy != this.name ){
			if ( alphaBy == "" ){
				//Stb.SetAlpha(10);
			} 
			alphaBy = this.name;
		}
	}
	
	this.IsShow = function(){
		if ( this.e.style.visibility == "hidden"){
			return false;
		} else {
			return true;
		}
	}
}
//-->
