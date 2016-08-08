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
	this.servers = '';
	this.dirs = "";
	this.type = 'video';
	this.popupClass = '.popup';
	this.popup = false;
	
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

		this.servers = eval( Api.GetUserData('smb_data') );

		if (typeof(this.servers) != 'object'){
			this.servers = new Array(0);
		}
		
		max_elements = this.servers.length;	
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
	
	this.SetManual = function(dirs, files){
		this.files = files;
		this.dirs = dirs;
		
		var max_elements = this.dirs.length+this.files.length;
		this.pages = Math.ceil(max_elements/this.max_items);
	}
	
	this.AddForm = function(id){
		var url = '';
		var folder = '';
		var local = '';
		var login = '';
		var pass = '';
		var delBtnHtml = '';
		if (typeof(id) != 'undefined'){
			url = this.servers[id].url;
			folder = this.servers[id].folder;
			local = this.servers[id].local;
			login = this.servers[id].login;
			pass = this.servers[id].pass;
			delBtnHtml = '<input type="button" onclick="javascript: '+this.name+'.Delete('+id+');" value="Удалить" name="cancel">';
		}
		var html = '<h2>Редактировать</h2><br/>';
		html += '<p><span>URL:</span><input type="text" value="'+url+'" name="url"></input></p>';
		html += '<p><span>Папка</span><input type="text" value="'+folder+'" name="folder"></input></p>';
		html += '<p><span>Название</span><input type="text" value="'+local+'" name="local"></input></p>'; 
		html += '<p><span>Login</span><input type="text" value="'+login+'" name="login"></input></p>'; 
		html += '<p><span>Password</span><input type="text" value="'+pass+'" name="pass"></input></p><br/><br/>';
		html += '<p><input type="button" onclick="javascript: '+this.name+'.Add();" value="Сохранить" name="submit">&nbsp;'+delBtnHtml+'</p>';
		this.PopupShow(html);
	}
	
	this.Add = function(){
		var url = $('input[name=url]').val();
		var folder = $('input[name=folder]').val();
		var local = $('input[name=local]').val();
		var login = $('input[name=login]').val();
		var pass = $('input[name=pass]').val();
		
		if (local.length < 1){
			local = folder;
		}
		
		this.PopupShow('<h2>Подключение...</h2>');
		Api.AddSmbServer( url, folder, local, login, pass);
		this.PopupHide();
		this.LoadPlaylist();
		
	}
	
	this.Delete = function( id ){
		this.PopupShow('<h2>Удаление...</h2>');
		Api.DeleteSmbServer(this.servers[id].local);
		this.PopupHide();
		this.LoadPlaylist();
	}
	
	this.Render = function( ){
		var c = 0;
		var act = 'servers';
		var max = this.max_items+1;
		$(this.blk).html("");
		if (this.page == 1){
			id = this.max_items-max;
			var image = '<img title="" src="./images/server_add.png"/>';
			text = '<div id="el'+id+'" class="button" name="'+this.name+'.AddForm()">'+ image + ' Добавить</div>';	
			$(this.blk).append(text);
			max--;
		} else {
			id = this.max_items-max;
			var image = '<img title="" src="./images/back_image"/>';
			text = '<div id="el'+id+'" class="button" name="'+this.name+'.PrevPage()">'+ image + '...</div>';	
			$(this.blk).append(text);
			max--;
		}
		for( i = this.page*this.max_items - this.max_items; i<=this.max_items*this.page; i++){
			var el = i;
			if (max != 1){
				var image = '<img title="" src="./images/server.png"/>';
				if (typeof(this.servers[el]) != 'undefined'){
					if (this.dirs[el] != ''){	
						id = this.max_items-max;
						text = '<div id="el'+id+'" class="button" name="'+this.name+'.AddForm(\''+el+'\')">'+image + " " +this.servers[el].url+'\\'+this.servers[el].local+'</div>';			
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
		return this.popup;
	}
	this.PopupShow = function( html ){
		$(this.popupClass).html(html);
		$(this.popupClass+'_overlay').show();
		
		this.popup = true;
	}
	
	this.PopupHide = function(){
		$(this.popupClass).html('');
		$(this.popupClass+'_overlay').hide();
		
		this.popup = false;
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
