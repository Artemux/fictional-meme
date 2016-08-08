 $("html").keydown(function (e){keyListener(e)});

var arrow_up = "<div id =\"arrow_left\" style=\"position: absolute; left: 270px; top: -30px;\"><img src=\"../images/arrow_up.png\"\></div>";
var arrow_down = "<div id =\"arrow_right\" style=\"position: absolute; left: 270px; top: 220px;\"><img src=\"../images/arrow_down.png\"\></div>";
var arrow_left_active = "<img src=\"../images/arrow_left_active.png\"/>";
var arrow_right_active = "<img src=\"../images/arrow_right_active.png\"/>";
var elNum;

if ( typeof(Api) == 'undefined' ){
	Api = new StbApi();
}

$(document).ready(function(){
    
   	Clock("#header #left .clock");
	WeatherWidget("#header #right");
	
    $("ul li:first-child").attr("class","dailyNewsBlockActive");
    elNum = $("ul li");
    //AddArrows();
    $("div#back_button").bind('click', function(){
        SwitchLocation("BACK");
    })
    .mouseover(function()
    {
        $(this).css({'background-image': 'url(./images/button_back_bckg_active.png)'})
    })
    .mouseout(function(){
        $(this).css({'background-image': 'url(./images/button_back_bckg.png)'})
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

var GetIndexOfActiveElement = function(){
    var size = elNum.length;
    for ( i = 0; i < size; i++){
        if (elNum[i].className == "dailyNewsBlockActive") return i;
    }
    //else return -1;
}

var SwitchLocation = function(location){
    if (location == 'VOD') dst = "http://172.17.24.13/server/vod2/index.html";
    else if (location == 'TV') dst = "http://192.168.1.100/dlink2/iptv/index.html";
    else if (location == 'WEATHER') dst = "./weather.php?all=1";
    else if (location == 'MONEY') dst = "./money.php";
    else if (location == 'CALENDAR') dst = "./plugins/calendar/index.html";
    else if (location == 'SETTINGS') dst = "./setup/setup.htm";
    else if (location == 'BACK') {
        parts = String(document.location).split("?",2)[1];
        if (typeof(parts) == "undefined"){
            dst = "../index.html";
        }
        else dst = "./dailyNews.php";
    }
    else dst="http://172.17.24.14/no_page.html";
    window.location.href = dst;
}

var LoadCategory = function(){
    //alert(document.location.href+"?category="+$("li.dailyNewsBlockActive").attr("id"))
    document.location.href = document.location.href+"?category="+$("li.dailyNewsBlockActive").attr("id");
}

function keyListener(event)
{
	var handled = true;
	var key = event.keyCode > 0 ? event.keyCode : event.charCode;
	switch(key)
	{	
        case VK_UP: // VK_UP
                $prev = $("li.dailyNewsBlockActive").prev("li");
                //DeleteArrows();
                if ($prev.attr('class') == 'dailyNewsBlock'){  
                    if ( GetIndexOfActiveElement() > 3 ) $("ul.dailyNews").animate({marginTop:'+=36px'}, 0, function(){});
                    $("li.dailyNewsBlockActive").attr("class","dailyNewsBlock").css('height','24px');//.animate({opacity: "-=0.5"}, 1000);
                    $prev.attr("class","dailyNewsBlockActive");//.animate({opacity: "+=0.5"}, 1000);
                }
                //AddArrows();
		break;
        case VK_DOWN: // VK_DOWN
                $next = $("li.dailyNewsBlockActive").next("li");
                //DeleteArrows();
                if ($next.attr('class') == 'dailyNewsBlock'){  
                    if ( GetIndexOfActiveElement() > 2 ) $("ul.dailyNews").animate({marginTop:'-=36px'}, 0, function(){});
                    $("li.dailyNewsBlockActive").attr("class","dailyNewsBlock").css('height','24px')//.animate({opacity: "-=0.5"}, 1000);
                    $next.attr("class","dailyNewsBlockActive");//.animate({opacity: "+=0.5"}, 1000);
                }
                //AddArrows();
		break;
        case 132:
            document.location.href = "http://192.168.1.100/dlink2/data/LoadFullNews.php?loadNews="+$("li.dailyNewsBlockActive").attr('name');
            break;
        case VK_OK:
            parts = String(document.location).split("?",2)[1];
            if (typeof(parts) != "undefined"){
                var $el = $("li.dailyNewsBlockActive");
                if ($el.css('height') != "24px") {
                    $el.css('height','24px');
                }
                else {
                    $("li.dailyNewsBlockActive div.description").css('display','block');
                    $el.css('height','180px');
                }  
            } 
            else {
                LoadCategory();
            }
           
        break;
		case VK_BACK: // VK_LEFT
			SwitchLocation("BACK");
		break;
		case VK_REFRESH:
			window.location.reload();
		break;	
		case VK_EXIT:
			window.location.href = Api.GetHomePage();
		break;
	}
    
	return;
}