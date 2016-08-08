<?php

/**
 * @author Vladimir
 * @copyright 2010
 */

class dao{
    public function __construct(){
        
    }
    public function Object($name, &$db){
        return new $name($db);
    }
}

?>