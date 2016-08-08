$("html").keydown(function (e){keyListener(e)});

if ( typeof(Api) == 'undefined' ){
	Api = new StbApi();
}

var Menu = new Menu();

$(document).ready(function(){

	Clock("#header #left .clock");
	WeatherWidget("#header #right");
	Api.EnableVKButton();
	Menu.Init("playlist", "Menu");
	Menu.SetDefault();
	Menu.LoadPlaylist();

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
			if (!Menu.IsPopup()){
				Menu.Prev();
			}
			
		break;
		case VK_DOWN:
			if (!Menu.IsPopup()){
				Menu.Next();
			}
		break;
        case VK_LEFT:
        
		break;
        case VK_RIGHT:
               
		break;
		case VK_GREEN:
			if ( alt === false ){
				
			}
		break;
		case VK_RED:
			if ( alt === false ){
				
			}
		break;
		case VK_OK:
			if (!Menu.IsPopup()){
				var $a = $("#el"+Menu.element);
				eval($a.attr('name'));
			}
		break;
		case VK_EXIT:
			if (!Menu.IsPopup()){
				window.location.href = Api.GetVodServer();
			} else {
				Menu.PopupHide();
			}
			
		break;
		case VK_BUTTON:
			if (shift == false && alt == true){
				Api.EnableVKButton();
			}
		break;
		case VK_REFRESH:
			window.location.reload();
		break;	
		case VK_BACK:
             
		break;
	}
    
	return;
}