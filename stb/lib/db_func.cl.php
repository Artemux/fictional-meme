<?php

/**
 * @author Vladimir
 * @copyright 2010
 */

class db_func{  
    public $tableName, $columns;
    public $valid = array();
    protected $DB;
    
    public function __construct(&$db){
        $this->DB = $db;
        $this->DB->sqlq("show columns from $this->tableName")->toArray($columns);
        foreach( $columns as $key => $val ){
            $this->{$val['Field']} = "";
            $this->columns[$val['Field']]="";
        }
    }
    
    public function getTableStructure(){
        return $this->columns;
    }
    
    public function getById($id){
        $this->DB->sqlq("SELECT * FROM `$this->tableName` WHERE `id`='".$id."' LIMIT 1")->toArray($arr);
        if (isset($arr)){
            foreach( $arr[0] as $key=>$val){
                $element[$key] = $val;
                $this->{$key} = $val;
            } 
            return $this; 
        }
    }
    
    public function setName($val){
        $this->name = $val;
    }
    
    public function setValue($val){
        $this->value = $val;
    }
    
    public function Insert(){
        foreach($this->valid as $key=>$val){
            if ($this->{$val} == ""){
                print($val." not set. You must set this variable.");
                return false;
            }
        }
        $vars = $this->getTableVars();
        $this->DB->sqlq("INSERT INTO `$this->tableName` ({$vars['table_col_list']}) VALUES ({$vars['var_list']});");
    }
    
    public function Update(){
        if (is_numeric($this->id)){
            $vars = $this->getTableVars();
            $this->DB->sqlq("	UPDATE `$this->tableName` SET {$vars['col_var_list']} 
                            	WHERE `$this->tableName`.`id` ='".$this->id."';");
        }
    }
    
    public function Delete(){
		if (is_numeric($this->id)){
            $this->DB->sqlq("	DELETE FROM `$this->tableName` WHERE `$this->tableName`.`id` ='".$this->id."';");
        }
    }
    
    private function getTableVars(){
        foreach($this->columns as $col => $val){
            $table_col[] = "`".$col."`";
            $var[] = "'".$this->{$col}."'";
            $col_var[] = "`".$col."`"."="."'".$this->{$col}."'";
        }
        return array(   "table_col_list"=>implode(" ,",$table_col),
                        "var_list"      =>implode(" ,", $var),
                        "col_var_list"  =>implode(" ,",$col_var));
    }
}

?>