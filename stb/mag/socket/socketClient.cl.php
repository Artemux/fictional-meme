<?php
/******************************************************************************************************
	LICENSE

	Copyright (C) 2006 Juan M. Hidalgo

    This program is free software; you can redistribute it and/or modify it under the terms of the
    GNU General Public License as published by the Free Software Foundation; either version 2 of the License,
    or (at your option) any later version.

    This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
    without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
    See the GNU General Public License for more details.

    You should have received a copy of the GNU General
    Public License along with this program; if not,
    write to the Free Software Foundation, Inc., 59 Temple Place, Suite 330,
    Boston, MA 02111-1307 USA
****************************************************************************************************/

/**
 * Client Socket
 *
 * Simple socket class to connect with external sockets.
 *
 * @author Juan M. Hidalgo (juan@sentidocomunsite.com.ar
 * @name ClientSocket
 * @version 0.1
 *
 */

class ClientSocket{
	/**
	 * Socket Handle
	 * @var Socket
	 */
	private $hnd;

	/**
	 * List of Hosts
	 * @var Array of String
	 */
	private $host;

	/**
	 * List of ip to connect, if one fails try with others
	 * @var array of string
	 */
	private $ip;

	/**
	 * Port
	 * @var int
	 */
	private $port;

	/**
	 * Socket type.  (SOCK_DGRAM | SOCK_RAW |	SOCK_RDM | SOCK_SEQPACKET | SOCK_STREAM)
	 * @var int
	 */
	private $type;

	/**
	 * Socket Family (AF_INET|AF_INET6|AF_UNIX)
	 * @var int
	 */
	private $family;

	/**
	 * Socket protocol (SOL_SOCKET | SOL_TCP | SOL_UDP)
	 * @var int
	 */
	private $protocol;

	/**
	 * Socket connection state
	 * @var bool
	 */
	private $bConnected;

	/**
	 * Socket buffer
	 * @var string
	 */
	private $sBuffer;

	/**
	 * Read TimeOut (seconds)
	 * @var int
	 */
	private $iReadTimeOut = 1;

	/**
	 * Write TimeOut (seconds)
	 * @var int
	 */
	private $iWriteTimeOut = 1;


	/**
	 * Determines if error must be shown
	 * @var bool
	 */
	public $bShowErros	= false;

	/**
	 * Determines if Exception must be thrown
	 * @var bool
	 */
	public $bExceptions = true;

	/**
	 * Show errors if $bShowErrors is enabled
	 * If $bExceptions, throws an exception, otherwise prints a message.
	 * If $msg is not empty, show $msg;
	 *
	 * @param string $msg
	 */
	public function error($msg=null){
		if(!$this->bShowErros && !$this->bExceptions) return;

		$errCode = socket_last_error($this->hnd);
		if($errCode!=0){
			//Connection reset by peer
			if($errCode==104)
				$this->bConnected = false;

			$errMsg = socket_strerror($errCode);
			if($this->bExceptions){
				throw new Exception("Socket error. Code: $errCode - Message: $errMsg\n");
				}
			else{
				trigger_error("Socket Error. Code: $errCode - Message: $errMsg");
			}
			socket_clear_error($this->hnd);
		}elseif (strlen($msg)){
			if($this->bExceptions){
				throw new Exception("Socket error." . $msg);
			}
			else{
				trigger_error("$msg\n",E_USER_ERROR);
			}
		}
	}



	/**
	 * Constructor
	 *
	 * @param int $family (AF_INET|AF_INET6|AF_UNIX)
	 * @param int $type (SOCK_DGRAM | SOCK_RAW |	SOCK_RDM | SOCK_SEQPACKET | SOCK_STREAM)
	 * @param int $protocol (SOL_SOCKET | SOL_TCP | SOL_UDP)
	 */
	public function __construct($family=AF_INET,$type=SOCK_STREAM ,$protocol=SOL_TCP){
		$this->hnd 		= @socket_create($family,$type,$protocol);
		$this->error();

		$this->family 	= $family;
		$this->typ 		= $type;
		$this->protocol	= $protocol;

		$this->sBuffer 	= false;
		$this->port		= null;
		$this->ip		= null;
		$this->host		= null;
	}

	/**
	 * Sets a host and tries to resolve IP address. If Ip is valid adds it to List of ip
	 * @param string $sHost
	 */
	public function setHost($sHost){
		if(!strlen($sHost)) return;

		$this->host[]	= $sHost;
		$ip				= @gethostbyname($sHost);
		if($ip){
			$this->ip[]	= $ip;
		}else{
			$this->error("Hostname $sHost could not be resolved");
		}
	}

	/**
	 * Sets Ip addres
	 * @param string $sIp (xxx.xxx.xxx.xxx)
	 */
	public function setIp($sIp){
		if(!strlen($sIp)) return;

		if(!ip2long($sIp)){
			$this->error("Invalid IP ADDRESS. IP $sIp");
		}

		$this->ip[]		= $sIp;
		$this->host[]	= @gethostbyaddr($sIp);
	}

	/**
	 * Set Host port
	 * @param int $iPort
	 */
	public function setPort($iPort){
		$this->port 	= $iPort;
	}

	/**
	 * Open socket connection
	 *
	 * @param string[optional] $sHost
	 * @param int[optional] $iPort
	 */
	public function open($sHost=null,$iPort=null){
		if(strlen($sHost)){
			$this->setHost($sHost);
		}
		if(strlen($iPort)){
			$this->setPort($iPort);
		}
		$i = 0;
		do{
			if(@socket_connect($this->hnd,$this->ip[$i],$this->port)){
				$this->bConnected 	= true;
			}
		}
		while (!$this->bConnected && $i++<count($this->ip));

		if(!$this->bConnected)
			$this->error();
	}

	/**
	 * Connect with  host (open alias)
	 *
	 * @param string[optional] $sHost
	 * @param int[optional] $iPort
	 */
	public function connect($sHost=null,$iPort=null){
		return $this->open($sHost,$iPort);
	}

	/**
	 * Close socket connection
	 *
	 */
	public function close(){
		if(!$this->bConnected) return;
		@socket_shutdown($this->hnd,2);
		@socket_close($this->hnd);
	}

	/**
	 * Close socket connection (close alias)
	 *
	 * @return void
	 */
	public function disconnect(){
		return $this->close();
	}

	/**
	 * Send data
	 * If $sBuf is not empty try to send $sBuf, else try with $this->sBuffer
	 *
	 * @param string $sBuf
	 * @param int $iTimeOut
	 */
	public function send($sBuf,$iTimeOut=null){
		if(!strlen($this->sBuffer) && !strlen($sBuf)) return;
		if(!$this->bConnected){
			$this->error("Socket error. Cannot send data on a closed socket.");
			return;
		}

		$vWrite = array($this->hnd);

		$WriteTimeOut = strlen($iTimeOut) ? $iTimeOut : $this->iWriteTimeOut;
		while(($rr = @socket_select($vRead = null,$vWrite ,$vExcept = null,$WriteTimeOut))===FALSE);

		if($rr==0) return;

		$tmpBuf		= strlen($sBuf) ? $sBuf : $this->sBuffer;
		$iBufLen	= strlen($tmpBuf);
		$res 		= @socket_send($this->hnd,$tmpBuf,$iBufLen,0);

		if($res === FALSE){
			$this->error();
		}elseif ($res < $iBufLen){
			$tmpBuf 	= substr($tmpBuf,$res);
			$this->send($tmpBuf);
		}
	}

	/**
	 * Send alias
	 *
	 * @param string $sBuf
	 * @param int $iTimeOut
	 */
	public function write($sBuf,$iTimeOut=null){
		return $this->send($sBuf,$iTimeOut);
	}

	/**
	 * Read data from socket
	 *
	 * @param int $iTimeOut
	 * @return string
	 */
	public function recv($iTimeOut=null){

		if(!$this->bConnected){
			$this->error("Socket error. Cannot read any data on a closed socket.");
			return;
		}

		$vSocket		= array($this->hnd);
		$this->sBuffer 	= null;
		$buf			= null;
		$iBufLen		= 4096;
		$ReadTimeOut	= strlen($iTimeOut) ? $iTimeOut : $this->iReadTimeOut;
		try {
			while(($rr = @socket_select($vSocket,$vWrite = null,$vExcept = null,$ReadTimeOut))===FALSE);

			if($rr==0) return;

			$res			= @socket_recv($this->hnd,$buf,$iBufLen,0);
			while($res){
				$this->sBuffer 	.=	$buf;
				$buf			 = null;

				while(($rr = @socket_select($vSocket,$vWrite = null,$vExcept = null,$ReadTimeOut))===FALSE);
				if($rr==0) break;

				$res			 = @socket_recv($this->hnd,$buf,$iBufLen,0);
			}
		}catch (Exception $e){
			$this->error();
		}

		return $this->sBuffer;
	}

	/**
	 * Recv alias
	 *
	 * @param int $iTimeOut
	 * @return string
	 */
	public function read($iTimeOut=null){
		return $this->recv($iTimeOut);
	}

	/**
	 * Send data and wait response
	 *
	 * @param string $sBuf
	 * @return string
	 */
	public function sendandrecive($sBuf){
		$this->send($sBuf);
		return $this->recv();
	}
}


?>