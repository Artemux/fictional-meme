<?php
//vladimir ver 0.01 17.09.2009
//echo "-= UPDATE USER WHATCHNOW STATUS SCRIPT =-\n\n";
date_default_timezone_set('Europe/Helsinki');

DEFINE ("HTML_DIR", "/www/server/");
DEFINE ("LIB_DIR",HTML_DIR."lib/");
require_once(LIB_DIR."mysql.cl.php");

$DB = new db();
$channel_list = $DB->sqlq("SELECT * FROM `EPG_ChanProgramm` WHERE 1 ORDER BY id ")->toArray();

if ($channel_list){
    
    foreach( $channel_list as $key => $channel ){
    	var_dump($channel);
    }
    
}
?>