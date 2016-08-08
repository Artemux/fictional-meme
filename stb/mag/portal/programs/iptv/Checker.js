var Checker = function(){
	this.tmId = null;
	this.delayTmId = null;
	this.delayTm = 1000;
	this.maxNum = 10;
	this.num = 0;
	this.name = '';
	
	this.status = false; 
	
	this.Init = function( name ){
		this.name = name;
		
		this.Start();
	
	}

	this.Start = function(){
		//if ( this.tmId ){
		//	this.Stop();
		//}
		this.tmId = eval("setInterval(function(){"+this.name+".Check();},1000)");
	}
	this.Stop = function(){
		clearInterval(this.tmId);
		this.tmId = null;
	}

	this.Check = function(){
		
		if ( this.status == true && this.delayTmId == null ){

			this.delayTmId = eval("setTimeout(function(){"+this.name+".Action();},"+this.delayTm+")");
		
		}
		
	}

	this.Action = function(){
		
		if ( this.delayTmId ){
			
			clearTimeout( this.delayTmId );
			this.delayTmId = null;
			
		}
		
		if ( this.status == true ){
			
			if ( this.num <= this.maxNum ){
				var udp = CurMenu.List[CurMenu.GetItemId()][0];
				if (udp != ''){
					Api.PlayTV(udp);
				}
				this.num++;
				this.delayTm = this.delayTm * 2;
				
			}
			
		}
		
	}

	this.Reset = function(){
		
		this.SetDefaults();
		
	}

	this.SetDefaults = function(){
		
		this.num = 0;
		this.delayTm = 1000;
		
	}

	this.Enable = function(){
		
		this.status = true;
			
	}

	this.Disable = function(){
		
		this.status = false;
		
	}
	
}

