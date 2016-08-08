<?php

/**
 * @author Vladimir
 * @copyright 2010
 */

class telegid{
    
    private $chanOnList = 1;
    private $maxPage = 1;
    private $genres = array();
    private $chanNums = 0;
    private $chanListStr = "";
    private $chanList = array();
    private $chanNames = array();
    private $secret_chan = "";
    public $days = array();
    private $html;
    
    public function __construct(){ 
        chdir(SCRIPT_DIR); 
        $this->secret_chan="125,53,202,212,217,124";  
    }
    
    public function __destruct(){
        
    }

    public function GetNumPage( $genre = "" ){
         $DB = new db();
         $query = " SELECT DISTINCT sc.id FROM `EPG_ChanProgramm` AS cp
                    LEFT JOIN `SatChan` AS sc ON cp.chanID = sc.id
                    WHERE sc.id NOT IN(".$this->secret_chan.")\n";
         if ( $genre != "" ) $query .= "AND sc.Genre='".$genre."'";
         $chans = $DB->sqlq($query)->num_rows();
         if ($chans > 0){
             $this->chanNums = $chans;
             $this->maxPage = ceil( $chans/$this->chanOnList);
             $genreList = $DB->sqlq("SELECT DISTINCT `Genre` FROM `SatChan` WHERE 1")->toArray();
             if ( $genreList ){
                 unset( $this->genres );
                 foreach( $genreList as $key => $val ){
                    $this->genres[] = $val['Genre'];
                 }
                 sort($this->genres);
             }
         }
    }
    
    public function GetDays(){
        $DB = new db();
        $days = $DB->sqlq("SELECT DISTINCT DATE(`startTime`) as day FROM `EPG_ChanProgramm` WHERE 1")->toArray();
        foreach($days as $key => $val){
            $tmp = explode("-", $val['day']);
            $dayOfWeek = getdate( mktime( 10, 10, 10, $tmp[1], $tmp[2], $tmp[0] ) );
            $this->days[$dayOfWeek['wday']] = $val['day'];
        }
    }

    public function GetChannelList( $page = "1", $genre = "" ){
        $DB = new db();
        $this->GetNumPage($genre);

        if ( $page > $this->maxPage ) $page = 1;
        if ( $page < 1 ) $page = $this->maxPage;
        $begin = ($page-1)*$this->chanOnList;
        $query ="   SELECT DISTINCT sc.id, sc.Name FROM `EPG_ChanProgramm` AS cp
                    LEFT JOIN `SatChan` AS sc ON cp.chanID = sc.id
                    WHERE sc.id NOT IN(".$this->secret_chan.") \n";
        if ( $genre != "" ) $query .= "AND sc.Genre='".$genre."'\n";
        $query .="  LIMIT $begin, $this->chanOnList";
        $chanList = $DB->sqlq($query)->toArray();
        
        if ( $chanList ){
            unset($this->chanList);
            unset($this->chanListStr);
            foreach( $chanList as $key => $val ){
                $this->chanList[] = $val['id'];
                $this->chanNames[] = $val['Name'];
            }
            $this->chanListStr = implode(",", $this->chanList);
        }
    } 
    
    public function ClassicEPG($page = "1", $genre, $hour = ""){
        $this->GetNumPage();
        $this->chanOnList = 12;
        $this->GetChannelList( $page, $genre );
        $DB = new db();
        $chanEPG = $DB->sqlq("  SELECT sc.Name, cp.chanID, cp.id, cp.program, TIME(cp.startTime) as startTime , Time(cp.endTime) as endTime
                                FROM `EPG_ChanProgramm` AS `cp`
                                LEFT JOIN `SatChan` AS `sc` ON cp.chanID = sc.id 
                                WHERE DATE(cp.startTime) = CURDATE()
                                AND TIME(cp.startTime) <= CURTIME()
                                AND TIME(cp.endTime) > CURTIME()
                                AND sc.id IN($this->chanListStr)")->toArrayEx($tmp, "chanID");
        if ( $chanEPG){
            $i = 0;
            foreach($this->chanList as $key => $val){
                if ( $chanEPG[$val] ){
                    $program = $chanEPG[$val]['program']." (".substr($chanEPG[$val]['startTime'], 0, -3)." - ".substr($chanEPG[$val]['endTime'], 0, -3).")";
                    $arr[$i]['id'] = $chanEPG[$val]['chanID'].":".$chanEPG[$val]['id'];
                    $arr[$i]['clName'] = "cell";
                    $arr[$i]['width'] = "150";
                    $arr[$i]['title'] = str_replace("\"", "", $program);
                    $arr[$i]['onclick'] = "";
                    $arr[$i]['data'] = $this->chanNames[$key]; 
                    
                }
                else{
                    $program = "НЕТ ПРОГРАММЫ";
                    $arr[$i]['id'] = $val.":0";
                    $arr[$i]['clName'] = "cell";
                    $arr[$i]['width'] = "150";
                    $arr[$i]['title'] = str_replace("\"", "", $program);
                    $arr[$i]['onclick'] = "";
                    $arr[$i]['data'] = $this->chanNames[$key];
                }
                $i++;
            }
            $this->MakeHtmlClassic($arr);
            $this->html .= "\n<div id=\"num_page\" style=\"display: none;\" name=\"".$this->maxPage."\"></div>"; 
            print_r($this->html);
        }
        
        
    }
    
    public function ModernEPG( $page = "1", $genre, $hour = ""){
        $DB = new db();
        $this->chanOnList = 6;
        $this->GetChannelList( $page, $genre );
        
        $rusMonth = array(   '', 'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
                             'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря');
        $maxWidth = 600;
        $NameWidth = 150;
        $timeRange = 1.5*60*60;
        $class = "cell";
        
        $windowWidth = $maxWidth-$NameWidth;
        $pxHr = $windowWidth/$timeRange;
        // формируем временной интервал   
        $tmpMinute = 0;  //floor(date("i")/10)*10; 
        if  ($hour != "" ) $tmpHour = date("H") + $hour;
        else  $tmpHour =  date("H");
        if ((int)$tmpHour < 5 ) $tmpHour = 5;
        if ((int)$tmpHour > 23) $tmpHour = 23;
        $curTimeUnix = mktime($tmpHour, $tmpMinute, 0,  date("n"),  date("j"),  date("Y"));
        $stopTimeUnix = $curTimeUnix+$timeRange;
        $TimeHeadWidth = floor(30*60*$pxHr);
        $startHour = date("H", $curTimeUnix);
        
        $chanEPG = $DB->sqlq("  SELECT sc.Name, cp.chanID, cp.id, cp.program, UNIX_TIMESTAMP(cp.startTime) AS startTime, UNIX_TIMESTAMP(cp.endTime) AS endTime
                                FROM `EPG_ChanProgramm` AS `cp`
                                LEFT JOIN `SatChan` AS `sc` ON cp.chanID = sc.id 
                                WHERE DATE(cp.startTime) = CURDATE()
                                AND sc.id IN($this->chanListStr)")->toArray();
        if ( $chanEPG ){
            unset( $this->html );
            $arr[0]['clName'] = "cellName";
            $arr[0]['width'] = $NameWidth;
            $arr[0]['data'] = date("j ", $curTimeUnix).$rusMonth[date("n", $curTimeUnix)];         
            $arr[1]['clName'] = "cellHead";
            $arr[1]['width'] = $TimeHeadWidth;
            $arr[1]['data'] = date("H:i", $curTimeUnix);
            $arr[2]['clName'] = "cellHead";
            $arr[2]['width'] = $TimeHeadWidth;
            $arr[2]['data'] = date("H:i", ($curTimeUnix+(30*60)));
            $arr[3]['clName'] = "cellHead";
            $arr[3]['width'] = $TimeHeadWidth;
            $arr[3]['data'] = date("H:i", ($curTimeUnix+(60*60)));

            $this->MakeHtmlModern($arr);
            foreach( $chanEPG as $key => $val ){
                    $percent[$val['Name']]['chanID'] = $val['chanID'];
                    $percent[$val['Name']]['programID'][] = $val['id'];            
                    $percent[$val['Name']]['program'][] = $val['program'];
                    $percent[$val['Name']]['startTime'][] = $val['startTime'];
                    $percent[$val['Name']]['endTime'][] = $val['endTime'];
            }
            unset($arr);
            foreach ($percent as $key => $val){
                $arr[0]['clName'] = "cellName";
                $arr[0]['width'] = "150";
                $arr[0]['data'] = $key;
                                
                $j = 1;
                $sum = 0;
                for ( $i = 0; $i < sizeof($val['programID']); $i++){
                                       
                    if ($val['endTime'][$i] > $curTimeUnix && $val['startTime'][$i] <= $stopTimeUnix){
                        if ( $val['startTime'][$i] < $curTimeUnix) {
                            $from = $curTimeUnix;
                            //$class = "cellBefore";
                        }
                        else{
                            $from = $val['startTime'][$i];
                        }
                        if ( $val['endTime'][$i] > $stopTimeUnix ){
                            $to = $stopTimeUnix;
                            //$class="cellContin";
                        }
                        else{
                            $to = $val['endTime'][$i];
                        }
                        if ( $val['endTime'][$i] > $stopTimeUnix && $val['startTime'][$i] < $curTimeUnix ){
                            $to = $stopTimeUnix;
                            $from = $curTimeUnix;
                        }
                        $width = ceil(( $to-$from )*$pxHr);
                        $sum += $width;
                        if ( ($windowWidth - $sum) < 0 ) {
                            $sum -= $width;
                            $width += $windowWidth - $sum;
                            $sum += $width;
                        }
                        $bckg = "";
                        $program = $val['program'][$i];
                        $programFull = $program." (".date("H:i", $val['startTime'][$i])." - ".date("H:i", $val['endTime'][$i]).")";
                        $programFull = "Телеканал: <b>".$key."</b><br/>Телепрограмма: ".str_replace("\"", "", $programFull);
                        
                        $arr[$j]['clName'] = "cell";
                        $arr[$j]['width'] = $width;
                        $arr[$j]['title'] = $programFull;
                        $arr[$j]['onclick'] = "";
                        $arr[$j]['id'] = $val['chanID'].":".$val['programID'][$i];
                        $arr[$j]['data'] = $program; 
                        $j++;                      
                    }
                }
                $this->MakeHtmlModern($arr);
                unset($arr);
            }
            $this->html .= "<div id=\"num_page\" style=\"display: none;\" name=\"".$this->maxPage."\"></div>";         
            print_r($this->html);
        }
  
    }
    
    public function DetailedEPG( $page = "1", $chanID = 0, $date = "" ){
        $DB = new db();
        $this->GetDays();
        if ( $date == "" ) $date = date("w")*1;
        
        $sql = "    SELECT sc.Name, cp.chanID, cp.id, cp.program, TIME(cp.startTime) as startTime
                    FROM `EPG_ChanProgramm` AS `cp`
                    LEFT JOIN `SatChan` AS `sc` ON cp.chanID = sc.id 
                    WHERE DATE(cp.startTime) = '".$this->days[$date]."'";
        if ( $date == date("w") ) $sql .= " AND TIME(cp.endTime) > CURTIME()";
        $sql .=     "AND sc.id = $chanID";
        
        $progOnList = 7; 
        $progNum = $DB->sqlq($sql)->num_rows();
        $maxPage = ceil( $progNum/$progOnList);
          
        if ( $page > $maxPage ) $page = 1;
        if ( $page < 1 ) $page = $maxPage;
        $begin = ($page-1)*$progOnList;     
        $sql = "    SELECT sc.Name, cp.chanID, cp.id, cp.program, TIME(cp.startTime) as startTime
                    FROM `EPG_ChanProgramm` AS `cp`
                    LEFT JOIN `SatChan` AS `sc` ON cp.chanID = sc.id 
                    WHERE DATE(cp.startTime) = '".$this->days[$date]."'";
        if ( $date == date("w") ) $sql .= " AND TIME(cp.endTime) > CURTIME()";
        $sql .=     "AND sc.id = $chanID
                    LIMIT $begin, $progOnList";
        $chanEPG = $DB->sqlq($sql)->toArray();
        if ( $chanEPG ){
                $i = 0;
                foreach( $chanEPG as $key => $val ){
                    $program = str_replace("\"", "", $val['program']);
                    $programFull = "\n\t\t<div class=\"detailedTime\">".substr($val['startTime'], 0, -3)." </div>\n\t\t<div class=\"detailedProgram\"> ".$program."</div>";
                    $arr[$i]['id'] = $val['chanID'].":".$val['id'];
                    $arr[$i]['clName'] = "detailedRow";
                    $arr[$i]['width'] = "300";
                    $arr[$i]['title'] = $program;
                    $arr[$i]['onclick'] = "";
                    $arr[$i]['data'] = $programFull; 
                    $i++;
                }
                $this->MakeHtmlDetailed($arr);
                $this->html .= "<div id=\"info\" style=\"display: none;\" title=\"".$this->ParseDate( $this->days[$date] )."\" name=\"".$chanEPG[0]['Name']."\">".$maxPage."</div>"; 
                print_r($this->html);
        }
    }
    
    public function OldEPG( $data ){
        print_r($data);
    }
    
    private function MakeHtmlClassic( $data ){
        if ( is_array($data) ){
            $this->html = "";
            $this->html = "\n<ul id=\"chanList\">";
            foreach( $data as $key => $val ){
                ( isset($val['id']) ) ? $id = "id=\"".$val['id']."\"" : $id = "";
                ( isset($val['title']) ) ? $title = "title=\"".$val['title']."\"" : $title = "";
                ( isset($val['name']) ) ? $name = "name=\"".$val['name']."\"" : $name = "";
                ( isset($val['onclick'] )) ? $onclick = "onclick=\"\"" : $onclick = "";
                $this->html .= "\n\t<li $id class=\"".$val['clName']."\" $name $title $onclick >".$val['data']."</li>";
                if ($key % 2 != 0) $this->html .= "\n\t<div style=\"clear: left;\"></div>";
            }
            $this->html .= "\n</ul>";
        }
    }
    
    private function MakeHtmlModern( $data ){
        if ( is_array($data) ){
            foreach( $data as $key => $val){  
                if ( $key == "0" ){
                    $this->html .= "<div class=\"".$val['clName']."\">".$val['data']."</div>\n";
                }
                else{
                    ( isset($val['id']) ) ? $id = "id=\"".$val['id']."\"" : $id = "";
                    ( isset($val['title']) ) ? $title = "title=\"".$val['title']."\"" : $title = "";
                    ( isset($val['onclick'] )) ? $onclick = "onclick=\"\"" : $onclick = "";
                    $this->html .= "<div $id $onclick class=\"".$val['clName']."\" $title style=\"width: ".$val['width']."px;\">".$val['data']."</div>\n";
                }
            }
            $this->html .= "<div style=\"clear: left;\"></div>\n";
        }
    }
    
    private function MakeHtmlDetailed( $data ){
        if ( is_array($data) ){
            $this->html = "\n\t<ul id=\"detailed\">";
            foreach( $data as $key => $val ){
                ( isset($val['id']) ) ? $id = "id=\"".$val['id']."\"" : $id = "";
                ( isset($val['title']) ) ? $title = "title=\"".$val['title']."\"" : $title = "";
                ( isset($val['name']) ) ? $name = "name=\"".$val['name']."\"" : $name = "";
                ( isset($val['onclick'] )) ? $onclick = "onclick=\"\"" : $onclick = "";
                if ($key == 0){
                    ( isset($val['clName'] )) ? $class = "class=\"".$val['clName']."Active\"" : $class = "";
                }
                else{
                    ( isset($val['clName'] )) ? $class = "class=\"".$val['clName']."\"" : $class = "";
                }
                $this->html .= "\n\t\t<li $id $class $name $title $onclick >".$val['data']."\n\t\t</li>";
                
            }
            $this->html .= "\n\t</ul>\n";
        }
    }
    
    private function ParseDate( $date ){
        $rusMonth = array(  '', 'Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 
                            'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря');
        $tmp = explode("-", $date);
        $day = $tmp[2];
        $month = $rusMonth[($tmp[1]*1)];
        return $day." ".$month;
    }
}

?>