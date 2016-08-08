<?php
//vladimir ver 0.01 17.09.2009
//echo "-= UPDATE USER WHATCHNOW STATUS SCRIPT =-\n\n";
date_default_timezone_set('Europe/Helsinki');

DEFINE ("HTML_DIR", "/www/server/");
DEFINE ("LIB_DIR",HTML_DIR."lib/");
require_once(LIB_DIR."mysql.cl.php");

$DB = new db();
$check = $DB->sqlq("SELECT `id`, `time` FROM `VOD_UserStat` WHERE `time` != 0")->toArray();		
if ($check){
    $ch_time = time();
    $count = 0;
    foreach( $check as $key => $val ){
    	if ($ch_time - $val['time'] > 10800){
    	    ++$count;
    	    $DB->sqlq("UPDATE `VOD_UserStat` SET `time` = 0, `watchnow` = '' WHERE id = '".$val['id']."'");
    	}
    }
    if ( $count > 0 ){
         echo date("d-M-Y H:i:s")." - WHATCHNOW fixer finished. Fixed ".$count." user accounts\n";
    } 
}
?>