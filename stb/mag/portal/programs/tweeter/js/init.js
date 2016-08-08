$("html").keypress (function (e){keyListener(e)});

if ( typeof(Api) == 'undefined' ){
	Api = new StbApi();
}

$(document).ready(function(){

	Clock("#header #left .clock");
	WeatherWidget("#header #right");
	
	$("#tweeter").tweet({
		username: "habrahabr",
            join_text: "auto",
            avatar_size: 32,
            count: 5,
            loading_text: "загрузка твитов..."
	});
	
})

function keyListener(event)
{
	var handled = true;
	var key = event.keyCode > 0 ? event.keyCode : event.charCode;
	var shift = event.shiftKey;
	var key = event.which;
	var alt = event.altKey;
	pat = /^(\S+)_(\S+)/;
	
	switch(key)
	{	
		case VK_UP:
			Menu.Prev();
		break;
		case VK_DOWN:
			Menu.Next();
		break;
        case VK_LEFT:
        
		break;
        case VK_RIGHT:
               
		break;
		case VK_GREEN:
			if ( alt === false ){
				Menu.PopupShow('<p>hi there!!</p>');
			}
		break;
		case VK_RED:
			if ( alt === false ){
				Menu.PopupHide();
			}
		break;
		case VK_OK:
			var $a = $("#el"+Menu.element);
			eval($a.attr('name'));
		break;
		case VK_EXIT:
			window.location.href = Api.GetHomePage();
		break;
		case VK_REFRESH:
			window.location.reload();
		break;	
		case VK_BACK:
             
		break;
	}
    
	return;
}