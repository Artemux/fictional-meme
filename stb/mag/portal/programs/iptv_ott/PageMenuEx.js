//<!--
var hideTimeout = 10000;
var alphaBy = "";

PageMenu.prototype.onload = function(id)
{
	this.name = id;
	this.tmId = null;
	this.Init(id);
}
PageMenu.prototype.ResetTm = function()
{
	if ( this.tmId != null ){
		clearTimeout(this.tmId);
		this.tmId = null;
	}
}
PageMenu.prototype.HideEx = function()
{
	this.ResetTm();
	this.Hide();
	if ( alphaBy == this.name ){
		//Stb.SetAlpha(10);
		alphaBy = "";
	}
	ShowMenu = null;
	//Stb.SetAlpha(10);
}
PageMenu.prototype.RestartTm = function()
{
	this.ResetTm();
	this.tmId = eval("setTimeout(function(){"+this.name+".HideEx();},"+hideTimeout+")");
}
PageMenu.prototype.ShowEx = function()
{
	//Stb.SetAlpha(9);
	this.RestartTm();
	if ( alphaBy != this.name ){
		if ( alphaBy == "" ){
			//Stb.SetAlpha(10);
		} 
		alphaBy = this.name;
	}
	if ( curMenuName == this.name ){
		if ( ChanObj.currentNo-1 != this.GetItemId() ){
			this.SetItemId(ChanObj.currentNo-1);
		}
	}
	ShowMenu = this;
	this.Show();
}
PageMenu.prototype.Display = function()
{
	if ( ShowMenu ){
		if ( ShowMenu.name != this.name ){
			ShowMenu.HideEx();
			this.ShowEx();
		} else {
			this.HideEx();
		}
	} else {
		this.ShowEx();
	}
}
PageMenu.prototype.NextEx = function()
{
	this.RestartTm();
	this.Next();
}
PageMenu.prototype.PrevEx = function()
{
	this.RestartTm();
	this.Prev();
}
PageMenu.prototype.PageUpEx = function()
{
	this.RestartTm();
	this.PageUp();
}
PageMenu.prototype.PageDownEx = function()
{
	this.RestartTm();
	this.PageDown();
}
//-->

