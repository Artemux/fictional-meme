<?php

/**
 * @author Vladimir
 * @copyright 2010
 */

DEFINE ("HTML_DIR", "/www/server/");
DEFINE ("LIB_DIR",HTML_DIR."lib/");
DEFINE ("TS_DIR", "/vod/");

DEFINE ("SOCKET_PORT", "4321");

require_once(LIB_DIR."mysql.cl.php");
require_once(LIB_DIR."ssh.cl.php");
require_once(LIB_DIR."socketClient.cl.php");
        
$DATABASE = new db();

$DATABASE->sqlq("   SELECT `id`, `serverIP`, `procPID` FROM `TIMESHIFT_records`
                    WHERE `processRun` = 1
                    AND UNIX_TIMESTAMP(`startRecord`+INTERVAL 2 HOUR) <= UNIX_TIMESTAMP()")->toArray($arr);
if ( $arr ){
    foreach( $arr as $key =>$value ){
        try {
            $sc = new ClientSocket();
            $sc->open( $value['serverIP'] , SOCKET_PORT);
            $get = $sc->recv();
            $sc->send("stop ".$value['procPID']."\r\n");
            $get = $sc->recv();
            $sc->send("exit \r\n");
            $DATABASE->sqlq("   UPDATE `TIMESHIFT_records` SET  `processRun`  = '0', `stopRecord` = '".date("Y-m-d H:i:s")."'
                                WHERE `id` = '".$value['id']."'"); 
            echo date("Y-m-d H:i:s")." - "."PID [".$value['procPID']."] - was stoped. Because reached time limit ( 2 hours ).\n";
        } catch (Exception $e){
            echo $e->getMessage();
        }
    }
}
unset ($arr);

$DATABASE->sqlq("   SELECT `id`, `filename`, `serverIP`, `userIP` FROM `TIMESHIFT_records`
                    WHERE `processRun` = 0
                    AND `deleted` = 0
                    AND UNIX_TIMESTAMP(`stopRecord`+INTERVAL 3 HOUR) <= UNIX_TIMESTAMP()
                    ORDER BY id DESC")->toArray( $arr );
if ($arr){
    foreach( $arr as $key =>$value ){	
        try {
            $sc = new ClientSocket();
            $sc->open( $value['serverIP'] , SOCKET_PORT);
            $get = $sc->recv();
            $sc->send("delete ".$value['filename'].".ts\r\n");
            $get = $sc->recv();
            $sc->send("exit \r\n");
            $DATABASE->sqlq("  UPDATE `TIMESHIFT_records` SET `deleted` = 1
                                WHERE id = '".$value['id']."' LIMIT 1");
            echo date("Y-m-d H:i:s")." - [".$value['id']."][".$value['userIP']."] filename: ".$value['filename']." - DELETED. Old record reached time limit( 3 hours )\n"; 
        } catch (Exception $e){
            echo $e->getMessage();
        } 
    }
}

?>