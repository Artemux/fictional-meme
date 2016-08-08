<?php

/**
 * @author Vladimir
 * @copyright 2010
 */

class validator{
    public function valid($var, $reg=""){
        if (isset($var)){
            if ( preg_match("/^$reg$/", $var)) return $var;
            else return false;
        }
        return false;
    }
}

?>