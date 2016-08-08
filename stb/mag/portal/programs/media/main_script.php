<?php
header("Content-type: text/plain; charset=utf-8");
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);


DEFINE ("HTML_DIR", "/www/server/");
DEFINE ("LIB_DIR", HTML_DIR."lib/");
DEFINE ("SCRIPT_DIR", HTML_DIR."script/vod_new/");
require_once(LIB_DIR."mysql.cl.php");
require_once(LIB_DIR."vod_new/playlist.cl.php");
require_once(LIB_DIR."vod_new/userStat.cl.php");

date_default_timezone_set('Europe/Helsinki');
$DB = new db('billing');
$PLAYLIST = new Playlist();
$USERSTAT = new UserStat();

if ( isset($_GET['watchNow']) ){
	$watchNow = $_GET['watchNow'];
	$USERSTAT->WatchNow($watchNow, $_GET['Type']);
}

if ( isset($_GET['watched']) ){
	$watched = $_GET['watched'];
    $USERSTAT->UpdateWatchedFilm($watched, $_GET['Type']);
	//$USERSTAT->UpdateUserInfo($watched);
}

if(isset( $_GET['page']) ){
	$PLAYLIST->status_querry = $_GET['querry'];
	$PLAYLIST->CreatePlaylist($_GET['page']);
	print_r($PLAYLIST->playlist);
}

if (isset($_GET['erry'])){
	if ( $_GET['querry'] == "watched" ){
		$PLAYLIST->status_querry = "watched";
		$PLAYLIST->CreatePlaylist("1");
		print_r($PLAYLIST->playlist);
	}
	else echo "invalid value for QUERRY parametr";
}

if (isset( $_GET['description']) ){
    $PLAYLIST->status_querry = $_GET['querry'];
	$PLAYLIST->CreateDescription($_GET['description']);
	print_r($PLAYLIST->description);
}

if (isset( $_GET['descSimple']) ){
    $PLAYLIST->status_querry = $_GET['querry'];
	$PLAYLIST->CreateDescSimple($_GET['descSimple']);
	print_r($PLAYLIST->description);
}

if (isset( $_GET['filmInfo']) ){
    $PLAYLIST->status_querry = $_GET['querry'];
	$PLAYLIST->getFilmInfo($_GET['filmInfo']);
}

if (isset( $_GET['setup']) ){
	$PLAYLIST->status_querry = $_GET['setup'];
	$PLAYLIST->GetNumPage();
	print_r($PLAYLIST->num_page);
}

if (isset( $_GET['stopwatch']) ){
	$USERSTAT->WatchEnd();
}

if (isset( $_GET['showstartpage']) ){
	$PLAYLIST->ShowStartPage();
}


//$PLAYLIST->Debug();
//$USERSTAT->Debug();
$PLAYLIST->Destroy();
$USERSTAT->Destroy();

?>