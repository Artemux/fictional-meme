<?php

/**
 * @author Vladimir
 * @copyright 2010
 */

require_once(LIB_DIR."html.cl.php");

class admin_page extends html{
    public $navi = array("Главная страница"=>"mainpage", "Архив Фильмов"=>"films", "Архив ТВ-записей"=>"tv_records", "Управление Новостями"=>"news", "Пользовательская статистика"=>"statistic");
    private $DB, $HTML;
    
    
    public function __construct(){
        $this->DB = new db();
    }
    public function __destruct(){
        unset($this->DB);
    }
    
    public function Navigation(){
        $out = "<ul>";
        foreach( $this->navi as $el=>$page ){
            $out .= "<li id=\"$page\" class=\"navi_button\">$el</li>";
        }
        $out .= "</ul>";
        return $out;
    }
    
    public function Mainpage(){
        require_once(SCRIPT_DIR."stb_user.php");
        $STB_USER = new stb_user($this->DB);
        $html = $this->ServerStatistic();
        echo $this->getBlock("Статистика серверов", $html);
        $html = $this->VodStatistic();
        echo $this->getBlock("Статистика VOD", $html);
        $html = $this->getTable($STB_USER->LastWatchedFilms());
        echo $this->getBlock("10 последних просмотров", $html);  
        $html = $this->TVRecordStatistic();
        echo $this->getBlock("Статистика ТВ-записей", $html);
    }
    
    public function UserStatistic(){
        require_once(SCRIPT_DIR."stb_user.php");
        $STB_USER = new stb_user($this->DB);
        $html = $this->VodStatistic();
        echo $this->getBlock("Статистика VOD", $html);
        $html = $this->getTable($STB_USER->LastWatchedFilms());
        echo $this->getBlock("10 последних просмотров", $html);      
        $html = $this->getTable($STB_USER->WatchedFilms());
        echo $this->getBlock("Статистика Пользователей", $html);
    }
            
    public function vod(){
        require_once(SCRIPT_DIR."vod.php");
        $VOD = new vod($this->DB);
        $html = $this->getButton("edit_film", "" ,"Добавить фильм");
        $html .= $this->getTable($VOD->getList("full"));
        echo $this->getBlock("База фильмов", $html);
    }
    
    public function npvr(){
        require_once(SCRIPT_DIR."npvr.php");
        $NPVR = new npvr($this->DB);
        $html = $this->getTable($NPVR->getList("full"));
        echo $this->getBlock("ТВ ЗАПИСИ", $html);
    }
    
    public function news(){
        require_once(LIB_DIR."stb/stb_news.cl.php");
        $NEWS = new stb_news($this->DB);
        $html = $this->getButton("add_news","", "Добавить новость");
        $html .= $this->getTable($NEWS->getList());
        echo $this->getBlock("Новости", $html);
    }
    
    public function CheckSocket( $serverIP = "172.17.24.14", $port = "4321" ){
        $fp = fsockopen($serverIP, $port, $ErrorNumber, $ErrorText, 10);
        if (!$fp) {
            return array("title"=>"ERROR: $ErrorNumber - $ErrorText", "text"=>"<font color=\"red\">нет соединения</font>");
        } else {
            fwrite($fp,"\n");
            $txt = fread($fp, 26);
            fclose($fp);
            return array("title"=>$txt, "text"=>"<font color=\"green\">работает</font>");
	   }
    }
    
    public function GetDiskUsage( $dir = "/vod", $serverIP = "172.17.24.14", $port = "4321"){   
    }
    
    public function ServerLoad(){
        $this->DB->sqlq("   SELECT `fb`.`ipaddr` FROM `VOD_UserStat` AS `us`
                            LEFT JOIN `VOD_FilmBase` AS `fb` ON `us`.`watchnow` = `fb`.`id`
                            WHERE `us`.`watchnow`!=''")->toArray($arr);
        if (isset($arr)){
            foreach($arr as $key=>$val){
                if (!isset($conn[$val['ipaddr']])){
                    $conn[$val['ipaddr']] = 1;
                } else {
                    $conn[$val['ipaddr']]++;
                }
            }
            return $conn;            
        } else {
            return array();
        }
    }
    
    public function ServerStatistic(){
        $load = $this->ServerLoad();
        
        $this->DB->sqlq("   SELECT `s`.`ServerIP`, `s`.`VODDIR`, `s`.`DiskSpace`, `s`.`DiskUsage`, `s`.`AddDate`,
                            `s`.`ChangeDate`, `u`.`ip`, `u`.`Name`
                            FROM `VOD_Servers` AS `s`
                            LEFT JOIN `STB_Adminka` as `u` ON `s`.`FromID`=`u`.`id` ")->toArray($arr);

        $tpl[0] = array("Server IP", "VOD dir", "DiskSpace/DiskUsage", "Подключения", "Добавлен", "TS&NPVR Socket"); 
        
        for ($i = 0; $i < sizeof($arr); $i++){
            ( isset($load[$arr[$i]['ServerIP']]) ) ? $loadNum = $load[$arr[$i]['ServerIP']] : $loadNum = "0";
            //$sock_stat = $this->checkSocket($arr[$i]['ServerIP']);
            $sock_stat="";
            $tpl[$i+1] = array($arr[$i]['ServerIP'], $arr[$i]['VODDIR'], $arr[$i]['DiskUsage']."/".$arr[$i]['DiskSpace'],
                        $loadNum, $arr[$i]['AddDate'], $sock_stat);
        }
        
        return $this->getTable($tpl);     
    }
    
    public function VodStatistic(){
        require_once(SCRIPT_DIR."vod.php");
        $VOD = new vod($this->DB);
        return $this->getTable($VOD->Statistic());
    }
    
    public function TVRecordStatistic(){
        $total = 0; $saved = 0; $await = 0; $recording = 0;
        
        $this->DB->sqlq("SELECT `status` FROM `NPVR_records` WHERE 1")->toArray($arr);
        foreach( $arr as $key => $val){
            $total++;
            if ( $val['status'] == -1 ) {
                $saved++;
            } elseif ( $val['status'] == 0){
                $await++;
            } else {
                $recording++;
            }
        }
        
        $tpl[0] = array("Всего ТВ записей", "Готовые", "Ожидают Записи", "Записываются"); 
        $tpl[1] = array($total, $saved, $await, $recording); 
        return $this->getTable($tpl);
    }
}

?>