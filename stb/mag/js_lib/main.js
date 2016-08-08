var SwitchLocation = function(location){
    if (location == 'VOD') dst = "http://172.17.24.13/server/vod2/index.html";
    else if (location == 'TV') dst = "http://192.168.1.100/dlink2/iptv/index.html";
    else if (location == 'WEATHER') dst = "./weather.php?all=1";
    else if (location == 'MONEY') dst = "./money.php";
    else if (location == 'CALENDAR') dst = "./plugins/calendar/index.html";
    else if (location == 'SETTINGS') dst = "./setup/setup.htm";
    else if (location == 'BACK') dst = "../index.html";
    else dst="http://172.17.24.13/no_page.html";
    window.location.href = dst;
}
var arrow_left = "<div id =\"arrow_left\" style=\"position: absolute; left: -30px; top: 90px;\"><img src=\"../images/arrow_left.png\"\></div>";
var arrow_right = "<div id =\"arrow_right\" style=\"position: absolute; left: 215px; top: 90px;\"><img src=\"../images/arrow_right.png\"\></div>";
var arrow_left_active = "<img src=\"../images/arrow_left_active.png\"/>";
var arrow_right_active = "<img src=\"../images/arrow_right_active.png\"/>";
$(document).ready(function(){
    
    $("html").keypress (function (e){keyListener(e)});
    Clock(".system#left");
    AddArrows();
    $("div#back_button").bind('click', function(){
        SwitchLocation("BACK");
    })
    .mouseover(function()
    {
        $(this).css({'background-image': 'url(../images/button_back_bckg_active.png)'})
    })
    .mouseout(function(){
        $(this).css({'background-image': 'url(../images/button_back_bckg.png)'})
    });
});

function AddArrows(){
    if ($("div.weatherBodyActive").prev("div").attr('class') == 'weatherBody'){
        $("div.weatherBodyActive").append(arrow_left);
    }
    if ($("div.weatherBodyActive").next("div").attr('class') == 'weatherBody'){
        $("div.weatherBodyActive").append(arrow_right);
    }
}

function DeleteArrows(){
    $("div.weatherBodyActive #arrow_left").remove();
    $("div.weatherBodyActive #arrow_right").remove();
}

function keyListener(event)
{
	var handled = true;
	var key = event.keyCode > 0 ? event.keyCode : event.charCode;
	switch(key)
	{	
        case VK_LEFT: // VK_LEFT
        $("div.weatherBodyActive #arrow_left").html(arrow_left_active);
                $prev = $("div.weatherBodyActive").prev("div");
                DeleteArrows();
                if ($prev.attr('class') == 'weatherBody'){  
                    $("div#weather_block").animate({marginLeft:'+=238px'}, 0, function(){});
                    $("div.weatherBodyActive").attr("class","weatherBody");
                    $prev.attr("class","weatherBodyActive");
                }
                AddArrows();
		break;
        case VK_RIGHT: // VK_RIGHT
                $next = $("div.weatherBodyActive").next("div");
                DeleteArrows();
                if ($next.attr('class') == 'weatherBody'){  
                    $("div#weather_block").animate({marginLeft:'-=238px'}, 0, function(){});
                    $("div.weatherBodyActive").attr("class","weatherBody");
                    $next.attr("class","weatherBodyActive");
                }
                AddArrows();
		break;
		case VK_EXIT:
			window.location.href="http://172.17.24.14/server/mag/portal/";
		break;
		case VK_REFRESH:
			window.location.reload();
		break;	
		case VK_BACK: // VK_BACK
             SwitchLocation("BACK");
		break;
	}
    
	return;
}