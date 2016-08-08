<?php

/**
 * @author Vladimir
 * @copyright 2010
 */
require_once(LIB_DIR."html.cl.php");
class npvr extends html{
    public $el_on_page=20;
    public $status = array("0"=>"Ожидает", "1"=>"Записывается","-1"=>"Готов");
    public $el_total, $num_page;
    private $DB;
    
    public function __construct(&$db){
        $this->DB = $db;
    }
    
    public function getList($mode = "simple", $page = 1, $genre = "all", $watchnow = "false"){
        $this->DB->sqlq("   SELECT  `npvr`.`id`, `sc`.`Name` as `name`,
                            UNIX_TIMESTAMP(`npvr`.`stopTime`) as `stop`, UNIX_TIMESTAMP(`npvr`.`startTime`) as `start`,
                            UNIX_TIMESTAMP(`npvr`.`addDate`) as `userStart`,
                            `npvr`.`startTime`, `npvr`.`stopTime`, `npvr`.`addDate`,
                            `npvr`.`programDesc`, `npvr`.`status`, `npvr`.`serverIP`,
                            `npvr`.`userIP`, `npvr`.`status`, `npvr`.`fileName`
                            FROM `NPVR_records` AS `npvr`
                            LEFT JOIN `SatChan` AS `sc` ON `sc`.`id` = `npvr`.`chanID`
                            ORDER BY `npvr`.`id` ASC")->toArray($arr);
        if ( $mode == "simple" ){
            $tpl[0] = array("id", "Телеканал", "Передача", "Продолжительность", "Статус");
        } else {
            $tpl[0] = array("id", "Телеканал", "Передача", "Продолжительность", "Сервер", "Пользователь", "Статус");  
        }
        foreach( $arr as $key => $val ){
            $duration = $this->CalcDuration($val['start'], $val['stop'], $val['userStart']);
            if ($val['fileName'] != ""){
                $hrefToFilm = $this->getLinkToTSRecord($val['programDesc'], $val['serverIP'], $val['fileName']);
            } else {
                $hrefToFilm = $val['programDesc'];
            }
            $userHref = $this->getLinkToBillingUser($val['userIP']);
            
            if ( $mode == "simple" ){
                $tpl[] = array($val['id'], $val['name'], $hrefToFilm, $duration, $this->status[$val['status']]);
            } else {
                $tpl[] = array($val['id'], $val['name'], $hrefToFilm, $duration, $val['serverIP'], $userHref, $this->status[$val['status']]);
            }
        }
        return $tpl;
    }
    
    public function addFilm(){
        
    }
    
    public function getDescription($id){
        $this->DB->sqlq("SELECT * FROM `VOD_FilmBase` WHERE `id`=$id")->toArray($arr);
        if (is_array($arr)){
            foreach($arr as $key => $val){
                $html = html_entity_decode($val['description']);
                $html .= "<br/><a href=\"rtsp://{$val['ipaddr']}/{$val['filename']}.ts\">Ссылка для просмотра</a>";
            }
            return $html;
        }    
    }
    
    public function getWatchedByUserID($id){
        $this->DB->sqlq("   SELECT `wf`.`FilmID`, `wf`.`date`, `fb`.`name`, `wf`.`id` 
                            FROM `VOD_WatchedFilms` as `wf`
                            LEFT JOIN `VOD_FilmBase` as `fb` ON `fb`.`id`=`wf`.`FilmID`
                            WHERE `UserID`=$id")->toArray($arr);
        $tpl[0] = array("id", "название", "дата просмотра", "дополнительно");
        foreach( $arr as $key => $val ){
            $href = $this->getLinkToFilmDescription($val['FilmID'], $val['name']);
            $tpl[] = array($val['FilmID'], $href, $val['date'], "<div id=\"delete_watched\" name=\"".$val['id']."\" class=\"button\">удалить</div>" );
        }
        return $tpl;
    }
    
    public function getWatchedFilmCountByUserID($id){
        return $this->DB->sqlq("  SELECT `FilmID` FROM `VOD_WatchedFilms` WHERE `UserID`=$id")->num_rows();
    }
    
    public function getFilmByID($id){
        if ($id != ""){
            $this->DB->sqlq("SELECT * FROM `VOD_FilmBase` WHERE `id`=$id LIMIT 1")->toArray($arr);
            if (isset($arr)){
                return $arr[0];
            } else {
                return false;
            }
        }
    }
    public function CalcDuration($startTime, $stopTime, $userStart){
        if ( $userStart > $startTime ){
                    $start = $userStart;
                } else {
                    $start = $startTime;
                }
                $duration = $stopTime - $start;
                $durH = floor($duration/3600);
                $durM = floor( ( $duration - $durH*3600)/60);
                $durS = floor( $duration-$durH*3600-$durM*60 );
                if ( $durM < 10 ) $durM = "0".$durM;
                if ( $durS < 10 ) $durS = "0".$durS;
                
                return $durH.":".$durM.":".$durS;
    }    
}

?>