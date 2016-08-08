<?php

/**
 * @author Vladimir
 * @copyright 2010
 */

class html{
    
    public $script = array();
    public $css = array();
    
    public function __construct(){

    }
        
    public function Top(){
        echo '
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
    <head>
            <meta http-equiv="content-type" content="text/html; charset=UTF-8" />';
    foreach($this->script as $key){
        echo '
            <script type="text/javascript" src="./js/'.$key.'"></script>';
    }
    foreach($this->css as $key){
        echo '
            <style type="text/css" src="./css/'.$key.'"></style>';
    }
           
    echo'
    </head>
    <body>';        
    }
    
    public function Render( $page ){
        $this->Top();
        require_once(TPL_DIR.$page.".php");        
        
        require_once(LIB_DIR."header.cl.php");
        
        $headerO = new header;
        $headerO->content = $header['content'];
        $headerO->title = $header['title'];
        $headerO->Logo( $header['logo'] );
        echo "<div class = \"body_container\">";
        $headerO->Render();
        echo "</div>";
    }
    
    public function __destruct(){
        echo '
    </body>
</html>';
    }
}

?>