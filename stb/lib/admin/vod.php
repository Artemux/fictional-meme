<?php

/**
 * @author Vladimir
 * @copyright 2010
 */
if (!defined('VOD_DIR')) {
  DEFINE ("VOD_DIR", "/vod_new/");
}
DEFINE ("VOD_IMAGE_DIR", "http://172.17.24.14/server/script/vod_new/image/");

require_once(LIB_DIR."html.cl.php");
require_once(LIB_DIR."ssh.cl.php");
class vod extends html{
    public $el_on_page=20;
    public $el_total, $num_page;
    public $yearRange = array(2007,2008,2009,2010,2011);
    private $DB;
    private $VALIDATOR;
    
    public function __construct(&$db){
        $this->DB = $db;
    }
    
    public function GetValidator(){
        require_once(LIB_DIR."validator.cl.php");
        $this->VALIDATOR = new validator;
    }
    
    public function getList($mode = "simple", $page = 1, $genre = "all", $watchnow = "false"){
        $this->DB->sqlq("SELECT * FROM `VOD_FilmBase` ORDER BY `id` DESC")->toArray($arr);
        if ( $mode == "simple" ){
            $tpl[0] = array("id", "Название","Жанр", "Просмотров");
        } else {
            $tpl[0] = array("id", "Название","Жанр", "Сервер", "Цена", "Просмотров", "Доступен", "Действия");  
        }
        
        foreach( $arr as $key => $val ){
            $href="<div id=\"{$val['id']}\" class=\"preview\">{$val['name']}</div>";
            if ( $mode == "simple" ){
                $tpl[] = array($val['id'], $href, $val['janr'], $val['counter']);
            } else {
            	$actDel = "";
                if (CAN_EDIT) $actDel .= $this->getImageButton("edit_film", $val['id'] ,"Редактировать","edit.png");
                if (CAN_DELETE) $actDel .= $this->getImageButton("delete_film", $val['id'] ,"Удалить","delete.png");
                ($val['status'] == 1) ? $access = "<font color=\"green\">ДА</font>" : $access = "<font color=\"red\">НЕТ</font>";
                $tpl[] = array($val['id'], $href, $val['janr'], $val['ipaddr'], $val['price'], $val['counter'], $access, $actDel);
            }
        }
        return $tpl;
    }
    
    public function AddFilm($filmInfo){
        $new_description = "<h3><b>".$filmInfo->fullname."(".$filmInfo->year.")</b></h3><b>Жанр: </b>".$filmInfo->janr."<br><b>Режиссер: </b>".$filmInfo->rejiser."<br><b>Продолжительность: </b>".$this->GetTimeFromSec($filmInfo->latency)."<br><b>В ролях: </b>".$filmInfo->actors."<br><br><b>Описание: </b>".$filmInfo->description;
        $this->DB->sqlq("   INSERT INTO `billing`.`VOD_FilmBase`
                            (`id`, `filename`, `name`, `image`, `duration`, `short_description`, `description`, `janr`, `rejiser`, `actors`, `year`, `price`, `ipaddr`, `counter`, `status`)
                            VALUES
                            (NULL, '".$filmInfo->filename."', '".$filmInfo->fullname."', '".$filmInfo->filmImage."', '".$filmInfo->latency."', '".$filmInfo->description."',
                            '".htmlspecialchars($new_description)."', '".$filmInfo->janr."','".$filmInfo->rejiser."','".$filmInfo->actors."', '".$filmInfo->year."', '".$filmInfo->price."', '".$filmInfo->serverIP."', '0', '".$filmInfo->status."')");
    }
    
    public function UpdateFilm($filmInfo){
        $new_description = "<h3><b>".$filmInfo->fullname."(".$filmInfo->year.")</b></h3><b>Жанр: </b>".$filmInfo->janr."<br><b>Режиссер: </b>".$filmInfo->rejiser."<br><b>Продолжительность: </b>".$this->GetTimeFromSec($filmInfo->latency)."<br><b>В ролях: </b>".$filmInfo->actors."<br><br><b>Описание: </b>".$filmInfo->description;
        $this->DB->sqlq("   UPDATE `billing`.`VOD_FilmBase` 
                            SET `name`='".$filmInfo->fullname."', `filename`='".$filmInfo->filename."', `janr`='".$filmInfo->janr."', 
                            `duration`='".$filmInfo->latency."', `rejiser`='".$filmInfo->rejiser."', `actors`='".$filmInfo->actors."',
                            `short_description`='".$filmInfo->description."', `ipaddr`='".$filmInfo->serverIP."', `year`='".$filmInfo->year."',
                            `image`='".$filmInfo->filmImage."', `description`='".$new_description."', `status`='".$filmInfo->status."'
                            WHERE `id`='".$filmInfo->filmID."' LIMIT 1");
    }
    
    public function DeleteFilm($id){
        $this->DB->sqlq("SELECT * FROM `VOD_FilmBase` WHERE `id`='".$id."'")->toArray($arr);
        if ( isset($arr)){
            foreach($arr as $key => $val){
            	$this->DB->sqlq("SELECT * FROM `VOD_Servers` WHERE `ServerIP`='".$val['ipaddr']."'")->toArray($serverInfo);
				if ( isset($serverInfo) ){
					try{
						$ssh = new SSH($serverInfo[0]['ServerIP'],22);
						$ssh->connect($serverInfo[0]['Login'], $serverInfo[0]['Password']);
						$cycle = true;
						while($cycle){
							$data = $ssh->read();
							if ( preg_match('/\$/',$data) ){
								$cycle = false;
							}
						}
						
						$ssh->write("cd ".$serverInfo[0]['VODDIR']."\n");
						$cycle = true;
						while($cycle){
							$data = $ssh->read();
							if ( preg_match('/\$/',$data) ){
								$cycle = false;
							}
						}
						
						$ssh->write("rm -f ".$val['filename'].".ts; rm -f ".$val['filename'].".tsx\n");
						$cycle = true;
						while($cycle){
							$data = $ssh->read();
							if ( preg_match('/\$/',$data) ){
								$cycle = false;
							}
						}
						$ssh->disconnect();
						$this->DB->sqlq("DELETE FROM `VOD_FilmBase` WHERE `id`='".$id."' LIMIT 1");
						$this->DB->sqlq("DELETE FROM `VOD_WatchedFilms` WHERE `FilmID`='".$id."'");
					} catch (SSHException $e){
						echo "An Exception Occured: {$e->getMessage()} ({$e->getCode()})\n";
                    	echo "Trace: \n";
                    	echo print_r($e->getTrace());
                    	echo "\n";
					}
				} else {
					echo "no such server in DB";
				}
            }
        } else {
        	echo "no such id in DB filmBase";
        }
    }
    
    public function getFilmForm($id = ""){
        if ($id != ""){
            $filmInfo = $this->getFilmByID($id);
            $act = "edit";
        } else {
            $filmInfo = 0;
            $act = "insert";
        }
        $html = "	<br/>
			<form name=\"filmInfo\" method=\"post\" action=\"index.php\" enctype=\"multipart/form-data\">
				<input id=\"act\" name=\"act\" value=\"$act\" type=\"hidden\">
                <input id=\"filmID\" name=\"filmID\" value=\"$id\" type=\"hidden\">
				<TABLE cellspacing=\"0\" cellpadding=\"4\" border=\"0 px\">
                    <tr>
						<td valign=\"top\">Название:</td> 
						<td><input name=\"fullname\" id=\"fullname\" type=\"text\"  value=\"{$filmInfo['name']}\"/>
						<div onclick=\"LoadDesription()\" style=\"cursor: pointer;\">Поиск информации о фильме</div></td>
						</td>
  					</tr>
  					<tr>
						<td valign=\"top\">Имя файла: </td>
						<td><input name=\"filename\" id=\"filename\" type=\"text\" value=\"{$filmInfo['filename']}\"/>.ts</td>
  					</tr>
                    <tr>
						<td valign=\"top\">Жанр: </td>
						<td><input name=\"janr\" id=\"janr\" type=\"text\" value=\"{$filmInfo['janr']}\"></td>
  					</tr>
					 <tr>
						<td valign=\"top\">Продолжительность: </td>
						<td><input onchange=\"javascript: CalcLatency(this)\"name=\"latency\" id=\"latency\" type=\"text\" value=\"{$filmInfo['duration']}\"/> (1:43:54)</td>
  					</tr>
                    <tr>
						<td valign=\"top\">Режисер:</td>
						<td><input name=\"rejiser\" id=\"rejiser\" type=\"text\" value=\"{$filmInfo['rejiser']}\"/></td>
  					</tr> 	
					<tr>
						<td valign=\"top\">В ролях: </td>
						<td><input name=\"actors\" id=\"actors\" type=\"text\" value=\"{$filmInfo['actors']}\"/></td>
					</tr>
                    <tr>
						<td valign=\"top\">Постер</td>
						<td><input id=\"filmImage\" name=\"filmImage\" type=\"text\" value=\"{$filmInfo['image']}\" size=\"75\"/></td>
					</tr>";
                    if (!isset($filmInfo['year'])){
                        $year = $this->getSelect($this->yearRange, "year");
                    } else {
                        $year = $this->getSelect($this->yearRange, "year", $filmInfo['year']);
                    }
                    $html .= "
					<tr>
						<td valign=\"top\">Год выпуска: </td>
						<td>$year</td>
					</tr>";
                    if (!isset($filmInfo['ipaddr'])){
                        $ipaddr = $this->getSelect($this->getServers(), "serverIP");
                    } else {
                        $ipaddr = $this->getSelect($this->getServers(), "serverIP", $filmInfo['ipaddr']);
                    }
                    $html .="
					<tr>
						<td valign=\"top\">Server IP: </td>
						<td>$ipaddr</td>
					</tr>
					<tr>
						<td valign=\"top\">Описание: </td>
                        <td colspan=\"2\">
                            <TEXTAREA rows=\"10\" style=\"width: 100%;\" name=\"description\" id=\"description\">".$filmInfo['short_description']."</TEXTAREA>
                        </td>
					</tr>
                    ";
                    if (!isset($filmInfo['status']) || $filmInfo['status'] == "0"){
                        $status = "";
                    } else {
                        $status = "checked=\"checked\"";
                    }
                    $html .="
                    <tr>
                        <td></td>
						<td valign=\"top\"><input type=\"checkbox\" id=\"status\" $status name=\"status\"/> Выводить на приставки </td>
					</tr>				
				</TABLE>
                <div align=\"center\">
                    ".$this->getButton("send_form", $id, "ОТПРАВИТЬ")."	
                </div>
			</form>
            ".$this->getUploaderForm();
        return $html;
    }
    
    public function getDescription($id){
        $this->DB->sqlq("SELECT * FROM `VOD_FilmBase` WHERE `id`=$id")->toArray($arr);
        if (is_array($arr)){
            foreach($arr as $key => $val){
                $html = "<h3>".$val['name']."</h3>";
                $html .= "<div class=\"image\"><img src=\"http://172.17.24.14/server/script/vod_new/image/{$val['image']}.jpg\"/></div>";
                $html .= "<br/><b>Жанр: </b>{$val['janr']}<br><b>Режиссер: </b>{$val['rejiser']}<br><b>Продолжительность: </b>".$this->GetTimeFromSec($val['duration'])."<br><b>В ролях:</b> {$val['actors']}<br/><b>Описание:</b><br/> {$val['short_description']}<br/>";
                $html .= "<br/>".$this->getLinkToTSRecord("Ссылка для просмотра", $val['ipaddr'], $val['filename']);
            }
            return $html;
        }    
    }
    
    public function getWatchedByUserID($id){
        $this->DB->sqlq("   SELECT `wf`.`FilmID`, `wf`.`date`, `fb`.`name`, `wf`.`id` 
                            FROM `VOD_WatchedFilms` as `wf`
                            LEFT JOIN `VOD_FilmBase` as `fb` ON `fb`.`id`=`wf`.`FilmID`
                            WHERE `UserID`=$id")->toArray($arr);
        $tpl[0] = array("id", "Название", "Дата просмотра", "Действия");
        foreach( $arr as $key => $val ){
            $href = $this->getLinkToFilmDescription($val['FilmID'], $val['name']);
            $DeleteButton = $this->getImageButton("delete_watched", $val['id'], "удалить", "delete.png");
            $tpl[] = array($val['FilmID'], $href, $val['date'], $DeleteButton );
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
    public function getServers(){
        $this->DB->sqlq("SELECT `ServerIP` FROM `VOD_Servers` WHERE 1")->toArray($arr);
        if ($arr){
            foreach($arr as $key => $val){
                $servers[] = $val['ServerIP'];
            }
            return $servers;
        }
    }   
    
    private function GetTimeFromSec($t_sec){
        if ( is_numeric($t_sec) ){
            $H = floor($t_sec/3600);
            $M = floor(($t_sec-($H*60*60))/60 );
            $S = $t_sec - $H*60*60 - $M*60;
            if ($H < 10) $H = "0".$H;
            if ($M < 10) $M = "0".$M;
            if ($S < 10) $S = "0".$S;
            return $H.":".$M.":".$S;
        }
    }
    
    public function Statistic(){
        $w_count = 0;
        $online_count = 0;
        $total = 0;
        $w_filmlist = "";       
        $this->DB->sqlq("   SELECT `watchnow`, `status`  FROM `VOD_UserStat`")->toArray($arr);
        $total = $this->DB->sqlq("SELECT `id` FROM `VOD_FilmBase` WHERE 1")->num_rows();
        foreach( $arr as $key => $val ){
            if ( $val['watchnow'] != "" ) {
                $w_count++;
                $w_filmlist[] = $val['watchnow'];
            }
            if ( $val['status'] == 1) $online_count++;
        } 
        $tpl[0] = array("Пользователей OnLine", "Фильмов в архиве", "Смотрят фильмы");
        $tpl[1] = array($online_count, $total, array("title"=>implode(",",$w_filmlist), "text"=>$w_count) );

        return $tpl;
    }
}

?>