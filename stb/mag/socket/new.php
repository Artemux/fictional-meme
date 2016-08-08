<?php
error_reporting (E_ALL);

/* Разрешить скрипту зависнуть в ожидании соединений. */
set_time_limit (0);

/* Включить неявную очистку вывода, и мы увидим всё получаемое
* по мере поступления. */
ob_implicit_flush ();
$timeout = 1;
$address = "172.17.24.14";
$port = 4321;
///*

if (($sock = socket_create (AF_INET, SOCK_STREAM, 0)) < 0) {
echo "socket_create() failed: reason: " . socket_strerror ($sock) . "\n";
}

if (($ret = socket_bind ($sock, $address, $port)) < 0) {
echo "socket_bind() failed: reason: " . socket_strerror ($ret) . "\n";
}

if (($ret = socket_listen ($sock, 5)) < 0) {
echo "socket_listen() failed: reason: " . socket_strerror ($ret) . "\n";
}
$num = -1;
$current_conn = 0;
$connections = array();

socket_set_nonblock($sock);
$read[] = $sock;
$listen = true;

while ($listen){
    if ( ($new_connection = @socket_accept($sock)) != 0) {
        $num = socket_select( $read, $write = NULL, $exceptions = NULL, $timeout);
        echo("changed sockets number = {$num}\r\n");
    }
    
    if ($num > 0){
        echo("Changed sockets for reading ".count($read)."\r\n");
    
        foreach ($connections as $key=>$s){
            //$key = array_search($s, $connections);
            $can_write = array_search($s, $write);
            $can_read = array_search($s, $read);
            
            if ($can_read !== FALSE) $can_read = true;
            if ($can_write !== FALSE) $can_write = true;
            
            if ($can_write && $s === $new_connection){
            $msg = "\nWelcome to the PHP Test Server. \nTo quit, type \"quit\". To shut down the server type \"shutdown\".\n";
            socket_write($s, $msg, strlen($msg));
            }
            
            echo("Try read from socket {$key}\r\n");
            
            if ($can_read && FALSE === ($buf = socket_read ($s, 2048)))
            {
            socket_close ($connections[$key]);
            unset($connections[$key]);
            
            echo("Unable read from socket {$key} close conection! \r\n");
            continue;
            }
            
            if ($can_read)
            {
            $buf = trim($buf);
            echo("read \"{$buf}\" from socket {$key}\r\n");
            }
            else $buf = '';
            
            if (empty($buf))
            {
            continue;
            }
            
            if ($buf == "q")
            {
            if ($can_write)
            socket_write ($s, "You exit now!", strlen ($talkback));
            
            socket_close ($connections[$key]);
            unset($connections[$key]);
            continue;
            }
            
            if ($buf == "s" || count($connections) > 10)
            {
            $listen = false;
            break;
            }
            
            $talkback = "PHP: You said \"$buf\".\n";
            
            if ($can_write)
            socket_write ($s, $talkback, strlen ($talkback));
            
            echo "$buf\n";
        }
    }
}

reset($connections);

foreach ($connections as $key=>$msgsock)
{
$msg = "PHP: Server shuting down!\n";
socket_write ($msgsock, $msg, strlen($talkback));
socket_close ($connections[$key]);
//unset($connections[$key]);
}

socket_close ($sock);
//*/
exit();

?>