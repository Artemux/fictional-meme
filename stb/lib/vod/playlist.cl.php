<?php

/**
 * @author Vladimir
 * @copyright 2009
 */

Class Playlist 
{
    public $playlist;
    public $description;
    public $num_page;
    public $janr;
    public $status_querry;
    
	private $num_elements=11;
	private $ip;
	private $debug;
	private $server_url = "http://172.17.24.14/server/script/vod/image/";

	//function Playlist()
	public function __construct()
	{
		date_default_timezone_set('Europe/Helsinki');
		$this->ip = $_SERVER['REMOTE_ADDR'];
		$this->debug[] = date("d M y H:i:s")." - "."ip initialize - ".$this->ip;
		//$this->GetNumPage();
	}
	
	public function Destroy()
	{
		unset($this->playlist);
		unset($this->description);
		unset($this->debug);
	}
	
	public function win2utf($s)
	{
	   $lenght=strlen($s);
	   for($i=0, $m=$lenght; $i<$m; $i++)
	   {
	       $c=ord($s[$i]);
	       if ($c<=127) {$t.=chr($c); continue; }
	       if ($c>=192 && $c<=207)    {$t.=chr(208).chr($c-48); continue; }
	       if ($c>=208 && $c<=239) {$t.=chr(208).chr($c-48); continue; }
	       if ($c>=240 && $c<=255) {$t.=chr(209).chr($c-112); continue; }
	       if ($c==184) { $t.=chr(209).chr(209); continue; };
		   if ($c==168) { $t.=chr(208).chr(129);  continue; };
	   }
	   return $t;
	}
	
	public function GetNumPage()
	{
		// this function needs set value for $this->janr
        $DB = new db();
        $watchedFilmsId = $DB->sqlq("SELECT `watched` FROM `VOD_UserStat` WHERE `ip` = '".$this->ip."'")->toArray();
		if ( $watchedFilmsId ){
			$string = $watchedFilmsId[0]['watched'];
			if ($string == NULL || $string == "") $string = "0";
			(isset( $this->janr )) ? $janr_setup = $this->janr : $janr_setup = "all";
			if ( $this->status_querry == "watched" ){
                $films = $DB->sqlq("    SELECT `id` FROM `VOD_FilmBase`
                                        WHERE `id` IN (".$string.")")->num_rows();
			} else if ( $this->status_querry == "npvr"){
                $films = $DB->sqlq("    SELECT `id` FROM `NPVR_records`
                                        WHERE `userIP` = '".$this->ip."'")->num_rows();	 
			} else	{
				if ($janr_setup == "all"){
				    $films = $DB->sqlq("    SELECT `id` FROM `VOD_FilmBase`
                                            WHERE `id` NOT IN (".$string.")")->num_rows();
                } else {
				    $films = $DB->sqlq("    SELECT `id` FROM `VOD_FilmBase`
                                            WHERE `id` NOT IN (".$string.")
                                            AND `janr` = '".$janr_setup."'")->num_rows();
                }
			}
			
			if ($films){
				$this->num_page = ceil($films/$this->num_elements);
				if ($this->num_page <= 0) $this->num_page=1;
				$this->debug[] = $this->num_page;
			}
			else {
                $this->num_page = 1;
                //$this->debug[] = date("d M y H:i:s")." - error in getting number of pages for ".$this->ip;
			}
		}
	}
	
	public function CreatePlaylist($page)
	{
	    if ( !isset($this->num_page) ) $this->GetNumPage();
	    if ( isset($page) && is_numeric($page) && $page>=1 && $page <= $this->num_page ){
            $DB = new db();
            $page_element = $this->num_elements;
            $begin = ( $page-1 )*$page_element;
            $watchedFilmsId = $DB->sqlq("SELECT `watched` FROM `VOD_UserStat` WHERE `ip` = '".$this->ip."'")->toArray();
			if( $watchedFilmsId ){
				if( count($watchedFilmsId) != 0 ){
					$string = $watchedFilmsId[0]['watched'];
					if ( $this->status_querry == "watched" ){
                        $playlist = $DB->sqlq(" SELECT * FROM `VOD_FilmBase`
                                                WHERE `id` IN(".$string.")
                                                LIMIT $begin, $page_element")->toArray();
					} else if ( $this->status_querry == "npvr"){
                        $playlist = $DB->sqlq(" SELECT  npvr.id, sc.Name as name, npvr.fileName as filename,
                                                        npvr.serverIP as ipaddr,
                                                        TIMESTAMPDIFF(SECOND, npvr.startTime, npvr.stopTime) as duration 
                                                FROM `NPVR_records` AS npvr
                                                LEFT JOIN SatChan AS sc ON sc.id = npvr.chanID
                                                WHERE npvr.userIP = '".$this->ip."'
                                                LIMIT $begin, $page_element")->toArray();
                    } else {
                        $playlist = $DB->sqlq(" SELECT `id`, `ipaddr`, `filename`, `name`, `duration` FROM `VOD_FilmBase`
                                                WHERE `id` NOT IN(".$string.")
                                                ORDER BY `id` DESC
                                                LIMIT $begin, $page_element")->toArray();
					}
					if ($playlist){
						$count=0;
						$playlist_page = "<ul id=\"playlist\">";
                        foreach( $playlist as $key => $val ){
                            $count++;
							$number = $page_element*($page-1)+$count;
//                            if ( $this->status_querry == "npvr"){
//                                $playlist_page .= "<li><input id=\"count".$count."\" type=\"button\" class=\"input_button\" style=\"width:100%; font-size: 14px;\" value=\"".$number.". ".$val['name']."\" onclick=\"VODPlay('".$val['filename']."','".$val['duration']."','".$val['name']."', '".$val['ipaddr']."');\" onfocus=\"SetDescription('".$val['id']."','".$count."');\"></li>";
//                            } else {
							    $playlist_page .= "\n\t<li>\n\t\t<input id=\"count".$count."\" type=\"button\" class=\"input_button\" style=\"width:100%; font-size: 14px;\" value=\"".$number.". ".$val['name']."\" onclick=\"VODPlay('".$val['filename']."','".$val['duration']."','".$val['name']."', '".$val['ipaddr']."');\" onfocus=\"SetDescription('".$val['id']."','".$count."');\">\n\t</li>";
//                            }
                        }
						$playlist_page .= "\n</ul>";
						$this->playlist = $playlist_page;
						$this->debug[] = date("d M y H:i:s")." - playlist generated for ".$this->ip;
					}
					else {
					   $this->playlist = "<ul id=\"playlist\"><li>НЕТ ЗАПИСЕЙ</li></ul>";
					}
		 		}
		 		else break;
			}
		}
		else $this->debug[] = date("d M y H:i:s")." - invalid playlist value get form ip:".$this->ip;
	}
	
	public function CreateDescription($value)
	{	
        $DB = new db();
		if (isset($value)&&is_numeric($value)) {
            if ( $this->status_querry == "npvr"){
                $descr = $DB->sqlq("    SELECT  `npvr`.`id`, `sc`.`Name` as `name`,
                                                TIMEDIFF(`npvr`.`stopTime`, `npvr`.`startTime`) as `duration`,
                                                `npvr`.`startTime`, `npvr`.`stopTime`,
                                                `npvr`.`programDesc`, `npvr`.`status`
                                        FROM `NPVR_records` AS `npvr`
                                        LEFT JOIN `SatChan` AS `sc` ON `sc`.`id` = `npvr`.`chanID`
                                        WHERE `npvr`.`id` = '".$value."' LIMIT 1")->toArray();
                if ( $descr[0]['status'] == 0 ){
                    $status = "<font color=\"green\"> В ОЧЕРЕДИ НА ЗАПИСЬ</font>";
                } else if ( $descr[0]['status'] == 1 ){
                    $status = "<font color=\"red\"> ЗАПИСЬ ПРОГРАММЫ</font>";
                } else {
                   $status = "<font color=\"blue\"> ГОТОВ К ПРОСМОТРУ</font>"; 
                }                        
                $desc = "       
                                <h3>".$descr[0]['name']."</h3><br/>
                                <p>
                                    Cтатус: ".$status."<br/></br/>
                                    Начало: ".$descr[0]['startTime']."<br/>
                                    Конец: ".$descr[0]['stopTime']."<br/>
                                    Продолжительность: ".$descr[0]['duration']."
                                </p>
                                ".$descr[0]['programDesc']."";
            } else {
                $descr = $DB->sqlq("    SELECT `image`, `description` FROM `VOD_FilmBase`
                                        WHERE `id` = '".$value."' LIMIT 1")->toArray();
                $desc = "<img src=\"".$this->server_url.$descr[0]['image'].".jpg\" width=\"122px\" height=\"182\">".htmlspecialchars_decode($descr[0]['description']);
            }
            
			if ( $descr ) {	
				$this->description = $desc;
			} else {
				$this->debug[] = date("d M y H:i:s")." - No connect to database for description";
			}
		}
		else $this->debug[] = date("d M y H:i:s")." - invalid description value get form ip: ".$this->ip;
	}
	
	public function ShowStartPage(){
        $DB = new db();
        $films = $DB->sqlq("    SELECT `image`, `name`, `counter` FROM `VOD_FilmBase`
                                ORDEER BY `counter` DESC LIMIT 4")->toArray();
		if ($films)
		{
		    echo "
			    <div id=\"StartPageBlock\" style=\"display: block; position: relative; width: 100%; height: 100%; padding: 6px;\">";
		    foreach( $films as $key => $val){
                echo "
				<div class=\"StartPageElement\" style=\"display: block; position: relative; float: left; width: 49%; height: 49%;\">
				    <image src=\"./image/".$val['image'].".jpg\">
				    <span class=\"text\">".$val['name']."</span><br/>
				    <span class=\"text\">".$val['counter']."</span>
				</div>";
		    }
		    echo "
			    </div>";
		}
		else echo "no connect";
	}
	
	public function Debug(){
        for($i=0;$i<sizeof($this->debug);$i++) echo "PLAYLIST: ".$this->debug[$i]."\n";
    } 
}

?>