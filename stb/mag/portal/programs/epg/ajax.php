<?php 
/**
 * @author Vladimir
 * @copyright 2010
 */
 
DEFINE ("HTML_DIR", "/opt/briz.ua/htdocs/stb/");
DEFINE ("LIB_DIR",HTML_DIR."lib/");
DEFINE ("SCRIPT_DIR", HTML_DIR."mag/epg/");
require_once(LIB_DIR."mysql.cl.php");
require_once(LIB_DIR."ssh.cl.php");
require_once(LIB_DIR."epg.cl.php");

$EPG = new epg();
  
if ( isset($_GET['getChannels']) ){
	
	echo json_encode($EPG->getChannels());
	
} else if ( isset($_GET['getChannelEpg']) && is_numeric($_GET['getChannelEpg'])){
	
	echo $EPG->ShowEPGFullEx($_GET['getChannelEpg']);
	
} else if ( isset($_GET['searchChannel']) && is_string($_GET['searchChannel']) && !empty($_GET['searchChannel'])){
	
	echo json_encode( $EPG->searchChannel($_GET['searchChannel']) );
	
}