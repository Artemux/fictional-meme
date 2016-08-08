//<!--
function PageMenu()
{
//private
	this.Co = null;
	this.Items = [];
	this.pos = -1;
	this.prev = -1;
	this.page = 0;
	this.pages = 1;
	this.delay = 300;
	this.delayTm = null;
//public
	this.Genre = [];
	this.genrePos = 0;
	this.List = [];
	this.size = 16;
	this.selectedClass = 'selectMi';
	this.unSelectedClass = 'unSelectMi';
//private:
	this.Select = function()
	{
		$(".current-program").remove();
		if ( this.prev > -1 ){
			this.Items[this.prev].className = this.unSelectedClass;
		}
		this.Items[this.pos].className = this.selectedClass;
		
		if ( this.delayTm != null ){
			clearTimeout(this.delayTm);
		}
		
		this.delayTm = eval("setTimeout(function(){CurMenu.ShowCurrentProgram();},"+this.delay+")");
		
	}
	
	this.ShowCurrentProgram = function(){
		if ( this.List.length > 0){
			$.ajax({
		        type: "POST",
		        url: "../epg/index.php",
				dataType: "json",
		        data: "chanID="+this.List[this.GetItemId()][2]+'&method=current',
				beforeSend: function(){
					var html = '<div class="loading"> <img src="./images/ajax-loader.gif" alt=""></img> </div>';
					$('.selectMi').append(html);
				},
		        success: function(msg){
					$('.loading').remove();
					var html = 	'<div class="current-program">'+
									'<div class="image"> <img src="./images/current-play.png" alt="" /></div>' +
									'<div class="end">' + msg.end + '</div>' +
									'<div class="program">' + msg.text + '</div>' +
								'</div>'
					$('.selectMi').append(html);    
		        }
	    	});
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
	this.ChangePage = function()
	{
		var offs = this.page * this.size;
		for( var i=0; i<this.size; ++i ){
			var I = this.Items[i];
			if ( this.List[offs+i] ){
				I.innerHTML = (offs+i+1)+'. '+this.List[offs+i][1];
			} else {
				I.innerHTML = "";
			}
		}
	}
	this.FirstPage = function(){
		this.page = 0;
		this.pages = Math.ceil(this.List.length / this.size);
		this.ChangePage();
		this.SelectFirst();
		this.TxtDiv.innerHTML = this.GetPagerHtml();
	    
	}
	
	this.Reload = function(){
		
		$.getJSON("httpLoader.php", { g: this.Genre[this.genrePos] },
			function(genre){
				MainMenu.List = genre;
				MainMenu.FirstPage();
				MainMenu.RestartTm();
			});
	}
	
	this.RefreshPage = function(){
		this.ChangePage();
	}
	this.PageNext = function()
	{
		if ( this.page < this.pages - 1 ){
			++this.page;
			this.ChangePage();
			this.SelectFirst();
			this.TxtDiv.innerHTML = this.GetPagerHtml();
		}
		//else {
		//	this.page = 1;
		//	this.ChangePage();
		//	this.SelectLast();
		//	this.TxtDiv.innerHTML = '<div class=\"pageInfo\"> Страница '+(this.page+1)+' из '+this.pages+"</div>"
		//}
	}
	this.PagePrev = function()
	{
		if ( this.page > 0 ){
			--this.page;
			this.ChangePage();
			this.SelectLast();
			this.TxtDiv.innerHTML = this.GetPagerHtml();
		}
		//else{
		//	this.page = this.pages-1;
		//	this.ChangePage();
		//	this.SelectLast();
		//	this.TxtDiv.innerHTML = '<div class=\"pageInfo\"> Страница '+(this.page+1)+' из '+this.pages+"</div>"
		//}
	}
	this.GenreNext = function(){
	    if ( this.genrePos < this.Genre.length-1 ){
		++this.genrePos;
	    }
	    else {
		this.genrePos = 0;
	    }
	    this.GenreDiv.innerHTML = this.GetGenreHtml(GenresRus[this.genrePos]);
	    return this.Genre[this.genrePos];
	}
	
	this.GenrePrev = function(){
	    if ( this.genrePos > 0 ){
		this.genrePos--;
	    }
	    else {
		this.genrePos = this.Genre.length-1;
	    }
	    this.GenreDiv.innerHTML = this.GetGenreHtml(GenresRus[this.genrePos]);
	    return this.Genre[this.genrePos];
	}
	
	this.SetGenre = function( id ){
		this.genrePos = id;
	    this.GenreDiv.innerHTML = this.GetGenreHtml(GenresRus[this.genrePos]);
	    return this.Genre[this.genrePos];		
	}
	
//initialization
	this.Init = function( cId )
	{
		this.Co = document.getElementById(cId);
		this.GenreDiv = document.createElement('DIV');
		this.Co.appendChild(this.GenreDiv);
		for( var i=0; i<this.size; ++i ){
			var txt = "";
			if ( this.List[i] ){
				txt = (i+1)+'. '+this.List[i][1];
			}
			var Item = document.createElement('DIV');
			//var Tn = document.createTextNode(txt);
			//Item.appendChild(Tn);
			Item.innerHTML = txt;
			Item.className = this.unSelectedClass;
			this.Items[i] = Item;
			this.Co.appendChild(Item);
		}
		this.pages = Math.ceil(this.List.length / this.size);
		this.TxtDiv = document.createElement('DIV');
		//var Tn = document.createTextNode("Page 1 of "+this.pages);
		this.Co.appendChild(this.TxtDiv);
		//this.TxtDiv.appendChild(Tn);
		this.GenreDiv.innerHTML = this.GetGenreHtml(GenresRus[this.genrePos]);
		this.TxtDiv.innerHTML = this.GetPagerHtml();
		this.SelectFirst();
	}
//select next element
	
	this.GetGenreHtml = function( txt ){
		return "<div class=\"genreInfo\"><&nbsp "+txt+" &nbsp></div>"
	}
	
	this.GetPagerHtml = function(){
		return '<div class=\"pageInfo\"> Страница '+(this.page+1)+' из '+this.pages+'</div>';
	}

	this.Next = function()
	{
		if ( this.page * this.size + this.pos < this.List.length-1 ){
			if ( this.pos < this.size-1 ){
				this.SelectNext();
			} else {
				this.PageNext();
			}
		}
	}
//select prev element
	this.Prev = function()
	{
		if ( this.pos > 0 ){
			this.SelectPrev();
		} else {
			this.PagePrev();
		}
	}
//page down
	this.PageDown = function()
	{
		if ( this.page < this.pages - 1 ){
			++this.page;
			this.ChangePage();
			this.SelectFirst();
			this.TxtDiv.innerHTML = this.GetPagerHtml();
		}
	}
//page up
	this.PageUp = function()
	{
		if ( this.page > 0 ){
			--this.page;
			this.ChangePage();
			this.SelectFirst();
			this.TxtDiv.innerHTML = this.GetPagerHtml();
		}
	}
//show menu
	this.Show = function()
	{
		this.Co.style.visibility = 'visible';
	}
//hide menu
	this.Hide = function()
	{
		this.Co.style.visibility = 'hidden';
	}
//check display
	this.IsShow = function()
	{
		return this.Co.style.visibility == 'visible';
	}
//set item by id
	this.SetItemId = function( id )
	{
		if ( id > -1 && id < this.List.length ){
			var nPage = Math.ceil((id+1) / this.size)-1;
			
			if (nPage < 0) nPage = 0;
			if (nPage > this.pages) nPage = this.pages;
			
			var nPos = id - (nPage * this.size);
			
			if ( nPage != this.page ){
				this.page = nPage;
				this.ChangePage();
				this.TxtDiv.innerHTML = this.GetPagerHtml();
			}
			//alert(nPos);
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
//end class
}
//-->

