#!/bin/sh

SOCKET_ROOT="/www/server/script/socket"
SOCKET_PIDFILE="$SOCKET_ROOT/socket.pid"
SOCKET_CONSFILE="$SOCKET_ROOT/.console"
SOCKET_CMD="/usr/local/bin/php $SOCKET_ROOT/stb_server.php"
SOCKET_PID=`cat $SOCKET_PIDFILE`
echo "Start STB-SERVER SOCKET" > $SOCKET_CONSFILE
while (true) do
    SOCKET_CHECK="ps -p $SOCKET_PID"
    RES=`$SOCKET_CHECK | awk 'END{print $4}'`
    if test "$RES" != "php"; then
	echo "Restart STB-SERVER SOCKET" >> $SOCKET_CONSFILE
	$SOCKET_CMD >> $SOCKET_CONSFILE 2>&1 &
	sleep 15
	SOCKET_PID=`cat $SOCKET_PIDFILE`
    fi
    sleep 60
done
