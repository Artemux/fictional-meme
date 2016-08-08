<?php

/**
 * @author Vladimir
 * @copyright 2010
 */
 
require_once(LIB_DIR."validator.cl.php");

class stb_user extends validator{
    private $DB;
    
    public function __construct(&$db){
        $this->DB = $db;
    }
    
    public function LastWatchedFilms(){
        $this->DB->sqlq("   SELECT `wf`.`id`, `wf`.`date`, `fb`.`name`, `us`.`ip`
                            FROM `VOD_WatchedFilms` as `wf`
                            LEFT JOIN `VOD_FilmBase` as `fb` ON `wf`.`FilmID`=`fb`.`id`
                            LEFT JOIN `VOD_UserStat` as `us` ON `wf`.`UserID`=`us`.`id`
                            ORDER BY `wf`.`id` DESC LIMIT 10 ")->toArray($arr);
        if (isset($arr)){
            $tpl[0] = array("№/id", "Название фильма", "Пользователь", "Дата");
            foreach ( $arr as $key=>$val ){
                $hrefToUser = $this->getLinkToBillingUser($val['ip']);
                $tpl[] = array($key."/".$val['id'], $val['name'], $hrefToUser, $val['date']);
            }
            return $tpl;
        }
    }
    
    public function WatchedFilms(){
        require_once(SCRIPT_DIR."vod.php");
        require_once(LIB_DIR."html.cl.php");
        $HTML = new html;
        $VOD = new vod($this->DB);
        $select = array("id", "ip", "watchnow", "time", "status");

        $sqlq = "   SELECT ".implode(", ",$select)."  FROM `VOD_UserStat`";
        if ( isset($_REQUEST['sort_by']) ){
        	$sort_by = $this->valid($_REQUEST['sort_by'], "\w{1,10}");
        } else {
        	$sort_by = "id";
        }
        
        if ( isset($_REQUEST['sort_dir']) ){
        	$sort_dir = $_REQUEST['sort_dir'];
        } else {
        	$sort_dir = "desc";
        }
        
        
        if ( in_array($sort_by, $select) ){
            if ( in_array($sort_dir, array("asc", "desc")) ){
                ( $sort_dir == "asc") ? $sort_dir = "desc" : $sort_dir ="asc";
            } else {
                $sort_dir = "desc";
            }
            $sqlq .= " ORDER BY $sort_by $sort_dir";
        }
        $this->DB->sqlq($sqlq)->toArray($arr);
        
        if (isset($arr)) {
            $tpl[]=array(   $this->href("№/id", "id", $sort_dir),
                            $this->href("IP", "ip", $sort_dir),
                            $this->href("Статус", "status", $sort_dir),
                            $this->href("Смотрит фильм", "watchnow", $sort_dir),
                            "Доп.");
            foreach($arr as $key => $val){
                if ($val['status'] == "1") {
                    $status = "<font color=\"green\">ONLINE</font>";
                } else {
                    $status = "<font color=\"red\">OFFLINE</font>";
                }
                $filmInfo = $VOD->getFilmByID((int)$val['watchnow']); 
                $filmWatchedNum = $VOD->getWatchedFilmCountByUserID($val['id']);      
                $ip = $this->getLinkToBillingUser($val['ip']);
                
                if ( $val['time'] != "0" && $val['time']!= "" ) {
                    $time = "(".date("H:i:s", $val['time']).")";
                } else {
                    $time = "";
                }
                $hrefToFilm = $VOD->getLinkToFilmDescription($filmInfo['id'], $filmInfo['name'].$time);
                $WatchedButton = $HTML->getImageButton("user_watched_list", $val['id'], "просмотренные фильмы ($filmWatchedNum)", "eye.png");
                $tpl[] = array($key."/".$val['id'], $ip, $status, $hrefToFilm, $WatchedButton );
            }
            return $tpl;
        }
    }
    
    public function DeleteFilmWatchedRecord($id){
        $this->DB->sqlq("DELETE FROM `billing`.`VOD_WatchedFilms` WHERE `VOD_WatchedFilms`.`id` = '".$id."'");
    }
    
    public function href($name, $sort_by, $sort_dir){
         $html =  "<a href=\"http://".$_SERVER['SERVER_NAME']."/".$_SERVER['SCRIPT_NAME']."?statistic&sort_by=$sort_by&sort_dir=$sort_dir\">$name</a>";
         return $html;
    }
    
    public function getLinkToBillingUser($ip){
        return "<a href=\"https://billing.briz.ua/Ru/billing/IPTV/accounts.html?uni=$ip\">$ip</a>";
    }
}

?>