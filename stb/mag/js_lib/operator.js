(function() {
		var OperatorObj = function() {

			this.name = '';
			this.active = false;
			this.money = 0;
			this.discount = 0;
			this.expire_date = 0;

			this.chId = null;
			this.expireOld = null;
			this.error = false;

			this.Init = function(name) {
				this.name = name;
				this.GetInfo();
				setTimeout( this.name+'.SetExpireOld()',2000);
			}

			this.GetStatus = function() {
				return this.active;
			}

			this.GetMoney = function() {
				return this.money;
			}

			this.GetDiscount = function() {
				return this.discount;
			}

			this.GetExpireDate = function() {
				return this.expire_date * 1000;
			}

			this.Expire = function() {
				var curTime = new Date();
				var unixTime = curTime.getTime();

				if(this.GetExpireDate() < unixTime && this.GetExpireDate() != 0) {
					return true;
				} else {
					return false;
				}
			}

			this.ShowAlert = function(){
				$('#alert').show();
			}

			this.HideAlert = function(){
				$('#alert').hide();
			}

			this.SetExpireOld = function(){
				this.expireOld = this.Expire();
			}

			this.StartCheckExpire = function(){

				//if (this.chId != null){
				//	this.StopCheckExpire();
				//}

				this.chId = setInterval( this.name+'.CheckExpire()',30*60*1000);
			}

			this.StopCheckExpire = function(){
				clearInterval(this.chId);
			}

			this.CheckExpire = function(){
				var rand = this.GetRandom(10,60)*1000;
				var date = new Date();
				var day = date.getDate()*1;
				var hour = date.getHours()*1;
				if (day == 1 && hour > 2){
					this.GetInfo();
					setTimeout( this.name+'.RefreshList()',rand);
				}
			}

			this.RefreshList = function(){
				var expire = this.Expire();
				if ( this.expireOld != expire ){
					MainMenu.Reload();
					MainMenu.FirstPage();
					MainMenu.RestartTm();
					ChanObj.currentNo = 1;
					if ( expire === true){
						this.expireOld = expire;
						setTimeout( 'ChanObj.Play()',2000);
						//this.ShowAlert();
					} else {
						this.expireOld = expire;
						Api.Stop();
						setTimeout( 'ChanObj.Play()',2000);
						//this.HideAlert();
					}
				}

			}

			this.GetInfo = function() {
				var className = this.name;

				$.get(Api.GetInterfaceUrl(), {
					"m" : "getInfo"
				}, function(data) {
					eval(className + '.ParseData("' + data + '")');
				});

			}

			this.GetRandom = function(min, max){
		  		return Math.floor(Math.random() * (max - min + 1)) + min;
			}

			this.ParseData = function(data) {
				var ar = data.split(";");
				if(ar.length > 4) {
					if(ar[0] == 0)
						this.active = true;
						this.expire_date = ar[1];
						this.money = ar[2];
						this.discount = ar[3];
				} else {
					alert("incorrect data for parsing");
				}
			}

			this.SetCookie = function(name, value, expires, path, domain, secure) {
				document.cookie = name + "=" + escape(value) + ((expires) ? "; expires=" + expires : "") + ((path) ? "; path=" + path : "") + ((domain) ? "; domain=" + domain : "") + ((secure) ? "; secure" : "");
			}

			this.GetCookie = function(name) {
				var cookie = " " + document.cookie;
				var search = " " + name + "=";
				var setStr = null;
				var offset = 0;
				var end = 0;
				if(cookie.length > 0) {
					offset = cookie.indexOf(search);
					if(offset != -1) {
						offset += search.length;
						end = cookie.indexOf(";", offset)
						if(end == -1) {
							end = cookie.length;
						}
						setStr = unescape(cookie.substring(offset, end));
					}
				}
				return (setStr);
			}
		}
})();
