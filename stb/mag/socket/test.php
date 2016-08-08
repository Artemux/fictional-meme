<?php

/**
 * @author Vladimir
 * @copyright 2010
 */
DEFINE ("STB_HOST", "172.17.24.14");
DEFINE ("STB_HOST_PORT", "4320");
                    $NPVR[0]['udp'] = "224.5.5.210";
                    $NPVR[0]['startTime'] = "121313131";
                    $NPVR[0]['stopTime'] = "321321321";
                    $NPVR[0]['pid'] = "9542";
                    $NPVR[0]['fileName'] = "224.5.5.210.3423423423";
                    $NPVR[0]['status'] = "1";
    $host = STB_HOST;
    $port = STB_HOST_PORT;
    $fp = fsockopen ($host, $port, $errno, $errstr);
    if (!$fp){
        echo "can`t connect to ".STB_HOST.":".STB_HOST_PORT."\n";
    } else {
        fgets($fp);
        $out = json_encode($NPVR[0]);
        print_r($out);
        fputs($fp, "npvr_recorded ".$out);
    }
    
?>