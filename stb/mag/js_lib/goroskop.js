var arrow_up = "<div id =\"arrow_left\" style=\"position: absolute; left: 270px; top: -30px;\"><img src=\"../images/arrow_up.png\"\></div>";
var arrow_down = "<div id =\"arrow_right\" style=\"position: absolute; left: 270px; top: 220px;\"><img src=\"../images/arrow_down.png\"\></div>";
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
    if ($("div.goroskopBodyActive").prev("div").attr('class') == 'goroskopBody'){
        $("div.goroskopBodyActive").append(arrow_up);
    }
    if ($("div.goroskopBodyActive").next("div").attr('class') == 'goroskopBody'){
        $("div.goroskopBodyActive").append(arrow_down);
    }
}

function DeleteArrows(){
    $("div.goroskopBodyActive #arrow_left").remove();
    $("div.goroskopBodyActive #arrow_right").remove();
}

var SwitchLocation = function(location){
    if (location == 'VOD') dst = "http://172.17.24.13/server/vod2/index.html";
    else if (location == 'TV') dst = "http://192.168.1.100/dlink2/iptv/index.html";
    else if (location == 'WEATHER') dst = "./weather.php?all=1";
    else if (location == 'MONEY') dst = "./money.php";
    else if (location == 'CALENDAR') dst = "./plugins/calendar/index.html";
    else if (location == 'SETTINGS') dst = "./setup/setup.htm";
    else if (location == 'BACK') dst = "../index.html";
    else dst="http://172.17.24.14/no_page.html";
    window.location.href = dst;
}

function keyListener(event)
{
	var handled = true;
	var key = event.keyCode > 0 ? event.keyCode : event.charCode;

	switch(key)
	{	
        case VK_UP: // VK_UP
                $prev = $("div.goroskopBodyActive").prev("div");
                DeleteArrows();
                if ($prev.attr('class') == 'goroskopBody'){  
                    $("div#goroskop_block").animate({marginTop:'+=254px'}, 0, function(){});
                    $("div.goroskopBodyActive").attr("class","goroskopBody").css("visibility", "hidden");//.animate({opacity: "-=0.5"}, 1000);
                    $prev.attr("class","goroskopBodyActive").css("visibility", "visible");//.animate({opacity: "+=0.5"}, 1000);
                }
                AddArrows();
		break;
        case VK_DOWN: // VK_DOWN
                $next = $("div.goroskopBodyActive").next("div");
                DeleteArrows();
                if ($next.attr('class') == 'goroskopBody'){  
                    $("div#goroskop_block").animate({marginTop:'-=254px'}, 0, function(){});
                    $("div.goroskopBodyActive").attr("class","goroskopBody").css("visibility", "hidden");//.animate({opacity: "-=0.5"}, 1000);
                    $next.attr("class","goroskopBodyActive").css("visibility", "visible");//.animate({opacity: "+=0.5"}, 1000);
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