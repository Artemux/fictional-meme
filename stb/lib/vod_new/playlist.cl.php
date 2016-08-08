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
    
	private $num_elements=5;
	private $ip;
    private $UserID;
	private $debug;
	private $server_url = "http://172.17.24.14/server/script/vod_new/image/";

	//function Playlist()
	public function __construct()
	{
        $DB = new db();
		date_default_timezone_set('Europe/Helsinki');
		$this->ip = $_SERVER['REMOTE_ADDR'];
        $DB->sqlq("SELECT `id` FROM `VOD_UserStat` WHERE ip = '".$this->ip."'")->toArray($arr);
        $this->UserID = $arr[0]['id'];
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
        $string = $this->GetWatchedList();
        if ($string == NULL || $string == "") $string = "0";
		(isset( $this->janr )) ? $janr_setup = $this->janr : $janr_setup = "all";
		if ( $this->status_querry == "watched" ){
            $films = $DB->sqlq("    SELECT `id` FROM `VOD_FilmBase`
                                    WHERE `id` IN (".$string.") AND `status`=1")->num_rows();
        } else if ( $this->status_querry == "npvr"){
                $films = $DB->sqlq("    SELECT `id` FROM `NPVR_records`
                                        WHERE `userIP` = '".$this->ip."'")->num_rows();	 
			} else	{
				if ($janr_setup == "all"){
				    $films = $DB->sqlq("    SELECT `id` FROM `VOD_FilmBase`
                                            WHERE `id` NOT IN (".$string.") AND `status`=1")->num_rows();
                } else {
				    $films = $DB->sqlq("    SELECT `id` FROM `VOD_FilmBase`
                                            WHERE `id` NOT IN (".$string.")
                                            AND `janr` = '".$janr_setup."' AND `status`=1")->num_rows();
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
	
	public function CreatePlaylist($page)
	{
	    if ( !isset($this->num_page) ) $this->GetNumPage();
	    if ( isset($page) && is_numeric($page) && $page>=1 && $page <= $this->num_page ){
            $DB = new db();
            $page_element = $this->num_elements;
            $begin = ( $page-1 )*$page_element;
            $string = $this->GetWatchedList();
					if ( $this->status_querry == "watched" ){
                        $playlist = $DB->sqlq(" SELECT * FROM `VOD_FilmBase`
                                                WHERE `id` IN(".$string.") AND `status`=1
                                                LIMIT $begin, $page_element")->toArray();
					} else if ( $this->status_querry == "npvr"){
                        $playlist = $DB->sqlq(" SELECT  npvr.id, sc.Name as name, npvr.fileName as filename,
                                                        npvr.serverIP as ipaddr,
                                                        TIMESTAMPDIFF(SECOND, npvr.startTime, npvr.stopTime) as duration 
                                                FROM `NPVR_records` AS npvr
                                                LEFT JOIN SatChan AS sc ON sc.id = npvr.chanID
                                                WHERE npvr.userIP = '".$this->ip."'
                                                AND npvr.status >= -1
                                                LIMIT $begin, $page_element")->toArray();
                    } else {
                        $playlist = $DB->sqlq(" SELECT `id`, `ipaddr`, `filename`, `name`, `duration`, `image` FROM `VOD_FilmBase`
                                                WHERE `id` NOT IN(".$string.") AND `status`=1
                                                ORDER BY `id` DESC
                                                LIMIT $begin, $page_element")->toArray();
					}
					if ($playlist){
						$count=0;
						$playlist_page = "<ul id=\"playlist\">";
                        foreach( $playlist as $key => $val ){
                            $count++;
                            $this->CreateDescSimple($val['id']);
							$number = $page_element*($page-1)+$count;
                            if ( !isset($val['image']) ) $val['image'] = "tv_records";
                            $playlist_page .= " <li id=\"{$count}\" onclick=\"\" class=\"element\" name=\"".$val['id']."\" style = \"background: url(./image/".$val['image'].".jpg) no-repeat;\">
                                                <div id=\"".$val['id']."\"class=\"hiddenInfo\" style=\"width: 0px; height: 0px; display: none;\">
                                                    ".$this->description."
                                                </div>
                                                </li>";
                        }
						$playlist_page .= "\n</ul>";
                        $playlist_page .= "<div id=\"hidden\" title=\"".$this->num_page."\"></div>";
						$this->playlist = $playlist_page;
						$this->debug[] = date("d M y H:i:s")." - playlist generated for ".$this->ip;
					}
					else {
					   $this->playlist = "<ul id=\"playlist\"><li>НЕТ ЗАПИСЕЙ</li></ul>";
                       $this->playlist .= "<div id=\"hidden\" title=\"".$this->num_page."\"></div>";
					}
		 		//}
		 		//else break;
			//}
		}
		else $this->debug[] = date("d M y H:i:s")." - invalid playlist value get form ip:".$this->ip;
	}
	
	public function CreateDescription($value)
	{	
        $DB = new db();
		if (isset($value)&&is_numeric($value)) {
            if ( $this->status_querry == "npvr"){
//                $descr = $DB->sqlq("    SELECT  `npvr`.`id`, `sc`.`Name` as `name`,
//                                                TIMEDIFF(`npvr`.`stopTime`, `npvr`.`startTime`) as `duration`,
//                                                `npvr`.`startTime`, `npvr`.`stopTime`,
//                                                `npvr`.`programDesc`, `npvr`.`status`
//                                        FROM `NPVR_records` AS `npvr`
//                                        LEFT JOIN `SatChan` AS `sc` ON `sc`.`id` = `npvr`.`chanID`
//                                        WHERE `npvr`.`id` = '".$value."' LIMIT 1")->toArray();
                $descr = $DB->sqlq("    SELECT  `npvr`.`id`, `sc`.`Name` as `name`,
                                                UNIX_TIMESTAMP(`npvr`.`stopTime`) as `stop`, UNIX_TIMESTAMP(`npvr`.`startTime`) as `start`,
                                                UNIX_TIMESTAMP(`npvr`.`addDate`) as `userStart`,
                                                `npvr`.`startTime`, `npvr`.`stopTime`, `npvr`.`addDate`,
                                                `npvr`.`programDesc`, `npvr`.`status`
                                        FROM `NPVR_records` AS `npvr`
                                        LEFT JOIN `SatChan` AS `sc` ON `sc`.`id` = `npvr`.`chanID`
                                        WHERE `npvr`.`id` = '".$value."' ORDER BY `npvr`.`id` ASC LIMIT 1")->toArray();                                        
                if ( $descr[0]['userStart'] > $descr[0]['start'] ){
                    $start = $descr[0]['userStart'];
                    $startDate = $descr[0]['addDate'];
                } else {
                    $start = $descr[0]['start'];
                    $startDate = $descr[0]['startTime'];
                }
                $descr[0]['duration'] = $descr[0]['stop'] - $start;
                $durH = floor($descr[0]['duration']/3600);
                $durM = floor( ( $descr[0]['duration'] - $durH*3600)/60);
                $durS = floor( $descr[0]['duration']-$durH*3600-$durM*60 );
                if ( $durM < 10 ) $durM = "0".$durM;
                if ( $durS < 10 ) $durS = "0".$durS;
                $duration = $durH.":".$durM.":".$durS;
                
                if ( $descr[0]['status'] == 0 ){
                    $status = "<font color=\"white\"> В ОЧЕРЕДИ НА ЗАПИСЬ</font>";
                } else if ( $descr[0]['status'] == 1 ){
                    $status = "<font color=\"white\"> ЗАПИСЬ ПРОГРАММЫ</font>";
                } else {
                   $status = "<font color=\"white\"> ГОТОВ К ПРОСМОТРУ</font>"; 
                }                        
                $desc = "       <img src=\"".$this->server_url."tv_records.jpg\" width=\"122px\" height=\"182\">
                                <h3>".$descr[0]['name']."</h3><br/>
                                <p>
                                    Cтатус: ".$status."<br/></br/>
                                    Начало: ".$startDate."<br/>
                                    Конец: ".$descr[0]['stopTime']."<br/>
                                    Продолжительность: ".$duration."
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
    
    public function CreateDescSimple($value)
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
                    $status = "<font color=\"white\"> В ОЧЕРЕДИ НА ЗАПИСЬ</font>";
                } else if ( $descr[0]['status'] == 1 ){
                    $status = "<font color=\"white\"> ЗАПИСЬ ПРОГРАММЫ</font>";
                } else {
                   $status = "<font color=\"white\"> ГОТОВ К ПРОСМОТРУ</font>"; 
                }                        
                $desc = $descr[0]['name']." - <span>".$descr[0]['programDesc']."</span><br/>
                                    <span>Cтатус:</span> ".$status;
            } else {
                $descr = $DB->sqlq("    SELECT `image`, `description`, `counter`, `duration` FROM `VOD_FilmBase`
                                        WHERE `id` = '".$value."' LIMIT 1")->toArray();
                $durH = floor($descr[0]['duration']/3600);
                $durM = floor( ( $descr[0]['duration'] - $durH*3600)/60);
                $durS = floor( $descr[0]['duration']-$durH*3600-$durM*60 );
                if ( $durM < 10 ) $durM = "0".$durM;
                if ( $durS < 10 ) $durS = "0".$durS;
                $duration = $durH.":".$durM.":".$durS;
                preg_match("/^<h3>([\w|\W|\d|\D]+?)<\/h3>[\w|\W|\d|\D]+?<br><br>([\w|\W|\d|\D]+?)$/", htmlspecialchars_decode($descr[0]['description']), $match );
                
                $desc = $match[1]."<br/><span>Просмотров:</span> ".$descr[0]['counter']." <span>Продолжительность: </span>".$duration;
            }
            
			if ( $descr ) {	
				$this->description = $desc;
			} else {
				$this->debug[] = date("d M y H:i:s")." - No connect to database for description";
			}
		}
		else $this->debug[] = date("d M y H:i:s")." - invalid description value get form ip: ".$this->ip;
	}
	
    public function getFilmInfo( $id ){
        $DB = new db();
        if (isset($id)&&is_numeric($id)) {
            if ( $this->status_querry == "npvr"){
//                $filmInfo = $DB->sqlq(" SELECT  `sc`.`Name` as `name`, `npvr`.`fileName` as `name`,
//                                                TIMESTAMPDIFF(SECOND, npvr.startTime, npvr.stopTime) as `duration`,
//                                                `npvr`.`programDesc` as `rus_name`,
//                                                `npvr`.`serverIP`
//                                        FROM `NPVR_records` AS `npvr`
//                                        LEFT JOIN `SatChan` AS `sc` ON `sc`.`id` = `npvr`.`chanID`
//                                        WHERE `npvr`.`id` = '".$id."' LIMIT 1")->toArray();  
                $filmInfo = $DB->sqlq(" SELECT   `npvr`.`id`, `sc`.`Name` as `name`, `npvr`.`fileName` as `name`,
                                                UNIX_TIMESTAMP(npvr.startTime) as `start`, UNIX_TIMESTAMP(npvr.stopTime) as `stop`,
                                                UNIX_TIMESTAMP(npvr.addDate) as `userStart`,
                                                `npvr`.`programDesc` as `rus_name`,
                                                `npvr`.`serverIP`
                                        FROM `NPVR_records` AS `npvr`
                                        LEFT JOIN `SatChan` AS `sc` ON `sc`.`id` = `npvr`.`chanID`
                                        WHERE `npvr`.`id` = '".$id."' ORDER BY `npvr`.`id` ASC LIMIT 1")->toArray(); 
                if ( $filmInfo[0]['userStart'] > $filmInfo[0]['start'] ){
                    $filmInfo[0]['duration'] = $filmInfo[0]['stop'] - $filmInfo[0]['userStart'];
                } else {
                    $filmInfo[0]['duration'] = $filmInfo[0]['stop'] - $filmInfo[0]['start'];
                }
            } else {
                $filmInfo = $DB->sqlq("    SELECT  `id`, `filename` as `name`, `duration`,
                                                `name` as `rus_name`, `ipaddr` as `serverIP`
                                        FROM `VOD_FilmBase`
                                        WHERE `id` = '".$id."' LIMIT 1")->toArray();
            }
            print_r( json_encode($filmInfo[0]) );
        } else {
            $this->debug[] = date("d M y H:i:s")." - invalid id value for method getFilm from ip: ".$this->ip;
        }
        
    }
    public function GetWatchedList(){
        $DB = new db;
        $watchedFilmsId = $DB->sqlq("SELECT `FilmID` FROM `VOD_WatchedFilms` WHERE `UserID` = '".$this->UserID."'")->toArray();
        if( $watchedFilmsId ){
            if( count($watchedFilmsId) != 0 ){
                foreach( $watchedFilmsId as $key => $val ){
                    $tmp_arr[] = $val['FilmID'];
                }
				$string = implode(",", $tmp_arr);
            }
        } else {
            $string = "0";
        }
        return $string;
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