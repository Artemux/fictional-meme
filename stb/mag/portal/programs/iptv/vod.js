//<!--
var Stb = new StbApi();

var MainMenu = new PageMenu();
MainMenu.List = playlist;
var ShowMenu = MainMenu;
var StatusDiv = new Status();
var BottomDiv = new Status();
//
window.onload = function()
{
	Stb.Stop();
	Stb.SetFull();
	MainMenu.Init("MainMenu");
	BottomDiv.onload("BottomDiv");
	StatusDiv.onload("StatusDiv");
	document.addEventListener("keypress", KeyHandler, false);
	MainMenu.Show();
}
//
window.onunload = function()
{
	Stb.Stop();
	Stb.SetAlpha(10);
}
player.onstatechange = function()
{
	if ( Stb.GetEventCode() != 1 ){
		StatusDiv.Show(Stb.GetEventText(), 1500);
	} else {
		StatusDiv.Show("Error:"+Stb.GetErrorText(), 2000);
	}
}
//
function KeyHandler(event)
{
	var keyrtn = true;
	var key = event.keyCode > 0 ? event.keyCode : event.charCode;
	switch(key)
	{
		case VK_STOP:
			Stb.Stop();
			ShowMenu = MainMenu;
			ShowMenu.Show();
			keyrtn=false;
		break;
		case VK_PLAY:
			switch( Stb.GetEventCode() )
			{
				case 4:
					Stb.Pause();
				break;
				case 5:
					Stb.Continue();
				break;
				default:
					StatusDiv.Show("Cannot PLAY/PAUSE because STB "+Stb.GetEventText(),3000);
				break;
			}
			StatusDiv.Show(Stb.GetEventText(), 2000);
			keyrtn=false;
		break;
		case VK_REC:
			StatusDiv.Show(Stb.GetEventText(),1500);
			keyrtn=false;
		break;
		case VK_RED:
			Stb.Stop();
			ShowMenu = MainMenu;
			ShowMenu.Show();
			keyrtn=false;
		break;
		case VK_GREEN:
			keyrtn=false;
		break;
		case VK_YELLOW:
			keyrtn=false;
		break;
		case VK_BLUE:
			keyrtn=false;
		break;
		case VK_PG_UP:
			if ( ShowMenu ){
				ShowMenu.PageUp();
			}
			keyrtn=false;
		break;
		case VK_PG_DOWN:
			if ( ShowMenu ){
				ShowMenu.PageDown();
			}
			keyrtn=false;
		break;
		case VK_RIGHT:
			if ( ShowMenu ){
				ShowMenu.PageDown();
			}
			keyrtn=false;
		break;
		case VK_LEFT:
			if ( ShowMenu ){
				ShowMenu.PageUp();
			}
			keyrtn=false;
		break;
		case VK_MUTE:
			keyrtn=false;
		break;
		case VK_UP:// channel ++
		case VK_CHAN_UP:
			if ( ShowMenu ){
				ShowMenu.Prev();
			}
			keyrtn=false;
		break;
		case VK_DOWN:// channel --
		case VK_CHAN_DOWN:
			if ( ShowMenu ){
				ShowMenu.Next();
			}
			keyrtn=false;
		break;
		case VK_OK: //ok
			if ( ShowMenu ){
				ShowMenu.Hide();
				Stb.PlayVOD(playlist[ShowMenu.GetItemId()][0]);
				ShowMenu = null;
			}
			keyrtn=false;
		break;
		default:
			if ( key > 47 && key < 58 ){
				keyrtn=false;
			}
		break;
	}
	return keyrtn;
}
//-->

