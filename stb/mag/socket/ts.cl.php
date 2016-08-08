<?php

/**
 * @author Vladimir
 * @copyright 2010
 */

class timeshift{
    public $chanID;
    public $chanName;
    public $chanUDP;
    public $db_fileName;
    public $fileName;
    public $ts_dir;
    public $procPID;
    public $date;
    public $chanPort;
    
    public function __construct( $ts_dir = "/vod/" ){
        //$this->GetChannelInfo( $chanID );
        $this->chanPort = "1234";
        
        $this->ts_dir = $ts_dir;   
    }
    
    private function GetChannelInfo( $chanID ){
        $this->chanID = $chanID;
        $this->chanName = "Mezzo";
        $this->chanUDP = "224.5.5.19";
        $this->chanPort = "1234";
    }
    
    public function SetFileName(){
        $this->date = date("Y-m-d H:i:s");
        $this->db_fileName = $this->chanUDP."_".str_replace(" ", "_", $this->date);
        $this->fileName = $this->db_fileName.".ts";
    }
        
    public function StartRecord( $chanUDP = "" ){
        // запуск программы для записи потока в файл
        // входной параметр адресс канала для записи
        // выходный параметры:
        // 1 - старт записи прошел успешно
        // 0 - нет связи с удаленным сервером
        // -1 - программа записи не запустилась
        // -2 - отсутствует UDP адресс канала

        if ( $chanUDP == "" ){
            return -2;
        }
        $this->chanUDP = $chanUDP;
        $this->SetFileName();
        $cmd = $this->ts_dir."vlc_run_script.sh ".$this->chanUDP." ".$this->chanPort." ".$this->ts_dir.$this->fileName.";";
        $cmd .= "ps -C vlc | awk 'END{print $1}'";
        if ( exec( $cmd, $out) ){
            return '{"pid":"'.$out[0].'","fileName":"'.$this->db_fileName.'","datetime":"'.$this->date.'"}';
        }
        else return -1;

    }
    
    public function GetRecord( $serverIP, $fileName){
         return 1;
    }
    
    public function StopRecord( $procPID ){
        $proc = $this->ProcList("pids", $procPID);
        if ( $proc[0] == 'vlc'){
            exec("kill ".$procPID, $out);
            return "process $procPID killed";
        } else {
            return -1; // no such process on server;
        }
    }
    
    public function DeleteRecord( $fileName ){
        exec("rm ".VOD_DIR.$fileName.".ts", $out);
        exec("rm ".VOD_DIR.$fileName.".tsx", $out);
    }
    
    public function Indexer( $fileName ){
        $cmd = $this->ts_dir."indexer ".$this->ts_dir.$fileName.".ts";
        exec($cmd, $out);
        print_r($out);
    }
    
    public function ProcList($val = "pids", $pid = ""){
        if ( $val == "pids" ){
            exec("ps -p $pid | awk 'END{print $4}'", $procList);
        } else if ( $val == "all" ){
            exec("ps -C vlc", $procList);
        }
        return $procList;
    }
}

?>