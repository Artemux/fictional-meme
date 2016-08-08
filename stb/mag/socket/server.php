<?php

/**
 * @author Vladimir
 * @copyright 2010
 */
DEFINE ("DEBUG", "true");
DEFINE ("BUF", 1024);
DEFINE ("VOD_DIR", "/vod/");
DEFINE ("STB_HOST", "172.17.24.14");
DEFINE ("STB_HOST_PORT", "4320");
require_once("./ts.cl.php");

$sAddr = "172.17.24.14";//$_SERVER['SERVER_ADDR'];
$sPort = 4321;
$maxUsers = 10;
$users = array();
$read = array();

if (file_exists("npvr.cache")){
    $NPVR = unserialize( file_get_contents( "npvr.cache" ) );
    echo "loading data from npvr.cache\n Check for process ...";
    unset($TS);
    $TS = new timeshift(VOD_DIR);
    foreach($NPVR as $key=>$val){
        if ($val['status'] == 1){
            $get = $TS->ProcList("pids", $val['pid']);
            if ( $get[0] == 'vlc' ){
                echo "\n [{$key}] - process running\n";
            } else {
                echo "\r [{$key}] - no process. Deleting old File...";
                $TS->DeleteRecord($val['fileName']);
                echo "DONE. Make new process...";
                $json = json_decode( $TS->StartRecord($val['udp']) );
                $NPVR[$key]['pid'] = $json->pid;
                $NPVR[$key]['fileName'] = $json->fileName;
                $NPVR[$key]['status'] = 1;
                SendStatusOfJob( json_encode($NPVR[$key]) );
                MakeCache($NPVR);
                echo "DONE\n";
            }
        }
    }
    
} else {
    $NPVR = array();
    echo "no cache data for NPVR\n";
}

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
if (($ret = socket_bind($sock, $sAddr, $sPort)) != TRUE) {
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
    CheckNPVR();
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
                    $output = "TIMESHIFT & NPVR SERVER:\r\n".chr(0);
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
    
    $input = @socket_read( $users[$uIndex]['sock'], BUF );
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
        case 'vlc':
            if ( $size == 2 ){
                $output = "your id is ".$uIndex." - sock id(".$sock.")\n".chr(0);//preg_replace("/[ \t\n\r]/","",$input).chr(0);
                
            }
            else {
                $output = "no supported parametr for $cmd";
            }
            SocketWrite($uIndex, $output);
        break;
        
        case 'df':
            if ( $size == 2){
                exec("df -ah ".$param[0],$out);
                SocketWrite($uIndex, $out[1]);
            }
            else {
                echo "no supported parametr for $cmd";
            }
        break;
        
        case 'record':
            if ( $size == 2){
                // Timeshift record
                if ( CheckData("udp", $param[0]) == 1 ){
                    unset($TS);
                    $TS = new timeshift(VOD_DIR);
                    $output = $TS->StartRecord($param[0]);
                }
            } else if ( $size == 5){
                // NVPR record
                if (    CheckData("udp", $param[1]) == 1 && 
                        CheckData("unixtimestamp", $param[2]) == 1 && 
                        CheckData("unixtimestamp", $param[3]) == 1 &&
                        CheckData("digits", $param[0])){
                    if ( !isset( $NPVR[$param[0]] ) ){       
                        $NPVR[$param[0]]['programID'] = $param[0];        
                        $NPVR[$param[0]]['udp'] = $param[1];
                        $NPVR[$param[0]]['startTime'] = $param[2];
                        $NPVR[$param[0]]['stopTime'] = $param[3];
                        $NPVR[$param[0]]['pid'] = "";
                        $NPVR[$param[0]]['fileName'] = "";
                        $NPVR[$param[0]]['status'] = "0";
                        MakeCache($NPVR);
                        $output = "your want record ".$param[0]." at time ".$param[1]." to time ".$param[2];
                    } else {
                        SendStatusOfJob( json_encode($NPVR[$param[0]]) ); 
                    }
                } 
            } else {
                 $output = "\r\nno supported parametr for $cmd".chr(0)."\r\nTS:".chr(0)."\r\n\trecord multicast_ip_address".chr(0).
                            "\r\nNVPR:".chr(0)."\r\n\trecord multicast_ip_address unixtimestamp_start_time unixtimestamp_stop_time\r\n".chr(0);  
            }
            SocketWrite($uIndex, $output);
        break;
        
        case 'stop':
            if ( CheckData("digits", $param[0]) == 1 ){
                unset($TS);
                $TS = new timeshift(VOD_DIR);
                $output = $TS->StopRecord($param[0]);
            } else {
                $output = "incorrect parametr";
            }
            SocketWrite($uIndex, $output);
        break;
        case 'delete':
            if ( $param[0] != "" ){
                unset($TS);
                $TS = new timeshift("/vod/");
                $output = $TS->DeleteRecord($param[0]);
            } else {
                $output = "incorrect parametr";
            }
            SocketWrite($uIndex, $output);
        break;
        case 'process':
            unset($TS);
            $TS = new timeshift(VOD_DIR);
            foreach($NPVR as $key=>$val){
                if ($val['status'] == 1){
                    $get = $TS->ProcList("pids", $val['pid']);
                    if ( $get[0] == 'vlc' ){
                        $output = "\r [{$key}] - process running";
                    } else {
                        $output = "\r [{$key}] - no process.\r Deleting old File...";
                        $TS->DeleteRecord($val['fileName']);
                        $output .= "DONE. \r  Make new process...";
                        $json = json_decode( $TS->StartRecord($val['udp']) );
                        $NPVR[$key]['pid'] = $json->pid;
                        $NPVR[$key]['fileName'] = $json->fileName;
                        $NPVR[$key]['status'] = 1;
                        SendStatusOfJob( json_encode($NPVR[$key]) );
                        MakeCache($NPVR);
                        $output .= "DONE";
                    }
                    SocketWrite($uIndex, $output);
                }
            }
        break;
        case 'npvr':
            if ( isset($param) ){
                switch( $param[0] ){
                    case 'status':
                        $output = "\r NPVR status:";
                        SocketWrite($uIndex, $output);
                        foreach( $NPVR as $key => $val ){
                            if ($val['status'] == -1 ){ 
                                $status = "saved";
                            } 
                            if ($val['status'] == 0 ){ 
                                $status = "awating for record.";
                            } 
                            if ( $val['status'] == 1 ){
                                $status = "recording...";
                            }
                            
                            if ( isset( $status) && $status != "" ){
                                $output = "\r [{$key}] - ".$val['udp']." $status ".date("Y-m-d H:i:s",$val['startTime'])."-".date("Y-m-d H:i:s",$val['stopTime']);
                            } else {
                                $output = "there is no any job yet";
                            }
                            SocketWrite($uIndex, $output);
                        }          
                    break;
                    case 'stop':
                        if ( isset($param[1]) ){
                            if ( CheckData("digits", $param[1]) ){
                                unset($TS);
                                $TS = new timeshift(VOD_DIR);
                                $TS->StopRecord($NPVR[$param[1]]['pid']);
                                $TS->DeleteRecord($NPVR[$param[1]]['fileName']);
                                unset($NPVR[$param[1]]);
                                MakeCache( $NPVR );
                                $output = "job with ID {$param[1]} deleted.";
                            } else{
                                $output = "enter job ID";   
                            }   
                        } else {
                            $output = "enter job ID"; 
                        }
                        SocketWrite($uIndex, $output);
                        break;
                    default:
                    break;
                }
            } else {
                $output = "next expression is:\r\n\t status - current NPVR jobs with their status\r\n\t stop - delete job from list by it`s ID\n";
                SocketWrite($uIndex, $output);
            }
        break;

        case 'exit':
            socket_close($users[$uIndex]['sock']);
            unset($users[$uIndex]);
            unset($read[$uIndex+1]);
        break;
        
        case 'shutdown':
            $output = "PHP: Server shuting down in 5 seconds!";
            for ( $i = 0; $i < sizeof($users); $i++ ){
                SocketWrite($i, $output);
            }
            sleep(5);
            for ( $i = 0; $i < sizeof($users); $i++ ){
                socket_close($users[$i]['sock']);
            }
            echo "TS&NPVR SERVER SHUTTING DOWN\r\n";
            sleep(5);
            socket_close($sock);
            exit;
        break;
        
        default:
            $output = " \t\nServer Commands:\r 
    record MCAST_UDP - record channel from mcast_address\r
    record MCAST_UDP (unixtime)START (unixtime)STOP - record chan from mcast_address between time range\r
    stop PID - stop record by process pid\r
    process - list of running processes\r
    df DIR - return a size of DIR\r
    npvr - NPVR control center\n";
            SocketWrite($uIndex, $output);
        break;
    }
}

function CheckData( $type, $val ){
    switch( $type ){
        case 'digits':
            if ( preg_match("/^\d+?$/", $val) ){
                return 1;
            } else {
                return 0;
            }
        break;
        case 'udp':
            if ( preg_match("/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/", $val) ){
                return 1;
            } else {
                return 0;
            }
        break;
        case 'unixtimestamp':
            if ( preg_match("/^\d{10}$/", $val) ){
                return 1;
            } else {
                return 0;
            }
        break;
        default:
            return 0;
        break;
    }
}

function CheckNPVR(){
    // NPVR status:
    // 0 - ждет записи
    // 1 - идет запись
    // -1 - запись окончена
    global $NPVR;
    if ( sizeof($NPVR) > 0){
        foreach( $NPVR as $key => $val){
            $utime = time();
            if ( $utime >= $val['startTime'] && $utime < $val['stopTime'] && $val['status'] == 0 ){
                // запуск программы записи в нужное время
                unset($TS);
                $TS = new timeshift(VOD_DIR);
                $output = json_decode( $TS->StartRecord($val['udp']) );
                $NPVR[$key]['pid'] = $output->pid;
                $NPVR[$key]['fileName'] = $output->fileName;
                $NPVR[$key]['status'] = 1;
                SendStatusOfJob( json_encode($NPVR[$key]) );
                MakeCache($NPVR);
            }
            
            if ( $utime >= $val['stopTime'] && $val['status'] == 1 ){
                // остановка записи
                unset($TS);
                $TS = new timeshift(VOD_DIR);
                $output = $TS->StopRecord( $val['pid'] );
                $TS->Indexer( $val['fileName'] );
                $NPVR[$key]['status'] = -1;
                SendStatusOfJob( json_encode($NPVR[$key]) );         
                MakeCache($NPVR);
            }
        }
    }
}

function MakeCache($arr){
    $f = fopen("npvr.cache","w");
    fwrite($f, serialize($arr));
    fclose($f);
}

function SendStatusOfJob( $out ){
    $host = STB_HOST;
    $port = STB_HOST_PORT;
    $fp = fsockopen ($host, $port, $errno, $errstr);
    if (!$fp){
        echo "can`t connect to ".STB_HOST.":".STB_HOST_PORT."\n";
    } else {
        fgets($fp);
        fputs($fp, "npvr_recorded ".$out);
    }

}
?>