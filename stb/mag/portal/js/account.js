var connect = false;
var activate = false;
var payment_date = new Date();
var money = 0.00;
var discount = 0; //либо пустое либо число скидки
var serviceName = 'не установлен';
var error = false;
var lock = 0;
if ( typeof(Api) == 'undefined' ){
	Api = new StbApi();
}

$(document).ready(function(){   
    $("html").keyup(function (e){keyListener(e)});
    Clock();
	Api.Navigation(true);
	
	// проверка наличия на приставке уникального идентификатора	
    connect = Api.GetDeviceAID()*1;
	if (connect < 1){
		connect = false;
	}

	$.get(Api.GetInterfaceUrl(), { "m": "getInfo" },
        function(data){
			var ar = data.split(";");
			if (ar.length > 4){
				if (ar[0] == 0) activate = true;
				payment_date = GetDate(ar[1]);
				money = ar[2];
				discount = ar[3];
				serviceName = ar[4];
			} else {
				error = true;
			}
			Render();
    	});
	
	$('.payService').live('click', function(){
		PayService($(this).attr('name'));
	})
	
	$('#confirm_card').click(function(){
    	var code = $('#card_code').val();
    	if (code.length < 14){
    		alert("Не хватает символов. Проверьте правильность ввода кода с карточки.");
    		$('#popup_form :input:first[type!=hidden][disabled!=disabled][readonly!=readonly]').focus();
    	} else if(code.length > 15){
    		alert("Слишком много символов. Проверьте правильность ввода кода с карточки.");
    		$('#popup_form :input:first[type!=hidden][disabled!=disabled][readonly!=readonly]').focus();
    	} else {
    		CardPayment(code);
    	}
	});

});

var Render = function(){
	if (error === true){
    	alert("Ошибка получения данных. Попробуйте позже.")
    } else {
    	$("#money").append(money);
    	$("#date").append(payment_date);
		$("#service").append(serviceName);
    	//$("#discount").append(discount*1);
    	if (activate === false){
    		$("#active").append("<span>не активна</span>");
    		$("#activate_btn").show();
    	} else {
    		$("#active").append("<span>активная</span>");
    		$("#activate_btn").hide();
    	}
    }
	
	if (connect === false ){
		$('#connect').html('не подключен');
		$('#connectAccount_btn').html('<img style="float: left;" title="" alt="" src="./images/ButtonYellow.png">&nbsp; Привязать аккаунт</div>');
	} else {
		$('#connect').html('id #'+connect );
		$('#connectAccount_btn').html('<img style="float: left;" title="" alt="" src="./images/ButtonYellow.png">&nbsp; Отключить аккаунт</div>');
	}
}

var GetDate = function(unixtime){
	if ( unixtime != ""){
		var d = new Date();
		d.setTime(unixtime*1000);
		d.toUTCString();
		
		var month=new Array(12);
		month[0]="января";
		month[1]="февраля";
		month[2]="марта";
		month[3]="апреля";
		month[4]="мая";
		month[5]="июня";
		month[6]="июля";
		month[7]="августа";
		month[8]="сентября";
		month[9]="октября";
		month[10]="ноября";
		month[11]="декабря"; 
	
		return d.getDate() + " " + month[d.getMonth()] + " " + d.getFullYear();
	} else {
		return "-";
	}
}

var Card = function(){
	$blk = $("#Card");
	var disp = $blk.css("display");
	if (disp == "none"){
		$blk.css("display","block");
		$('#popup_form :input:first[type!=hidden][disabled!=disabled][readonly!=readonly]').focus();
	} else {
		$blk.css("display","none");
	}
}

var CardPayment = function( code ){
	$.get(Api.GetInterfaceUrl(), { "m": "addmoney", "c": code },
        function(data){
			data = data*1;
			if (data === 0){
				alert("Карточка уже была использована");
				$('#popup_form :input:first[type!=hidden][disabled!=disabled][readonly!=readonly]').focus();
			} else if ( data === 1){
				alert("Активация карточки прошла успешно");
				window.location.reload();
			} else {
				alert("Ошибка. Неверный номер карточки.")
			}
	});
}

var Activate = function(){
	if (activate === false){
		$.get(Api.GetInterfaceUrl(), { "m": "enable" },
        function(data){
        	data = data*1;
			if (data == 0){
				alert("Не достаточно денег на лицевом счету. Пополните ваш счет");
			} else if ( data == 1){
				alert("Процесс активации завершен");
				window.location.reload();
			} else {
				alert("Ошибка. В процессе активации. Попробуйте позже или свяжитесь с службой технической поддержки.")
			}
    	});
	} else {
		alert("Учетная запись уже активна")
	}
}

var GetService = function(){	
	if (activate === false){
		
		$blk = $("#Services");
		var disp = $blk.css("display");
		if (disp == "none"){
			$blk.css("display","block");
			$('#popup_form :input:first[type!=hidden][disabled!=disabled][readonly!=readonly]').focus();
		} else {
			$('#service-list').html('');
			$blk.css("display","none");
		}
		
		$.getJSON(Api.GetInterfaceUrl(), { "m": "getServices" },
        function(data){
			var html = '';
        	$.each(data, function(id, Name){
				html += '<input type="button" name="'+id+'" value="'+Name+'" class="payService">';
			})
			$('#service-list').html(html);			
    	});
	} else {
		alert("Учетная запись уже активна")
	}
}

var PayService = function( id ){
	
	if (lock == 0){
		lock = 1;
		$.get(Api.GetInterfaceUrl(), { "m": "enable", "serviceID" : id },
        function(data){
        	data = data*1;
			if (data == 0){
				alert("Не достаточно денег на лицевом счету. Пополните ваш счет");
				lock = 0;
			} else if ( data == 1){
				alert("Процесс активации завершен");
				window.location.reload();
			} else {
				lock = 0;
				alert("Ошибка. В процессе активации. Попробуйте позже или свяжитесь с службой технической поддержки.")
			}
    	});
	}
	
	
}

var ConnectAccount = function(){
	if (connect === false){
		$.get(Api.GetInterfaceUrl(), { "m": "getAID" },
        function(data){
        	data = data*1;
			if (data <= 0){
				alert("Ваше оборудование не зарегестрировано в нашей сети");
			} else if ( data > 0){
				Api.SetDeviceAID(data);
				window.location.reload();
			} else {
				alert("Ошибка. В процессе активации. Попробуйте позже или свяжитесь с службой технической поддержки.")
			}
    	});
	} else {
		alert("Аккаунт уже привязан");
	}
}

var DisconnectAccount = function(){
	Api.SetDeviceAID(0);
	window.location.reload();
}

var EnterCard = function( keyStr ){
}
var SwitchLocation = function(location){
    if (location == 'BACK') dst = "./index.html";
    else dst="./index.html";
    window.location.href = dst;
}

function keyListener(event)
{
	var handled = true;
	var key = event.keyCode > 0 ? event.keyCode : event.charCode;

	switch(key)
	{	
		case VK_OK:
			if ( $("#Card").css("display") == 'block'){
				var code = $('#card_code').val();
		    	if (code.length < 14){
		    		alert("Не хватает символов. Проверьте правильность ввода кода с карточки.");
		    		$('#popup_form :input:first[type!=hidden][disabled!=disabled][readonly!=readonly]').focus();
		    	} else if(code.length > 15){
		    		alert("Слишком много символов. Проверьте правильность ввода кода с карточки.");
		    		$('#popup_form :input:first[type!=hidden][disabled!=disabled][readonly!=readonly]').focus();
		    	} else {
		    		CardPayment(code);
		    	}
			}
		break;
	
		case VK_GREEN:
			Card();
		break;
		
		case VK_YELLOW:
			GetService();
		break;
		
		case VK_REFRESH:
			window.location.reload();
		break;
		case VK_EXIT:
		case VK_BACK: // VK_BACK
			if ( $("#Card").css("display") == 'block'){
				$("#Card").hide();
			} else if ( $("#Services").css("display") == 'block'){
				$("#Services").hide();
			} else {
				Menu.BackController();
			}
             
		break;
		case VK_UP:
			if ( $("#Card").css("display") == 'block'){
				$("#Card").hide();
			} else if ( $("#Services").css("display") == 'block'){
				
			} else {
				Menu.BackController();
			}
             
		break;
	}

	return;
}