
function VolumeObj()
{
	this.muted = false;
	this.tmId = null;
	this.e = null;
	this.value = 50;//StbAoi.GetVolume();
	this.init = function()
	{
		for( var i=1; i<=(this.value/5); ++i ){
			document.getElementById("block"+i).className = "full";
		}
	}
	this.onload = function(id)
	{
		this.e = document.getElementById(id);
		this.init();
	}
	this.Hide = function()
	{
		this.e.style.visibility = 'hidden';
		this.tmId = null;
	}
	this.Show = function()
	{
		if ( this.tmId != null ){
			clearTimeout(this.tmId);
		}
		this.e.style.visibility = 'visible';
		this.tmId = this.SetTm(2000);
	}
	this.Mute = function()
	{
		if ( this.muted ){
			this.init();
			//Stb.SetVolume(this.value);
			this.muted = false;
		} else {
			for( var i=1; i<=20; ++i ){
				document.getElementById("block"+i).className = "empty";
			}
			//Stb.SetVolume(0);
			this.muted = true;
		}
		this.Show();
	}
	this.Plus = function()
	{
		if ( this.muted ){
			this.Mute();//unMute
		}
		if ( this.value < 100 ){
			this.value += 5;
			document.getElementById("block"+(this.value/5)).className = "full";
			//Stb.SetVolume(this.value);
		}
		this.Show();
	}
	this.Minus = function()
	{
		if ( this.muted ){
			this.Mute();//unMute
		}
		if ( this.value > 0 ){
			document.getElementById("block"+(this.value/5)).className = "empty";
			this.value -= 5;
			//Stb.SetVolume(this.value);
		}
		this.Show();
	}
}
