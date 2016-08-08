<?php

/**
 * @author Vladimir
 * @copyright 2010
 */

class query{
    private $rc;
    private $db;
    public $row = array();
    
    public function __construct($rc, &$db){
        $this->rc = $rc;
        $this->db = &$db;
    }
    public function __destruct(){
        unset($this->rc);
        unset($this->db);
        unset($this->row);
    }
    public function num_rows(){
        return mysql_num_rows($this->rc);
    }
    public function fetch(){
        return $this->row = mysql_fetch_assoc($this->rc);
    }
    public function toArray( &$rows = array() ){
        while ( $this->fetch() ){
            $rows[] = $this->row;
        }
        return $rows;
    }
    public function toArrayEx( &$rows = array(), $key = "id" ){
        while ( $this->fetch() ){
            $rows[$this->row[$key]] = $this->row;
        }
        return $rows;
    }
    
}

?>