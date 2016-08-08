/*
 * @author Vladimir Pavlov kolobokhtc@gmail.com
 */
var Menu =
{
	
	divID : null,
    firstElID : 1,
    pos: -1,
    prev: -1,
    page : 0,
    pages : 1,
    elID : 0,
    size : 9,
    
    delay : 300,
	delayTm : null,
	chanDelay: 3000,
	chanTm : null,
	chanStr : '',
	
    playlist : null,
    
	saved_active_item_id : null,
	
    selectedClass : 'selected',
    unSelectedClass : 'unselected'
	
}

Menu.init = function( divID ){
	
	this.divID = divID;
	
}

Menu.Render = function(){
	this.FirstPage();
	this.SetPageHtml();
	this.SetBreadcrumbs();
	this.SelectFirst();
}

Menu.SetSavedActiveItemID = function(item_id){
	this.saved_active_item_id = item_id;
}

Menu.SetActiveItem = function(){
	if (this.saved_active_item_id){
		Menu.SetItemId(this.saved_active_item_id);
		this.saved_active_item_id = null;
	}
}

Menu.DoSwitch = function()
{
	if ( this.chanStr ){
		var chanNo = parseInt(this.chanStr);
		if ( this.playlist[chanNo-1] ){
			this.prev = this.pos;
			this.pos = chanNo-1;
			this.SetItemId(chanNo-1);
			//Channel.Play();
		}
		this.chanStr = "";
	}
	this.chanTm = null;
}

Menu.IsKeypress = function(){
	if (this.chanStr.length > 0){
		return true;
	} else {
		return false;
	}
}

Menu.KeypressBack = function( )
{
	if ( this.chanStr.length > 0){
		this.chanStr = this.chanStr.substring(0, this.chanStr.length - 1);
		if ( this.chanTm != null ){
			clearTimeout(this.chanTm);
		}
		this.chanTm = setTimeout("Menu.DoSwitch()", this.chanDelay);
		Popup.Show(this.chanStr, this.chanDelay);
	} else {
		Popup.Hide();
	}

}

Menu.Keypress = function( keyStr )
{
	this.chanStr += keyStr;
	if ( this.chanTm != null ){
		clearTimeout(this.chanTm);
	}
	this.chanTm = setTimeout("Menu.DoSwitch()", this.chanDelay);
	Popup.Show(this.chanStr, this.chanDelay);
}

Menu.Select = function()
{	
	if ( this.prev > -1 ){
		var prevEl = this.page * this.size + this.prev;
		$('#n'+prevEl).removeClass(this.selectedClass)
		$('#n'+prevEl).addClass(this.unSelectedClass);
	}
	var curEl = this.page * this.size + this.pos;
	$('#n'+curEl).removeClass(this.unSelectedClass);
	$('#n'+curEl).addClass(this.selectedClass);
	
	if ( this.delayTm != null ){
		clearTimeout(this.delayTm);
	}
	
	this.ShowDetails();
		

}

Menu.ShowDetails = function(){
	
	var item = Data.getVideoExtended(Menu.GetItemId());
	
	if (item.image){
		$('.detail-block .detail-block-image img').attr('src',item.image).show();
	} else{
		$('.detail-block .detail-block-image img').hide();
	}
	
	if (item.info){
		$('.detail-block .detail-block-info').html(item.info).show();
	} else {
		$('.detail-block .detail-block-info').hide();
	}
	
	if (item.vote_negative){
		$('.detail-block .detail-block-vote-negative').text(item.vote_negative);
		$('.detail-block .detail-block-vote').show();
	} else {
		$('.detail-block .detail-block-vote').hide();
	}
	
	if (item.vote_positive){
		$('.detail-block .detail-block-vote-positive').text(item.vote_positive)
		$('.detail-block .detail-block-vote').show();
	} else {
		$('.detail-block .detail-block-vote').hide();
	}
	
	var menu_type = Data.getVideoType(Menu.GetItemId())
	
	if (menu_type == 'files' || menu_type == 'play_link'){
		$('.detail-block').hide();
	} else {
		$('.detail-block').show();
	}
}

Menu.SetList = function( list ){
	
	this.playlist = list;

	if ( Data.getVideoCount() > this.size ){
		this.pages = Math.ceil(Data.getVideoCount()/this.size);
	}
	
}

Menu.SelectFirst = function()
{
	this.prev = this.pos;
	this.pos = 0;
	this.Select();
}

Menu.SelectLast = function()
{
	this.prev = this.pos;
	this.pos = this.size - 1;
	this.Select();
}

Menu.SelectNext = function()
{
	this.prev = this.pos;
	++this.pos;
	this.Select();
}

Menu.SelectPrev = function()
{
	this.prev = this.pos;
	--this.pos;
	this.Select();
}

Menu.ChangePage = function()
{
	var offs = this.page * this.size;
	var innerHtml = '';
	for( var i = 0; i < this.size; ++i ){
		if ( this.playlist[offs+i] ){
			 innerHtml += Channel.GetContainer((offs+i+1));
		}
	}
	
	$('#'+this.divID).html(innerHtml);
}

Menu.FirstPage = function(){
	this.page = 0;
	this.pages = Math.ceil(Data.getVideoCount()/this.size);
	this.ChangePage();
	this.SelectFirst();
	this.SetPageHtml();
    
}

Menu.RefreshPage = function(){
	this.ChangePage();
}
Menu.PageNext = function()
{
	
	if ( this.page < this.pages - 1 ){
		++this.page;
		this.ChangePage();
		this.SelectFirst();
		this.SetPageHtml();
	} else {
		if (Data.getVideoType(Menu.GetItemId()) == 'folders'){
			Data.increaseExternalPage();
			Channel.nextExternalPage();
		}
		
	}
}
Menu.PagePrev = function()
{
	if ( this.page > 0 ){
		--this.page;
		this.ChangePage();
		this.SelectLast();
		this.SetPageHtml();
	} else {
		if (Data.getVideoType(Menu.GetItemId()) == 'folders'){
			if (Data.decreaseExternalPage()){
				Channel.prevExternalPage();
			}
		}
		
	}
}

Menu.SetPageHtml = function(){
	var menu_type = Data.getVideoType(Menu.GetItemId())
	if (menu_type == 'folders'){
		
		var page_num = 1;
		if (this.page == 0){
			page_num = Data.getExternalPage() * 2 + 1;
		} else {
			page_num = (Data.getExternalPage() + 1) * 2;
		}
				
		$('#page').html('Страница <span class="badge"> '+page_num+'</span>');
	} else {
		$('#page').html('Страница <span class="badge"> '+(this.page+1)+'</span> из <span class="badge">'+this.pages + '</span>');
	}
	
}

Menu.SetBreadcrumbs = function(){
	var html = "";
	if (Channel.prev_data){
		$.each(Channel.prev_data, function(i, data){
			html += data.extended.menu_item_name + '\\';
		})
	}
	$('#nav').html(html);
}

Menu.IsLastElement = function(){
	if ( this.page * this.size + this.pos < Data.getVideoCount()-1 ){
		return false;
	} else {
		return true;
	}
}

Menu.Next = function()
{
	if ( this.page * this.size + this.pos < Data.getVideoCount()-1 ){
		if ( this.pos < this.size-1 ){
			this.SelectNext();
		} else {
			this.PageNext();
		}
	} else {
		this.PageNext();
	}
}

Menu.Prev = function()
{
	if ( this.pos > 0 ){
		this.SelectPrev();
	} else {
		this.PagePrev();
	}
}

Menu.PageDown = function()
{
	if ( this.page < this.pages - 1 ){
		++this.page;
		this.ChangePage();
		this.SelectFirst();
		this.SetPageHtml();
	}
}

Menu.PageUp = function()
{
	if ( this.page > 0 ){
		--this.page;
		this.ChangePage();
		this.SelectFirst();
		this.SetPageHtml();
	}
}

Menu.SetItemId = function( id )
{
	if ( id > -1 && id < Data.getVideoCount() ){
		var nPage = Math.ceil((id+1) / this.size)-1;
		
		if (nPage < 0) nPage = 0;
		if (nPage > this.pages) nPage = this.pages;
		
		var nPos = id - (nPage * this.size);
		
		if ( nPage != this.page ){
			this.page = nPage;
			this.ChangePage();
			this.SetPageHtml();
		}
		//alert(nPos);
		if ( nPos != this.pos ){
			this.prev = this.pos;
			this.pos = nPos;
			this.Select();
		}
	}

}

Menu.GetItemId = function()
{
	return this.page * this.size + this.pos;
}

Menu.GetItem = function(){
	return this.playlist[this.GetItemId()];
}
