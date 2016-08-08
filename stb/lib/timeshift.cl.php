<?php

/**
 * @author Vladimir
 * @copyright 2010
 */

class timeshift{
    public $chanID;
    public $chanName;
    public $chanPeer;
    public $db_fileName;
    public $fileName;
    public $procPID;
    public $date;
    
    public function __construct( $chanID = "0", $chanName = "not set", $chanPeer = "224.5.5.0" ){
        //$this->GetChannelInfo( $chanID );
        $this->chanID = $chanID;
        $this->chanName = $chanName;
        $this->chanPeer = $chanPeer;
        $this->chanPort = "1234";
        
        $this->fileDir = "/vod/";
        $this->date = date("Y-m-d H:i:s");
        $this->SetFileName();   
    }
    
    private function GetChannelInfo( $chanID ){
        $this->chanID = $chanID;
        $this->chanName = "Mezzo";
        $this->chanUDP = "224.5.5.19";
        $this->chanPort = "1234";
    }
    
    public function SetFileName(){
        $this->db_fileName = $this->chanID."_".str_replace(" ", "_", $this->date);
        $this->fileName = $this->db_fileName.".ts";
    }
        
    public function StartRecord( $serverIP ){
        // запуск программы для записи потока в файл
        // входной параметр адресс сервера записи
        // выходный параметры:
        // 1 - старт записи прошел успешно
        // 0 - нет связи с удаленным сервером
        // -1 - программа записи не запустилась
     
        include_once(LIB_DIR."socketClient.cl.php");
        
        try {
            $sc = new ClientSocket();
            $sc->open( $serverIP , SOCKET_PORT);
            $get = $sc->recv();
            $sc->send("record ".$this->chanPeer."\r\n");
            $obj = $sc->recv();
            $sc->send("exit \r\n");
            return (json_decode(trim($obj)));
        } catch (Exception $e){
            echo $e->getMessage();
        }

    }
    
    public function GetRecord( $serverIP, $fileName){
         return 1;
//        require_once(LIB_DIR."ssh.cl.php");
//        $cur = $this->fileDir.$fileName.".ts";
//        $tmp = $cur.".tmp";
//        $ssh = new SSH( $serverIP );
//        if ( $ssh->cmd("touch ".$tmp, $out) ){
//            if ( $ssh->cmd("mv ".$tmp." ".$cur, $out)){
//                return 1;
//            }
//            else return -1;
//        }
//        else return 0;
    }
    
    public function StopRecord( $serverIP, $procPID){
        require_once(LIB_DIR."socketClient.cl.php");
        
        try {
            $sc = new ClientSocket();
            $sc->open( $serverIP , SOCKET_PORT);
            $get = $sc->recv();
            $sc->send("stop ".$procPID."\r\n");
            $get = $sc->recv();
            $sc->send("exit \r\n");
            return (trim($get));
        } catch (Exception $e){
            echo $e->getMessage();
        }
    }
}

?>