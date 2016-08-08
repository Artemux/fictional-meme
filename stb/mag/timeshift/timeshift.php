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

$ts_server = "172.17.24.14";
$maxProcess = 10;
$debug = array();

if (isset ($_GET['record'])){
    $_GET['startRecord'] = 'false';
    $_GET['stopRecord'] = 'false';
    $_GET['getRecord'] = 'false';
    $_GET['aboutRecord'] = 'false';
    $arr = explode("$", $_GET['record']);
    if ( $arr ){
        if ( $arr[0] == "start" ) $_GET['startRecord'] = 'true';
        else if ( $arr[0] == "stop" ) $_GET['stopRecord'] = 'true';
        else if ( $arr[0] == "get" ) $_GET['getRecord'] = 'true';
        $tmp = explode("^", $arr[1]);
        if ( $tmp ){
            $tmpPeer = explode(":", $tmp[0]);
            $_GET['chanPeer'] = $tmpPeer[0];
            $_GET['chanName'] = $tmp[1];
            $_GET['chanID'] = $tmp[2];
            
            $clientAddr = $arr[2];
        }
    }
    unset($arr);
}

if (isset( $_GET['chanID'] ) && !is_array($_GET['chanID']) ){
        $chanID = $_GET['chanID'];
        $chanName = $_GET['chanName'];
        $chanPeer = $_GET['chanPeer'];
}

if ( $_GET['startRecord'] == 'true' && !is_array($_GET['startRecord']) ){       
        $DATABASE = new db();
        $TS = new timeshift( $chanID, $chanName, $chanPeer );
        
        // проверка на количество запущенных процессов
        
        $check = $DATABASE->sqlq("  SELECT `processRun` FROM `TIMESHIFT_records` WHERE `processRun` = 1")->num_rows();
        if ( $check >= $maxProcess ){
            echo "-1";
            exit;
        }
        // проверка на завершение ранее начатых записей канала
        // если такие есть, то завершаем их
        $check = $DATABASE->sqlq("   SELECT * FROM `TIMESHIFT_records` 
                            WHERE `userIP` = '".$clientAddr."' AND `stopRecord` < `startRecord` 
                            ORDER BY `id` DESC 
                            LIMIT 1")->num_rows();
        if ( $check != 0 ){
            $DATABASE->sqlq("   SELECT * FROM `TIMESHIFT_records` 
                            WHERE `userIP` = '".$clientAddr."' AND `stopRecord` < `startRecord` 
                            ORDER BY `id` DESC 
                            LIMIT 1")->toArray($arr);
            for ($i = 0; $i < $check; $i++){
                if ( $TS->StopRecord( $ts_server, $arr[$i]['procPID'] ) ){
                    $DATABASE->sqlq("   UPDATE `TIMESHIFT_records` SET `stopRecord` = '".date("Y-m-d H:i:s")."'
                                        WHERE `id` = '".$arr[$i]['id']."'");
                    $txt = "process with PID ".$arr[$i]['procPID']." killed ";
                    if (DEBUG == true){
                        $debug[] = $txt;
                    }
                    //echo $txt;
                }    
            }    
        }
        // стартуем запись занала
        $obj = $TS->StartRecord( $ts_server );
        if ( is_object($obj) ){
            $txt = "process with PID ".$obj->pid." started ";
            $DATABASE->sqlq("   INSERT INTO `TIMESHIFT_records` ( `id`, `procPID`, `processRun`, `filename`, `chanID`, `startRecord`, `getRecord`, `stopRecord` , `serverIP` ,`userIP` ,`deleted`, `comment` )
                                VALUES ('', '".$obj->pid."', '1' ,'".$obj->fileName."', '".$TS->chanID."', '".$obj->datetime."', '', '', '".$ts_server."', '".$clientAddr."', '','тестовая запись');");
            if (DEBUG == true){
                $debug[] = $txt;
            }
            $json['filename'] = $obj->fileName;
            $json['serverIP'] = $ts_server;
            print_r(json_encode($json));
            //echo $txt;     
        }
        else {
            if ( $err == 0 ) $txt = "Can`t start records. Because can`t connect to server ".$ts_server;
            else if ( $err == -1 ) $txt = "Can`t start record program. Exit";
            
            if (DEBUG == true){
                $debug[] = $txt;
            }
            //echo $txt;
        }            
}


if ( $_GET['DeleteRecord'] == 'true' && !is_array($_GET['DeleteRecord']) ){

}

if ( $_GET['aboutRecord'] == 'true' && !is_array($_GET['aboutRecord']) ){
        $DATABASE = new db();
        $DATABASE->sqlq("   SELECT *, TIME_TO_SEC(TIMEDIFF(`stopRecord`,`startRecord`)) as duration FROM `TIMESHIFT_records`  
                            ORDER BY `id` DESC")->toArray($arr);
        if ( $arr ){
            echo "<ul style=\"list-style: none;\">";
            foreach( $arr as $key => $value ){
                echo "<li>";
                echo $key.". ".$value['userIP'].": ".$value['filename']." - ".$value['duration'];
                echo "</li>";
            }   
            echo "</ul>"; 
        }  
        else {
            echo "No Recorded channels";
        }        
}

if ( $_GET['getRecord'] == 'true' && !is_array($_GET['getRecord']) ){
        unset ($arr);
        $TS = new timeshift();
        $DATABASE = new db();
        $DATABASE->sqlq("   SELECT * FROM `TIMESHIFT_records` 
                            WHERE `userIP` = '".$clientAddr."' AND `stopRecord` > `startRecord` 
                            ORDER BY `id` DESC 
                            LIMIT 1")->toArray($arr);
        if ( $arr ){
            $TS->GetRecord( $ts_server, $arr[0]['filename'] );
            $DATABASE->sqlq("   UPDATE `TIMESHIFT_records` SET `getRecord` = '".date("Y-m-d H:i:s")."'
                                WHERE `id` = '".$arr[0]['id']."'");
            unset($arr);                            
            $DATABASE->sqlq("   SELECT `filename`, `serverIP`, TIME_TO_SEC(TIMEDIFF(`stopRecord`,`startRecord`)) as duration FROM `TIMESHIFT_records`  
                                WHERE `userIP` = '".$clientAddr."'
                                ORDER BY `id` DESC LIMIT 1")->toArray($arr);
            
            if ( $arr ) print_r(json_encode($arr));
            else print_r('0'); 
        }       
}

if ( $_GET['stopRecord'] == 'true' && !is_array($_GET['stopRecord']) ){
        unset ($DATABASE);
        $DATABASE = new db();
        $TS = new timeshift();
        $DATABASE->sqlq("   SELECT * FROM `TIMESHIFT_records` 
                            WHERE `userIP` = '".$clientAddr."' 
                            ORDER BY `id` DESC LIMIT 1")->toArray($arr);
        if ($arr){
            if ( $TS->StopRecord( $ts_server, $arr[0]['procPID'] ) ){
                $DATABASE->sqlq("   UPDATE `TIMESHIFT_records` SET  `processRun`  = '0', `stopRecord` = '".date("Y-m-d H:i:s")."'
                                    WHERE `id` = '".$arr[0]['id']."'");                
                $txt = "process with PID ".$arr[0]['procPID']." killed. DB updated";
                if (DEBUG == 'true'){
                    $debug[] = $txt;
                }
                //echo $txt;
            }
        }
        else {
            $txt = "Can`t stop. Because there is no started records";
            if (DEBUG == 'true'){
                $debug[] = $txt;
            }
            //echo $txt;
        }    
}

if (DEBUG == true){
    debug_to_file($debug);
}

function debug_to_file( $debug ){
    global $clientAddr;
    $f = fopen(HTML_DIR."logs/timeshift.log", "a+");
    for ( $i = 0; $i < sizeof($debug); $i++ ){
        $str = date("Y-m-d H:i:s")." - ".$clientAddr." - ".$debug[$i]."\n";
        fwrite( $f, $str );
    }
    fclose( $f );
}

?>