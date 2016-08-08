<?php

/**
 * @author Vladimir
 * @copyright 2010
 */

DEFINE ("DEBUG", "true");

DEFINE ("HTML_DIR", "/www/server/");
DEFINE ("LIB_DIR",HTML_DIR."lib/");
DEFINE ("TS_DIR", "/vod/");
require_once(LIB_DIR."mysql.cl.php");

DEFINE ("BUF", 1024);
DEFINE ("STB_HOST", "172.17.24.14");
DEFINE ("STB_HOST_PORT", "4320");


$maxUsers = 10;
$users = array();
$read = array();

$pid = getmypid();
$f = fopen("socket.pid", "w");
fwrite( $f, $pid );
fclose($f);

echo 'Create socket ... ';
if (($sock = socket_create(AF_INET, SOCK_STREAM, SOL_TCP)) != TRUE) {
    throw new Exception('socket_create() failed: '.socket_strerror(socket_last_error())."\n");
} else {
    echo "OK\n";
}

echo 'Bind socket ... ';
if (($ret = socket_bind($sock, STB_HOST, STB_HOST_PORT)) != TRUE) {
    throw new Exception('socket_bind() failed: '.socket_strerror(socket_last_error())."\n");
    exit;
} else {
    echo "OK\n";
}
//socket_close($sock);
echo 'Listen socket ... ';
if (($ret = socket_listen($sock, $maxUsers))!= TRUE) {
    throw new Exception('socket_listen() failed: '.socket_strerror(socket_last_error())."\n");
} else {
    echo "OK\n";
}
while(true){
    unset($read);
    $read[0] = $sock;
      
    for ( $i = 0; $i < $maxUsers; $i++ ){
        if ( isset($users[$i] ) ){
            $read[$i+1] = $users[$i]['sock'];
        }
    }
    
    $ready = socket_select( $read, $write = NULL, $except = NULL, $tv_sec = 1 );
    if ($ready > 0){
        if ( in_array( $sock, $read ) ){
            for ( $i = 0; $i < $maxUsers; $i++ ){
                if (!isset($users[$i])){
                    $users[$i]['sock'] = socket_accept( $sock );
                    $output = "STB SERVER:\r\n".chr(0);
                    SocketWrite($i, $output);
                    break;
                }
            }
            if ( --$ready <= 0){
                continue;
            }
        }
        for ( $i = 0; $i < $maxUsers; $i++){
            if ( isset($users[$i]['sock']) ){
                if (in_array($users[$i]['sock'], $read )){
                    $input = SocketRead($i);
                    getCmd( $input, $i );
                }
                else {
                    //socket_close($users[$i]['sock']);
                    //unset($users[$i]);
                }
            }
        }
    }
}
socket_close($sock);

function SocketWrite($uIndex, $output){
    global $users;

    if (false === @socket_write($users[$uIndex]['sock'], $output."\r\n".chr(0)) ){
        unset($users[$uIndex]);
    };
}

function SocketRead($uIndex){
    global $users;
    
    $input = socket_read( $users[$uIndex]['sock'], BUF );
    if ( $input === false ){
        unset($users[$uIndex]);
        return false;
    } else {
        return $input;
    }
}

function getCmd( $cmd, $uIndex ){
    global $sock, $users, $read, $NPVR;
    $output = "incorrect data\n";
    $n = trim( $cmd );
    $tArr = explode(" ", $n);
    $size = sizeof($tArr);
    $cmd =  strtolower( $tArr[0] );
    if (isset($tArr[1])){
        for($i = 1; $i < $size; $i++){
            $param[] = $tArr[$i];
        }
    }
    switch( $cmd ){
        case "npvr_recorded":
            if ( isset($param) ){
                $obj = json_decode( trim($param[0]) );
                if ( is_object($obj) ){
                    echo "file ready to watch: ".$obj->fileName."\n";
                    $DATABASE = new db();
                    $DATABASE->sqlq("   UPDATE `NPVR_records` SET `status` = '".$obj->status."', `fileName` = '".$obj->fileName."' 
                                        WHERE `programID`='".$obj->programID."' AND `status` >= -1");
                    if ( $obj->status == 1){
	                    $DATABASE->sqlq("	INSERT INTO `NPVR_process` (`id`,`PID`,`RecordID`,`StartTime`)
											VALUES (NULL, '".$obj->pid."', '".$obj->programID."',CURRENT_TIMESTAMP)");
					}
                }
                else{
                    echo "error. No object incoming.";
                }
            }
        break;
        case 'exit':
            socket_close($users[$uIndex]['sock']);
            unset($users[$uIndex]);
        break;
        default:
            SocketWrite($uIndex, "");
        break;
    }
}

?>