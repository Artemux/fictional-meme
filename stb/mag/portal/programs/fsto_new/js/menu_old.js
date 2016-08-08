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
	this.dirs = "";
	this.type = 'video';
	
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
		var list = Api.ListDir(this.dir);
		eval(list);
		this.files = files;
		this.dirs = dirs;
		this.dirs.splice(this.dirs.length-1,1);
		var max_elements = this.dirs.length+this.files.length;
		this.GetDirList();
		// компенсируем элемент назад в папку
		max_elements += 1;
		this.pages = Math.ceil(max_elements/this.max_items);

		this.Render();		
	}
	
	this.GetDirList = function(){
		
		var dirlist = new Array();
		c = 0;
		for( i = 0; i<this.dirs.length; i++){
			if (typeof(this.dirs[i]) != 'undefined'){
				if (this.dirs[i] != ''){
					dirlist[c] = this.dirs[i];
					c++
				}
			}
		}
		for( i = 0; i<this.files.length; i++){
			if (typeof(this.files[i]) != 'undefined'){
				if (typeof(this.files[i].name) != 'undefined'){
					dirlist[c] = '[{name:' + this.files[i].name+ '},{size:' + this.files[i].size +'}]';
					c++
				}
			}
		}
	}
	
	this.ChangeDir = function( id ){
		if (id == -1){
			if (this.def_dir != this.dir){
				var pos = 0;
				if ( this.dir[this.dir.length-1] == '/'){
					this.dir = this.dir.substr( 0, this.dir.length-1 )
				}
				pos = this.dir.lastIndexOf('/');
				this.dir = this.dir.substr( 0, pos ) + "/";
			}
		} else {
			this.dir += this.dirs[id];
		}
		this.page = 1;
		this.element = -1;
		this.LoadPlaylist();
	}
	
	this.SetManual = function(dirs, files){
		this.files = files;
		this.dirs = dirs;
		
		var max_elements = this.dirs.length+this.files.length;
		this.pages = Math.ceil(max_elements/this.max_items);
	}
	
	this.Render = function( ){
		var c = 0;
		var act = 'dirs';
		var max = this.max_items+1;
		$(this.blk).html("");
		if ( this.def_dir != this.dir ){
			if (this.page == 1){
				id = this.max_items-max;
				var image = '<img title="" src="./image/system/back_image.png"/>';
				text = '<div id="el'+id+'" class="button" name="'+this.name+'.ChangeDir(-1)">'+ image + '.</div>';	
				//text = '<input type="button" value="." onclick="javascript: '+this.name+'.ChangeDir(-1)"/>';
				$(this.blk).append(text);
				max--;
			}
		}
		
		if ( this.page == 1){
			for( i = this.page*this.max_items - this.max_items; i<=this.max_items*this.page; i++){
				var el = i;
				
				if (max != 1){
					var image = '<img title="" src="./image/system/folder_image.png"/>';
					if (typeof(this.dirs[el]) != 'undefined'){
						if (this.dirs[el] != ''){	
							id = this.max_items-max;
							text = '<div id="el'+id+'" class="button" name="'+this.name+'.ChangeDir(\''+el+'\')">'+image + " " +this.dirs[el]+'</div>';			
							//text = '<input type="button" value="'+this.dirs[el]+'" onclick="javascript: '+this.name+'.ChangeDir(\''+el+'\')"/>';
							$(this.blk).append(text);
							max--;
						}		
					}
				}
			} 
	
			if (max != 1){
				
				for( i = this.page*this.max_items - this.max_items; i<=this.max_items*this.page; i++){
					var el = i - this.dirs.length - 1;
					if (max != 1){
						if (typeof(this.files[el]) != 'undefined'){
							if (typeof(this.files[el].name) != 'undefined'){
								id = this.max_items-max;
								var f_name = this.files[el].name;
								
								image = '<img title="" src="./image/system/'+this.GetFileType(this.files[el].name)+'_image.png"/>';

								if (f_name.length > 38) {
									f_name = f_name.slice(0, 38) + '...';
								}
								text = '<div id="el'+id+'" class="button" name="VodPlay(\''+el+'\')">'+image + " " +f_name+ ' <span>' + this.GetFileSize(this.files[el].size) +'</span></div>';				
								//text = '<input type="button" value="'+this.files[el].name+'" onclick="javascript: VodPlay(\''+el+'\')"/>';
								$(this.blk).append(text);
								max--;
							}	
						}
					}
				}
			}
		} else {
			for( i = this.page*this.max_items - this.max_items; i<=this.max_items*this.page; i++){
				var el = i;
				
				if (max != 1){
					var image = '<img title="" src="./image/system/folder_image.png"/>';
					if (typeof(this.dirs[el]) != 'undefined'){
						if (this.dirs[el] != ''){	
							id = this.max_items-max;
							text = '<div id="el'+id+'" class="button" name="'+this.name+'.ChangeDir(\''+el+'\')">'+image + " " +this.dirs[el]+'</div>';			
							//text = '<input type="button" value="'+this.dirs[el]+'" onclick="javascript: '+this.name+'.ChangeDir(\''+el+'\')"/>';
							$(this.blk).append(text);
							max--;
						}		
					}
				}
			} 
	
			if (max != 1){ 
				for( i = this.page*this.max_items - this.max_items; i<=this.max_items*this.page; i++){
					var el = i - this.dirs.length-1;
					if (max != 1){
						if (typeof(this.files[el]) != 'undefined'){
							if (typeof(this.files[el].name) != 'undefined'){
								id = this.max_items-max;
								
								image = '<img title="" src="./image/system/'+this.GetFileType(this.files[el].name)+'_image.png"/>';
								
								var f_name = this.files[el].name;
								if (f_name.length > 38) {
									f_name = f_name.slice(0, 38) + '...';
								}
								text = '<div id="el'+id+'" class="button" name="VodPlay(\''+el+'\')">'+image + " "+f_name+ ' <span>' + this.GetFileSize(this.files[el].size) +'</span></div>';				
								//text = '<input type="button" value="'+this.files[el].name+'" onclick="javascript: VodPlay(\''+el+'\')"/>';
								$(this.blk).append(text);
								max--;
							}	
						}
					}
				}
			}
		}
		this.total_elements = this.max_items-max;
		$("#el"+this.element).removeClass("button").addClass("button_active");
		$("#nav").html(this.dir);
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
	
	this.GetFileType = function( filename ){

		var image_pat = /(?:\.jpg|\.jpeg)$/;
		var music_pat = /(?:\.wav|\.mp3)$/;
		
		var fileType = 'film';
		
		if ( filename.toLowerCase().search(image_pat) != -1 ){
			fileType = 'photo';
		} else if ( filename.toLowerCase().search(music_pat) != -1 ){
			fileType = 'music';
		} else {
			fileType = 'film';
		}
		return fileType;
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
