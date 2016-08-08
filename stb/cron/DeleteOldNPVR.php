<?php

/**
 * @author Vladimir
 * @copyright 2010
 */

date_default_timezone_set('Europe/Helsinki');

DEFINE ("DEBUG", "true");

DEFINE ("SOCKET_PORT", 4321);
DEFINE ("HTML_DIR", "/www/server/");
DEFINE ("LIB_DIR",HTML_DIR."lib/");
DEFINE ("TS_DIR", "/vod/");
require_once(LIB_DIR."mysql.cl.php");
require_once(LIB_DIR."timeshift.cl.php");

$DATABASE = new db();
$DATABASE->sqlq("   SELECT * FROM `NPVR_records`
                    WHERE UNIX_TIMESTAMP() >= UNIX_TIMESTAMP(`stopTime`+INTERVAL 3 DAY)")->toArray($arr);
if ($arr){
    foreach($arr as $key => $val){
        $fp = fsockopen ($val['serverIP'], "4321", $errno, $errstr);
        if (!$fp){
            echo "No connect to socket on {$val['serverIP']}:4321.\n";
        } else {
            fgets($fp);
            fputs($fp, "npvr stop ".$val['programID']);
            $DATABASE->sqlq("DELETE FROM `NPVR_records` WHERE `id` = '".$val['id']."'");
            //$DATABASE->sqlq("UPDATE `NPVR_records` SET `status` = '-2' WHERE `id` = '".$val['id']."'");
            echo date("Y-m-d H:i:s")." - NPVR - ".json_encode($val)."\n";
        }
        sleep(1);
    }
}
?>