<?php

/**
 * @author Vladimir
 * @copyright 2010
 */

class html{
    public function getTable($inc = array(), $noHead = "false"){ 
        $class = "";
        $html = "<div class=\"table\">";
        foreach( $inc as $key => $val){
            if ($noHead == "false") {
                ( $key == 0 ) ? $class = "rowHead" : $class="row";
            } else {
                $class = "row";
            }
            $html .= "<div class=$class>";            
            for ($i=0; $i<sizeof($val); $i++){
                if ( !is_array($val[$i]) ){
                    $html .= "<div class=\"cell\">$val[$i]</div>";
                } else {
                    ( isset($val[$i]['title']) ) ? $title = "title=\"".$val[$i]['title']."\"" : $title = "";
                    ( isset($val[$i]['onclick']) ) ? $onclick = "onclick=\"".$val[$i]['onclick']."\"" : $onclick = "";
                    $html .= "<div class=\"cell\" $title $onclick>{$val[$i]['text']}</div>\n";
                }
            }
            $html .= "</div>";
        }
        $html .= "</div>";     
        return $html;        
    }
    
    public function getSelect($inc = array(), $name="out", $select = "", $size = 0, $multiple = "false"){
        ($multiple == "true") ? $multiple = "multiple" : $multiple = "";
        ($size > 0) ? $sized = "size=\"$size\"" : $sized = ""; 
        $html = "   <select $sized $multiple name=\"$name\" id=\"$name\">";
        foreach($inc as $key => $val){
           // if (is_numeric($select)){
            //    ( $key == $select ) ? $selected = "selected" : $selected = "";
           // } elseif (is_string($select)){
                ( $val == $select ) ? $selected = "selected" : $selected = "";
           // }
            $html .= "<option $selected value=\"$key\">$val</option>";
        }
        $html .= "  </select>";
        return $html;
    }
    
    public function getBlock($header="not set", $body = "", $footer = ""){
        $html = "   <div class=\"main_block\">
                        <div class=\"top\"><h3>$header</h3></div>
                        <div class=\"middle\">
                            <div class=\"middle_container\">
                                $body
                            </div>
                        </div>
                    </div>";
        return $html;
    }
    public function getUploaderForm(){
        $html = "
            <fieldset>
                <legend> Форма загрузки изображений </legend>
                <br/>
                &nbsp&nbspВыбранное изображение автоматически загрузится на сервер.<br/>
                &nbsp&nbspИзображения должны быть формата .jpg<br/>
                <br/>
                <form action=\"uploader.php\" target=\"upload_iframe\" method=\"post\" enctype=\"multipart/form-data\">
                    <input type=\"hidden\" name=\"fileframe\" value=\"true\">
                    <input type=\"file\" name=\"file\" id=\"file\" onChange=\"jsUpload(this)\">
                </form>
                <br/>
            </fieldset>
            <br/>
            <iframe name=\"upload_iframe\" style=\"width: 400px; height: 100px; display: none;\"></iframe>";
        return $html;
        
    }   
    public function getButton($action="set action", $value = "set value", $text="Button text"){
         return "<div id=\"$value\" name=\"$action\" class=\"button\">$text</div>";
    }
    
    public function getImageButton($action="set action", $value = "set value", $text="Button text", $image_url){
         return "<div id=\"$value\" name=\"$action\" class=\"button\" title=\"$text\"><image src=\"http://172.17.24.14/server/script/admin2/images/$image_url\"/></div>";
    }
    
    public function getLinkToFilmDescription($id, $name){
        return "<div id=\"$id\" class=\"preview\" style=\"float: left\">$name</div>";
    }
    
    public function getLinkToTSRecord($name, $server, $fileName){
        return "<a href=\"rtsp://$server/$fileName.ts\">$name</a>";
    }
    
    public function getLinkToBillingUser($ip){
        return "<a href=\"https://billing.briz.ua/Ru/billing/IPTV/accounts.html?uni=$ip\">$ip</a>";
    }
    
}

?>