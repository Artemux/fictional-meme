<?php

/**
 * @author Vladimir
 * @copyright 2010
 */
 
require_once("../db_func.cl.php");
class test extends db_func{
    public $tableName = "test";
    public $columns;
    private $DB;
    
    public function __construct(&$db){
        parent::__construct($db);
    }
    
    public function setName($val){
        $this->name = $val;
    }
    
    public function setValue($val){
        $this->value = $val;
    }
}

?>