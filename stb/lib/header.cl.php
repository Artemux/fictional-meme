<?php

/**
 * @author Vladimir
 * @copyright 2010
 */

class header{
    public  $logo,
            $title,
            $content;
    private $width, 
            $height;
    
    public function Render(){
        echo "
        <div class=\"header\">
            <div class=\"logo\">".$this->logo."</div>
            <div class=\"title\">".$this->title."</div>
            <div class=\"content\">".$this->content."</div>
        </div>";
    }
    public function Logo($image){
        $this->logo = "<img src=\"./images/".$image."\"/>";
    }
}

?>