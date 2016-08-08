<?php

/**
 * @author Vladimir
 * @copyright 2010
 */

require_once(LIB_DIR."db_func.cl.php");
class stb_news extends db_func{
    
    public $tableName = "STB_News";
    public $valid = array("Message");
    
    public function __construct(&$db){
        parent::__construct($db);
    } 
    
    public function getList(){
        require_once(LIB_DIR."html.cl.php");
        $HTML = new html;
        $this->DB->sqlq("SELECT * FROM $this->tableName WHERE 1")->toArray($arr);
        if (isset($arr)){
            $tpl[] = array("N/id","Message", "ToUser", "Добавлена", "Истекает", "Доп.");
            foreach( $arr as $key=>$val ){
                $delBut = $HTML->getImageButton("delete_news",$val['id'], "Удалить","delete.png");
                $editBut = $HTML->getImageButton("edit_news",$val['id'], "Редактировать","edit.png");
                $tpl[] = array($val['id'], $val['Message'], long2ip($val['ToUser']), $val['AddDate'], $val['ExpiredDate'], $editBut.$delBut);
            }
            return $tpl;      
        }
    }
    
    public function getForm($id = ""){
        require_once(LIB_DIR."html.cl.php");
        $HTML = new html;
        
        $msg = "";
        $expiredDate = "";
        $toUser = "";
        if ( is_numeric($id) ) {
            $action = "update";
            $arr = $this->getById($id);
            $msg = htmlspecialchars_decode($arr->Message);
            $toUser = long2ip($arr->ToUser);
            $expiredDate = $arr->ExpiredDate;
        } else {
            $action = "insert";
        }
        
        $html = "  
                <form name=\"filmInfo\" method=\"post\" action=\"index.php\" enctype=\"multipart/form-data\">
                <input type=\"hidden\" id=\"action\" name=\"action\" value=\"$action\"/>
                <input type=\"hidden\" id=\"id\" name=\"id\" value=\"$id\"/>
                Пользователю: <input type=\"text\" id=\"ToUser\" name=\"ToUser\" value=\"$toUser\"/>
                Дата Окончания: <input type=\"text\" id=\"date\" name=\"date\" value=\"$expiredDate\"/>
                Текст сообщения:
                <TEXTAREA rows=\"10\" style=\"width: 100%;\" name=\"Message\" id=\"Message\">".$msg."</TEXTAREA>
                ".$HTML->getButton("send_news_form", "", "Добавить")."
                </form>
                <script>
                    $(\"#date\").datepicker() ;
                </script>";
        return $html;
    }
    
    public function InsertNews($obj){
        $this->Message = htmlspecialchars($obj->Message);
        $this->ExpiredDate = $this->GetDBDate($obj->ExpiredDate);
        $this->AddDate = date("Y-m-d H:i:s");
        $this->ToUser = sprintf("%u", ip2long($obj->ToUser));
        $this->Insert();
    }
    
    public function UpdateNews($obj){
        $this->getById($obj->id);
        $this->Message = htmlspecialchars($obj->Message);
        $this->ExpiredDate = $this->GetDBDate($obj->ExpiredDate);
        $this->AddDate = date("Y-m-d H:i:s");
        $this->ToUser = sprintf("%u", ip2long($obj->ToUser));
        $this->Update();
    }
    
    public function DeleteNews($id){
    	$this->getById($id);
    	$this->Delete();
    	
    }
    
    private function GetDBDate($str){
        $arr = explode("/",$str);
        return $arr['2']."-".$arr['0']."-".$arr['1']." ".date("H:i:s");
    }
}

?>