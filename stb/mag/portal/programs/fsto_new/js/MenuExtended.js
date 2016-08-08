/*
 * @author Vladimir Pavlov kolobokhtc@gmail.com
 */
var MenuExtended = function()
{

	this.divID = null,
	this.firstElID = 1,
	this.pos= -1,
	this.prev= -1,
	this.page = 0,
	this.pages = 1,
	this.elID = 0,
	this.size = 12,

	this.delay = 300,
	this.delayTm= null,

	this.items = null,

	this.selectedClass = 'selectedExtened',
	this.unSelectedClass = 'unselectedExtened';

	this.init = function( divID ){

		this.divID = divID;

	}

	this.Render = function(){
		this.ChangePage();
		this.SelectFirst();
	}

	this.ChangePage = function()
	{
		var offs = this.page * this.size;
		var innerHtml = '';
		for( var i = 0; i < this.size; ++i ){
			if ( this.items[offs+i] ){
				 innerHtml += this.GetItemContainer((offs+i+1));
			}
		}

		$('#'+this.divID).html(innerHtml);
	}
	this.GetItemContainer = function( id ){
		var itemID = id - 1;
		return '<div id="m'+this.divID+itemID+'" class="'+this.unSelectedClass+'">&nbsp;'+this.items[itemID].Name+'</div>';
	}

	this.IsAction = function(){

		if (this.items[this.GetItemId()].Callback){
			return true;
		}

		return false;
	}

	this.Action = function(){
		if (this.items[this.GetItemId()].Callback){
			eval(this.items[this.GetItemId()].Callback);
		}
	}

	this.Select = function()
	{

		if ( this.prev > -1 ){
			var prevEl = this.page * this.size + this.prev;
			$('#m'+this.divID+prevEl).attr('class', this.unSelectedClass);
		}
		var curEl = this.page * this.size + this.pos;
		$('#m'+this.divID+curEl).attr('class', this.selectedClass);

	}

	this.SetItems = function( items ){

		this.items = items;

		if (this.items.length > this.size ){
			this.pages = Math.ceil(this.items.length/this.size);
		}

	}

	this.SelectFirst = function()
	{
		this.prev = this.pos;
		this.pos = 0;
		this.Select();
	}

	this.SelectLast = function()
	{
		this.prev = this.pos;
		this.pos = this.size - 1;
		this.Select();
	}

	this.SelectNext = function()
	{
		this.prev = this.pos;
		++this.pos;
		this.Select();
	}

	this.SelectPrev = function()
	{
		this.prev = this.pos;
		--this.pos;
		this.Select();
	}

	this.Next = function()
	{
		if ( this.page * this.size + this.pos < this.items.length-1 ){
			if ( this.pos < this.size-1 ){
				this.SelectNext();
			}
		}
	}

	this.Prev = function()
	{
		if ( this.pos > 0 ){
			this.SelectPrev();
		}
	}

	this.SetItemId = function( id )
	{
		if ( id > -1 && id < this.items.length ){
			var nPage = Math.ceil((id+1) / this.size)-1;

			if (nPage < 0) nPage = 0;
			if (nPage > this.pages) nPage = this.pages;

			var nPos = id - (nPage * this.size);

			if ( nPos != this.pos ){
				this.prev = this.pos;
				this.pos = nPos;
				this.Select();
			}
		}

	}
	this.GetItemId = function()
	{
		return this.page * this.size + this.pos;
	}


}
