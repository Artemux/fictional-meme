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
		current_size : 9,

    delay : 300,
		delayTm : null,
		chanDelay: 3000,
		chanTm : null,
		chanStr : '',

    playlist : null,
		missing_elms : 0,
    qualities: [],
		quality_selected_index : 0,
		quality_switch_count : 0,
		elem_num : 0,

		saved_active_item_id : null,

    selectedClass : 'selected',
    unSelectedClass : 'unselected'

}

Menu.init = function( divID ){

	this.divID = divID;

}

Menu.Render = function(){
	this.SetQualities();
	this.SetQualityHtml();
	this.FirstPage();
	this.SetBreadcrumbs();
	this.RecountPages();
	this.SetPageHtml();
	this.SelectFirst();
}

Menu.QualityRender = function() {
	this.FirstPage();
	this.SetPageHtml();
	this.SelectFirst();
}

Menu.SetPage = function(val) {
	this.page = val;
}

Menu.SetQualities = function() {

	var self = this;
	self.qualities = [];

	var menu_types = Data.getVideoType(Menu.GetItemId());
	if(menu_types == 'play_link') {
		var qualities = Data.getVideoExtendeds();
		// console.log(qualities);
		if (qualities.length <= 0) {
			return false;
		}

		qualities.forEach(function(item){

			if(self.qualities.indexOf(item.quality) == -1){
				self.qualities.push(item.quality);
			}

		});
		this.quality_switch_count = 0;
	  this.quality_selected_index = 0;
		console.log(this.qualities);
	}

}

Menu.getQualitySwitchCount = function() {
	return this.quality_switch_count;
}

Menu.getQualitiesSelectedIndex = function() {
		return this.quality_selected_index;
}

Menu.getQuality = function(index) {
	if(index >= 0 && index < this.qualities.length) {
		return this.qualities[index];
	}
}

Menu.GetQualities = function() {
	return Menu.qualities;
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

	// if ( this.prev > -1 ){
	// 	var prevEl = this.page * this.size + this.prev;
	// 	$('#n'+prevEl).removeClass(this.selectedClass);
	// 	$('#n'+prevEl).addClass(this.unSelectedClass);
	// }
	// 	var curEl = this.page * this.size + this.pos;
	// 	$('#n'+curEl).removeClass(this.unSelectedClass);
	// 	$('#n'+curEl).addClass(this.selectedClass);
	// if ( this.delayTm != null ){
	// 	clearTimeout(this.delayTm);
	// }


	this.ShowDetails();


}

Menu.ShowDetails = function(){

	var item = Data.getVideoExtended(Menu.GetItemId());
	console.log(item);

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
	var type = Data.getVideoType();

	if ( Data.getVideoCount() > this.size ){
		if(this.qualities.length > 0) {
		//	this.pages = Math.ceil((parseInt($('#series_count').html()) / this.size));
			this.pages = Math.ceil(Math.ceil((Data.getVideoCount() + this.missing_elms) /this.size) /this.qualities.length);
		}else{
			this.pages = Math.ceil(Data.getVideoCount()/this.size);
		}
	}

}

Menu.RecountPages = function() {
	//if ( Data.getVideoCount() > this.size ){
	if(this.qualities.length > 0) {
	//	this.pages = Math.ceil((parseInt($('#series_count').html()) / this.size));
		this.pages = Math.ceil(Math.ceil((Data.getVideoCount() + this.missing_elms) /this.size) /this.qualities.length);
  }else{
		this.pages = Math.ceil(Data.getVideoCount()/this.size);
	}
	//}
}

Menu.ResetElemNum = function() {
	this.elem_num = 0;
}

Menu.SelectFirst = function()
{
	var first = $("#playlist").children()[0];
	$(first).addClass(this.selectedClass);
	this.pos = 0;
	// this.prev = this.pos;
	// this.pos = 0;
	this.Select();
}

Menu.SelectLast = function()
{
	var len = $("#playlist").children().length;
	var last = $("#playlist").children()[len - 1];
	$(last).addClass(this.selectedClass);
	this.pos = this.size - 1;
	this.prev = this.pos;
	this.pos = this.size - 1;
	this.Select();
}

Menu.SelectNext = function()
{
	var playlist = $("#playlist");
	var selected = playlist.find(".selected");
	var next = selected.next();
	if(next.length > 0) {
		selected.removeClass(this.selectedClass);
		selected.addClass(this.unSelectedClass);
		next.removeClass(this.unSelectedClass);
		next.addClass(this.selectedClass);
	}
	this.prev = this.pos;
	//++this.pos;
	this.pos = Menu.GetItemPos();
	this.Select();
}

Menu.SelectPrev = function()
{
	var playlist = $("#playlist");
	var selected = playlist.find(".selected");
	var prev = selected.prev();
	if(prev.length > 0) {
		selected.removeClass(this.selectedClass);
		selected.addClass(this.unSelectedClass);
		prev.removeClass(this.unSelectedClass);
		prev.addClass(this.selectedClass);
	}
	this.prev = this.pos;
	//--this.pos;
	this.pos = Menu.GetItemPos();
	this.Select();
}

Menu.nextQuality = function(){
		this.quality_switch_count++;
		var array_size = this.qualities.length;

		if(array_size <= 0){
			return false;
		}

		if (this.quality_selected_index < (array_size - 1)){
			this.quality_selected_index++;
		} else {
			this.quality_selected_index=0;
		}

}

Menu.ChangeQuality = function() {
	var quality = $('.quality_name').text();
	var innerHtml = '';
	if(quality) {
		for( var i = 0; i < this.size; i++) {
			//console.log(Channel.GetContainer((i+1)));
			var str = Channel.GetContainer((i+1));
			if(str.indexOf(quality) > -1) {
				innerHtml += str;
			}
		}
	}

	$('#'+this.divID).html(innerHtml);
}

Menu.clearRemoved = function() {
	Data.clearVideoExtendedsRemoved();
	Data.clearVideoNamesRemoved();
	Data.clearVideoTypesRemoved();
	Data.clearVideoURLsRemoved();
	Data.clearVideoImagesRemoved();
}

Menu.refillData = function() {
			var len = arguments.length;
			if(Data.videoExtendedsRemoved.length > 0) {
				if(len > 0){
					Data.videoExtendedsRemoved.reverse();
				}
				Data.videoExtendedsRemoved.forEach(function(item) {
					if(len > 0){
						Data.addVideoExtended(item, 'unshift');
					}
					else
						Data.addVideoExtended(item);
				});
				Data.videoExtendedsRemoved = [];
			}
			if(Data.videoNamesRemoved.length > 0) {
				if(len > 0){
					Data.videoNamesRemoved.reverse();
				}
				Data.videoNamesRemoved.forEach(function(item) {
					if(len > 0){
						Data.addVideoName(item, 'unshift');
					}
					else {
						//Data.videoNames.reverse();
						Data.addVideoName(item);
					}
				});
				Data.videoNamesRemoved = [];
			}
			if(Data.videoTypesRemoved.length > 0) {
				if(len > 0){
					Data.videoTypesRemoved.reverse();
				}
				Data.videoTypesRemoved.forEach(function(item) {
					if(len > 0){
						Data.addVideoType(item, 'unshift');
					}
					else {
						Data.addVideoType(item);
					}
				});
				Data.videoTypesRemoved = [];
			}
			if(Data.videoURLsRemoved.length > 0) {
				if(arguments.length > 0){
					Data.videoURLsRemoved.reverse();
				}
				Data.videoURLsRemoved.forEach(function(item) {
					if(arguments.length > 0)
						Data.addVideoURL(item, 'unshift');
					else {
						Data.addVideoURL(item);
					}
				});
				Data.videoURLsRemoved = [];
			}

}

Menu.SortData = function(arr) {
	arr.sort(function(a, b){
		 var index = a.search(/(s\d{2}e\d{2})/i);
		 a = a.slice(index+4, index+6);
				 index = b.search(/(s\d{2}e\d{2})/i);
		 b = b.slice(index+4, index+6);
		 return parseInt(a) - parseInt(b);
	});
}

Menu.SortDataNames = function(arr, qualities_length) {
	arr.sort(function(a, b){
		 var index = a.search(/(\(\d+\.\d+\s\w{2}\))/i);
		 a = a.split(' ');
		 a = a.slice(1);
		 a = a[0].replace(/[\(\)]/, '') + a[1].replace(/[\(\)]/, '');

		 index = b.search(/(\(\d+\.\d+\s\w{2}\))/i);
		 b = b.split(' ');
		 b = b.slice(1);
		 b = b[0].replace(/[\(\)]/, '') + b[1].replace(/[\(\)]/, '');;
		 if(a.search(/(GB)/) >= 0) {
			 a = parseFloat(a) * 1000;
		 }
		 if(b.search(/(GB)/) >= 0) {
			 b = parseFloat(b) * 1000;
		 }
		 return parseFloat(b) - parseFloat(a);
	});
	var super_arr = [];
	for(var i = 0; i < qualities_length; i++) {
		var len = arr.length;
		var split_arr = arr.splice(0, (len / (qualities_length - i)));
		split_arr.sort(function(a, b){
			 var index = a.search(/(s\d{2}e\d{2})/i);
			 a = a.slice(index+4, index+6);
					 index = b.search(/(s\d{2}e\d{2})/i);
			 b = b.slice(index+4, index+6);
			 return parseInt(a) - parseInt(b);
		});
		super_arr = super_arr.concat(split_arr);
	}
	return super_arr;
}

Menu.ChangePage = function()
{
	this.current_size = 0;
	var quality_filter = false;

	if (this.quality_selected_index != -1 && this.qualities[this.quality_selected_index]){
		quality_filter = this.qualities[this.quality_selected_index];
	}

	var serials = [];
	var data_len  = Data.getVideoCount();
	var qual_length = this.qualities.length;
	for(var i = 0, key = ''; i < data_len; i++) {
			key = Data.getVideoExtended(i).serials;
			var key_qual = Data.getVideoExtended(i).quality;
			if(serials[key]) {
				serials[key][key_qual] = Data.getVideoURL(i);
			} else {
				serials[key] = [];
				serials[key][key_qual] = Data.getVideoURL(i);
			}
	}

	var arr = [];
	var counter = 0;
	for(var key in serials) {
		arr[counter] = 0;
		for(var inner_key in serials[key]) {
			arr[counter]++;
		}
		counter++;
	}
	var param = 0; //кол-во элементов нехватающих для полного набора
	var diff = 0; //кол-во не полных qualities
	for(var i = 0; i < arr.length; i++) {
		if(arr[i] < qual_length) {
			param += qual_length - arr[i];
			arr[i] > diff ? diff = arr[i] : diff;
		}
	}
	diff == 0 ? diff = qual_length: diff;
	this.missing_elms = param;
	param > 0 ? param = arr.length - param : param = 0;
	var menu_type = Data.getVideoType(0);
	if(this.page > 0 && menu_type == 'play_link'){
		var offs = 0;
		// var total_elms = Data.getVideoCount();
		// if(total_elms > (this.size * qual_length)) {
		// 	var offs = this.page * (this.size * diff);
		// } else {
		// 	var offs = this.page * ((this.size * qual_length) - this.missing_elms);
		// }
		//var offs = this.page * (total_elms - this.missing_elms);
		//var offs = this.page * ((this.size * qual_length) - this.missing_elms);
		// var offs = this.page * (this.size * diff) /*+ param*/;
	} else if (menu_type == 'sub_section') {
		var offs = 0;
	} else if (menu_type == 'folders' && this.page > 1) {
		var offs = 0;
		this.page % 2 == 0 ? offs = this.size : offs;
	} else {
		var offs = this.page * this.size;
	}

	var innerHtml = '';
	if(menu_type == 'play_link') {
		$('#search').val('');
		$('.autocomplete').html('');
		var n = this.elem_num;
	}else {
		var n = offs;
	}

	//for( var i = 0; i < this.size || this.current_size < 9 && i < this.size; ++i )
	for( var i = 0; i < data_len && this.current_size < 9; ++i ){
		if ( this.playlist[offs+i] ){

				var channelHtml = Channel.GetContainer((offs+i+1));
				var extended_info = Channel.getExtendedData((offs+i+1));
				if(extended_info.serials) {
					var key = extended_info.serials;
					var reg = /(\d+-?\d*)/g;
					var series_num = key.match(reg)[1];
					if (series_num.indexOf('-') > -1) {
						var incr = series_num.match(/(\d+)/g)[1] - series_num.match(/(\d+)/g)[0];
						series_num = series_num.match(/(\d+)/g)[1];
						n += incr;
						this.elem_num = parseInt(series_num);
					}
					series_num < 1 ? series_num = 1 : series_num;
				} else{
					var series_num = n + 1;
				}
				if(series_num == n + 1) {
					if (quality_filter && extended_info.quality.indexOf(quality_filter) == -1) {
						//var key = extended_info.serials;
						var quality = extended_info.quality;
						// if(key) {
						// 	var reg = /(\d+)/g;
						// 	var series_num = key.match(reg)[1];
						// } else {
						// 	var series_num = n + 1;
						// }
						if(typeof serials[key][quality_filter] == 'undefined' /*&& series_num == n + 1*/) {
								//var quality_key = Menu.getQuality(0);
								var itemID = offs+i;
								var name = Data.getVideoName(itemID);
								image = '<img title="" src="./image/system/' + Channel.GetFileType(Data.getVideoName(itemID)) + '_image.png"/>';
								channelHtml = '<div id="n' + itemID + '" class="unselected ' + menu_type + '">' + image + name + '</div>';
								qual_length > 2 ? i += qual_length - diff : i;
						}
						else {
							// Data.removeVideoExtended((offs+i));
							// Data.removeVideoName((offs+i));
							// Data.removeVideoType((offs+i));
							// Data.removeVideoURL((offs+i));
							channelHtml = '';
						  //i--;
						}
				}
			}else {
				channelHtml = '';
			}

			  if(channelHtml) {
					 //channelHtml = channelHtml.replace(/n\d+/, "n"+this.current_size++);
			     //channelHtml = channelHtml.replace(/n\d+/, "n"+n++);
					 n++;
					 if(menu_type == 'play_link')
					 		this.elem_num++;
					 this.current_size++;
			  }

			 innerHtml += channelHtml;

		}
	}

	$('#'+this.divID).html(innerHtml);
}

Menu.FirstPage = function(){
	var quals = 1
	this.qualities.length > 0 ? quals = this.qualities.length : quals;
	this.page = 0;
	//this.pages = Math.ceil((parseInt($('#series_count').html()) / this.size));
	this.pages = Math.ceil(Math.ceil((Data.getVideoCount() + this.missing_elms) / this.size) / quals);
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
	//	this.elem_num -= (this.size + 1);
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

Menu.SetQualityHtml = function() {
	var menu_type = Data.getVideoType(Menu.GetItemId());
	if (menu_type == 'play_link') {
		var quality_array = Menu.GetQualities();
		if (quality_array.length > 0) {
			if (this.quality_selected_index < 0){
				$('.quality_name').text('All');
			} else {
				$('.quality_name').text(quality_array[this.quality_selected_index]);
			}

			$('.quality_block').css('display', 'table-cell');
		}
	} else {
		  $('.quality_block').css('display', 'none');
	}
}

Menu.SetBreadcrumbs = function(){
	var html = "";
	if (Channel.prev_data){
		$.each(Channel.prev_data, function(i, data){
			html += data.extended.menu_item_name + '\\';
		})
		var crumbs = '\\null\\null\\';
		if( html.indexOf(crumbs) >= 0) {
			html = $('#nav').html();
		}
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
	var playlist = $("#playlist");
	this.pos = Menu.GetItemPos();
	var quals = 1;
	this.qualities.length > 0 ? quals = this.qualities.length: quals;
	if( this.pos < ((Data.getVideoCount() + this.missing_elms) / quals) - 1 ) {
		if ( (this.pos + 1) % 9 != 0) {
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
	var playlist = $("#playlist");
	this.pos = Menu.GetItemPos();
	var quals = 1;
	this.qualities.length > 0 ? quals = this.qualities.length: quals;
	if ( this.pos % 9 != 0 ) {
		this.SelectPrev();
	} else {
		if(this.page > 1) {
				all_elems = Math.floor((Data.getVideoCount() / quals) + this.missing_elms);
				if(this.elem_num == all_elems) {
					this.elem_num -= (this.size + all_elems % this.size);
				}else{
					this.elem_num -= (this.size * 2);
				}
			} else if(this.page == 1){
				Menu.ResetElemNum();
			}
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
	id = parseInt(id);

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
			//this.Select();
		}
	}
	$("#playlist .selected").removeClass(this.selectedClass).addClass(this.unselectedClass);
	$('#playlist #n' + id).addClass(this.selectedClass);

}

Menu.GetItemId = function()
{
	var playlist = $("#playlist");
	var arr = playlist.children();
	for(var i = 0; i < arr.length; i++) {
		if($(arr[i]).hasClass("selected")) {
			var id = $(arr[i])[0].id;
			var reg = /(\d+)/g;
			var index = id.match(reg)[0];
			return index;
		}
	}
	//return this.page * this.size + this.pos;
}

Menu.GetItemPos = function()
{
	var playlist = $("#playlist");
	var arr = playlist.children();
	for(var i = 0; i < arr.length; i++) {
		if($(arr[i]).hasClass("selected")) {
			return i;
		}
	}
}

Menu.GetItem = function(){
	return this.playlist[this.GetItemId()];
}
