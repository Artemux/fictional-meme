<?php

/**
 * @author Vladimir
 * @copyright 2010
 */

DEFINE ("HTML_DIR", "/www/server/");
DEFINE ("LIB_DIR",HTML_DIR."lib/");
require_once(LIB_DIR."mysql.cl.php");

$DB = new db();
$DB->sqlq("SELECT * FROM `VOD_Servers` WHERE 1")->toArray($arr);
foreach($arr as $key => $val ){
    $fp = fsockopen($val['ServerIP'], $val['ServerPort'], $ErrorNumber, $ErrorText, 10);
    if (!$fp) {
            echo "{$val['ServerIP']} - ERROR: $ErrorNumber - $ErrorText\n";
            $DB->sqlq("UPDATE `VOD_Servers` SET `status`=0 WHERE `id`={$val['id']}");
            //return array("title"=>"ERROR: $ErrorNumber - $ErrorText", "text"=>"<font color=\"red\">нет соединения</font>");
    } else {
        $dir = $val['VODDIR'];
        fwrite($fp,"\n");
        $txt = fread($fp, 512);
        fwrite($fp,"df $dir\n");
        $txt = fread($fp, 512);
        fclose($fp);
        if (preg_match_all("/(\d{1,3}G)/",trim($txt), $match) != false){
            $DB->sqlq("UPDATE `VOD_Servers` SET `DiskSpace`='".$match[0][0]."', `DiskUsage`='".$match[0][1]."', `status`=1 WHERE `id`={$val['id']}");
        }
    }
}

?>