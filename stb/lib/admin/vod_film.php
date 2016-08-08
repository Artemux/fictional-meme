<?php

/**
 * @author Vladimir
 * @copyright 2010
 */
require_once("../db_func.cl.php");
class vod_film extends db_func{
    
    public $tableName = "VOD_FilmBase";
    public $valid = array("filename","name","image");
    
    public function __construct(&$db){
        parent::__construct($db);
    }
    
    private function GetTimeFromSec($t_sec){
        if ( is_numeric($t_sec) ){
            $H = floor($t_sec/3600);
            $M = floor(($t_sec-($H*60*60))/60 );
            $S = $t_sec - $H*60*60 - $M*60;
            if ($H < 10) $H = "0".$H;
            if ($M < 10) $M = "0".$M;
            if ($S < 10) $S = "0".$S;
            return $H.":".$M.":".$S;
        }
    }
}

?>