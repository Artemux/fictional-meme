<?php

/**
 * @author Vladimir
 * @copyright 2010
 * 
 * Mysql library
 * 
 */

class db{
            public $row;
            
            private $DBuser;
            private $DBpassword;
            private $DBname;
            private $DBserver;
            private $DBlink;
            
    public function __construct($db = ""){
            $this->DBuser = "stb_admin";
            $this->DBpassword = "mtRXjx5SnL9BCcqh";
            if ($db == "") $this->DBname = "stb_admin";
            else $this->DBname = $db;
            $this->DBserver = "localhost";
    }
    
    public function __destruct(){
            @mysql_close($this->DBlink);
    }
    
    public function db( $dbName ){
        
    }
    public function SetDBUser( $var ){
        $this->DBuser = $var;
    }
    public function SetDBPassword( $var ){
        $this->DBpassword = $var;
    }
    public function SetDBName( $var ){
        $this->DBname = $var;
    }
    public function SetDBServer( $var ){
        $this->DBserver = $var;
    }
    public function sqlq( $queryz, &$result = "" ){
            unset($this->DBresult);
            if( $this->DBlink ){
                $result = mysql_query( $queryz );	
            } 
            else{
            	$this->DBlink = mysql_connect($this->DBserver,$this->DBuser,$this->DBpassword);
            	mysql_select_db( "$this->DBname", $this->DBlink ) || die("Couldn't open db: $db. Error if any was: ".mysql_error() );
                mysql_query("SET NAMES 'utf8';",$this->DBlink);
                mysql_query("SET CHARACTER SET 'utf8';",$this->DBlink);
                mysql_query("SET SESSION collation_connection = 'utf8_general_ci';",$this->DBlink);
            	$result = mysql_query( $queryz, $this->DBlink ) or die("MySQL query $query failed.  Error if any: ".mysql_error());
            }
            require_once(LIB_DIR."query.cl.php");
            return new query($result, $this->DBname);
    }
}

?>