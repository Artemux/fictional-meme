function Menu(){
	
	this.blk = ""
	this.name = "";
	
	this.page = 0;
	this.pages = 0;
	this.element = -1;
	this.def_dir = "";
	this.dir = "";
	this.item = 0;
	this.max_items = 9;
	total_elements = 0;
	this.list = "";
	this.files = "";
	this.servers = "";
	this.dirs = "";
	this.type = 'video';
	this.popup = '.popup';
	this.popupState = false;
	this.popupScroll = 0;
	
	this.Init = function( htmlDivId, className){
		this.blk = "#"+htmlDivId.toString();
		this.name = className;
	}
	
	this.SetDefault = function(){
		this.page = 1;
		this.pages = 1;
		this.element = -1;
		this.def_dir = "/media/";
		this.dir = "/media/";
		this.item = 0;
		this.list = "";
		this.files = "";
		this.dirs = "";
	}
	
	this.LoadPlaylist = function(){
		// url, folder, login, pass
		var max_elements = 0
		
		if (typeof(this.servers) == 'array' || typeof(this.servers) == 'object'){
			max_elements = this.servers.length;
		}
				
		max_elements += 1;
		
		this.pages = Math.ceil(max_elements/this.max_items);

		this.Render();		
	}
	
	this.GetDirList = function(){
		return 1;
	}
	
	this.ChangeDir = function( id ){
		return 1;
	}
	
	this.SetList = function(array){
		this.element = -1;
		
		if (typeof(array) == 'object'){
			this.servers = $.map(array, function (value, key) { return value; });
		} else {
			this.servers = array;
		}

		this.LoadPlaylist();
	}
	
	this.Edit = function(id){
		var url = '';
		var folder = '';
		var local = '';
		var login = '';
		var pass = '';
		if (typeof(id) != 'undefined'){
			url = this.servers[id].url;
			folder = this.servers[id].folder;
			local = this.servers[id].local;
			login = this.servers[id].login;
			pass = this.servers[id].pass;
		}
		var html = '<h2>Редактировать</h2><br/>';
		html += '<p><span>URL:</span><input type="text" value="'+url+'" name="url"></input></p>';
		html += '<p><span>Папка</span><input type="text" value="'+folder+'" name="folder"></input></p>';
		html += '<p><span>Название</span><input type="text" value="'+local+'" name="local"></input></p>'; 
		html += '<p><span>Login</span><input type="text" value="'+login+'" name="login"></input></p>'; 
		html += '<p><span>Password</span><input type="text" value="'+pass+'" name="pass"></input></p><br/><br/>';
		html += '<p><input type="button" onclick="javascript: alert(\'test\');" value="Принять" name="submit">&nbsp;<input type="button" value="Отменить" name="cancel"></p>';
		this.PopupShow(html);
	}
	
	this.Show = function( id ){
		$.ajax({
			url: 'ajax.php',
			dataType: 'html',
			data: 'get_page='+this.servers[id],
			beforeSend : function() {
				$('#loading').show();
			},
			success: function(data){
				var content = $('#content_0',$(data)).html();
				
				if (typeof(content) == 'object'){
					content = $('#content',$(data)).html();
				}
				
				Menu.PopupShow(content);
			},
			complete: function(){
				$('#loading').hide();
			}
		});	
	}
	
	this.Render = function( ){
		var c = 0;
		var act = 'servers';
		var max = this.max_items+1;
		$(this.blk).html("");
		
		for( i = this.page*this.max_items - this.max_items; i<=this.max_items*this.page; i++){
			var el = i;
			
			if (max != 1){
				var image = '<img title="" src="./images/server.png"/>';
				if (typeof(this.servers[el]) != 'undefined'){
					if (this.dirs[el] != ''){	
						id = this.max_items-max;
						text = '<div id="el'+id+'" class="button" name="'+this.name+'.Show(\''+el+'\')">'+image + " " +this.servers[el]+'</div>';			
						$(this.blk).append(text);
						max--;
					}		
				}
			}
		} 
		this.total_elements = this.max_items-max;
		$("#el"+this.element).removeClass("button").addClass("button_active");
		$("#page").html("Страница "+this.page+" из "+this.pages);
	}
	
	this.Next = function(){
		if (this.element < this.total_elements-1){
			$("#el"+Menu.element).removeClass("button_active").addClass("button");
			this.element++;
			$("#el"+Menu.element).removeClass("button").addClass("button_active");
		} else {
			this.NextPage();
		}
		
	}
	
	this.Prev = function(){
		if (this.element >= 0){
			$("#el"+Menu.element).removeClass("button_active").addClass("button");
			this.element--;
			$("#el"+Menu.element).removeClass("button").addClass("button_active");
		} else {
			this.PrevPage();
		}
	}
	this.NextPage = function(){
		if (this.page < this.pages){
			this.page++;
			this.element = -1;
			this.Render();
		}
	}
	this.PrevPage = function(){
		if (this.page > 1){
			this.page--;
			this.element = this.max_items-2;
			this.Render();
		}
	}
	
	this.Info = function(text){
		$(this.blk).html(text);
	}

	this.ShowInfo = function(){
	    $("#page").html("Страница "+this.page+" из "+this.pages);
	}
	
	this.IsPopup = function(){
		return this.popupState;
	}
	
	this.PopupShow = function( html ){
		var text = '<div id="main-text">';
		text += html;
		text += '<div class="clearfix"></div></div>';
		$(this.popup).html(text);
		$(this.popup+'_overlay').show();
		$(this.popup).focus();
		this.popupState = true;
		this.popupScroll = 0;
	}
	
	this.PopupHide = function(){
		$(this.popup).html('');
		$(this.popup+'_overlay').hide();
		
		this.popupState = false;
	}
	this.PopupScroll = function( px ){
		var x = this.popupScroll+px;
		if(x >= 0 && ($(this.popup + ' #main-text').height()) >= x ){
			this.popupScroll = x;
			$(this.popup).scrollTop(x);
		}
	}
	this.GetFileSize = function( bytes ){
		var rnd = 1;
		var result = '';
		if ( bytes >= 1073741824 ){
			rnd = 10;
			$result = (Math.floor(bytes/1073741824*rnd)/rnd) + "Gb";
		} else if ( bytes >= 1048576 && bytes < 1073741824 ){
			$result = (Math.floor(bytes/1048576*rnd)/rnd) + "Mb";
		} else {
			$result = (Math.floor(bytes/1024*rnd)/rnd) + "Kb";
		}
		return $result;
	}
}
