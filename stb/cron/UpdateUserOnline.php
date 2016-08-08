<?php
//vladimir ver 0.01 17.09.2009
//echo "-= UPDATE USER ONLINE STATUS SCRIPT =-\n\n";
date_default_timezone_set('Europe/Helsinki');
DEFINE ("HTML_DIR", "/www/server/");
DEFINE ("LIB_DIR",HTML_DIR."lib/");
require_once(LIB_DIR."mysql.cl.php");
$DB = new db();
//echo "Trying connect to database for IP list\n";			
$ipList = $DB->sqlq("SELECT `id`,`ip` FROM `VOD_UserStat`")->toArray();
if ( $ipList ){
    foreach ( $ipList as $key => $val ){
    	exec("ping -w 1 ".$val['ip'], $output, $retval);
    	if ($retval != 0){
            //echo "status OFFLINE\n";
    	    $DB->sqlq("UPDATE `VOD_UserStat` SET `status` = 0 WHERE `id` = '".$val['id']."'");
    	}
    	else{
            //echo "status ONLINE\n";
    	    $DB->sqlq("UPDATE `VOD_UserStat` SET `status` = 1 WHERE `id` = '".$val['id']."'");
    	}
    }
    echo date("d-M-Y H:i:s")." - UpdateUserOnline SCRIPT has finish his task\n";
}
?>