$("html").keydown(function (e){keyListener(e)});

if ( typeof(Api) == 'undefined' ){
	Api = new StbApi();
}

var Menu = new Menu();

var autocomleteStatus = true;

$(document).ready(function(){

	Clock("#header #left .clock");
	WeatherWidget("#header #right");
	
	Menu.Init('playlist', 'Menu');
	Menu.SetDefault();

	Api.EnableVKButton();
})

function LiveSearch(){
	if (autocomleteStatus == true){
		var text = $('#search').val();
		if (text.length >= 1){
			$.ajax({
				url: 'ajax.php',
				dataType: 'json',
				data: 'search='+$('#search').val(),
				beforeSend : function() {
					$('#loading').show();
					$('#playlist').html('');
				},
				success: function(data){
					Menu.SetList(data);
				},
				complete: function(){
					$('#loading').hide();
				}
			});	
		}
	}
}

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
			
			$('#search').blur();
			
			if (Menu.IsPopup() == false){
				Menu.Prev();
			} else {
				Menu.PopupScroll(-20);
			}
		break;
		case VK_DOWN:
		
			$('#search').blur();
			
			if (Menu.IsPopup() == false){
				Menu.Next();
			} else {
				Menu.PopupScroll(20);
			}
		break;
        case VK_GREEN:
			$('#search').focus();
		break;
        case VK_RIGHT:
               
		break;
		case VK_OK:
			//$('#search').blur();
			var $a = $("#el"+Menu.element);
			eval($a.attr('name'));
		break;
		case VK_EXIT:
			 if (Menu.IsPopup()){
			 	Menu.PopupHide();
			 } else {
			 	window.location.href = Api.GetHomePage();
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
		case VK_1:
            
		break;
	}
    
	return;
}