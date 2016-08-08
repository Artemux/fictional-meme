<?php

/**
 * @author Vladimir
 * @copyright 2010
 */

class epg{

    public $fileName;

	public $output_type = 'html';
	
    private $accName;
    private $accPassword;
    private $curDate;
    private $debug;

	private $max_el = 16;
	private $max_el_per_page = 16;
    private $main_width;
    private $main_height;
    private $text_color;
    private $background_color;
    private $border;
    private $overflow;
    private $main_dir;
    private $mppl;
	private $db_name = 'stb_admin';

    //смена названий для нашей сети
    public $searchChNames = Array(      "Fashion TV Россия",
                                        "&nbsp;","Fox Crime Россия","Fox Life Россия","TV1000 East",
                                        "Viasat Explorer","Viasat History","Viasat Sport Россия",
                                        "5 канал (Россия)","Украинский бизнес канал (UBC)", "Культура (Украина)",
                                        "Первый канал (Россия)", "СТС", "5 Канал Украина (+3)",
                                        "ТВ Центр", "Культура", "Вести", "НСТ (Смешное)",
                                        "РБК ТВ", "CNN", "World Fashion Channel Россия",
                                        "NBA TV (НТВ+)", "НТВ+ ", "TV1000 Action East",
                                        "Кинопоказ HD1", "Союз (Екатеринбург)", "Sci-Fi Россия",
                                        "Universal Россия", "ТВ3 Россия", "24 (Телеканал новостей 24)",
                                        "Hallmark Россия", "MGM International", "Наше новое кино",
                                        "Zone Romantica", "Animal planet Россия", "Nat Geo Wild Россия",
                                        "National Geographic Россия", "Discovery Travel & Living",
                                        "VH1 Classic Europe", "OTV", "Extreme sports",
                                        "Discovery Россия");

    public $newChNames = Array(         "Fashion TV",
                                        "-","Fox Crime","Fox Life","TV1000",
                                        "Explorer", "History", "Via Спорт",
                                        "5 Канал Украина", "UBC", "Культура Украина",
                                        "Первый канал", "СТС Москва", "5 Канал СПБ",
                                        "ТВ Центр Москва", "Культура Россия", "Вести Россия", "НСТ",
                                        "РБК Москва", "CNN International", "World Fashion",
                                        "NBA TV", "", "TV1000 Action",
                                        "Кинопоказ HD", "Союз", "Sci Fi",
                                        "Universal", "ТВ3", "NEWS 24",
                                        "Hallmark", "MGM Channel", "Новое Кино",
                                        "Зона Романтики", "Animal Planet", "Nat Geo Wild",
                                        "National Geo", "Discovery Travel",
                                        "VH1 Classic", "OTV Музыка", "Спорт Extreme",
                                        "Discovery Russia");

    public function __construct($anOutputType = 'html'){
        @chdir(SCRIPT_DIR);
        //set_time_limit(0);
        //date_default_timezone_set("Europe/Kiev");
        if (file_exists("config.conf")){
            $config = parse_ini_file("./config.conf");          // считываем файл с настройками
            $this->accName = urlencode($config['login']);       // устанвливаем логин преобразуя его в URL совместимую кодировку
            $this->accPassword = urlencode($config['password']);
            $this->main_width = (int)$config['main_width'];
            $this->main_height = (int)$config['main_height'];
            $this->text_color = (string)$config['text_color'];
            $this->background_color = (string)$config['background_color'];
            $this->border = (int)$config['border'];
            $this->overflow = (int)$config['overflow'];
            $this->main_dir = (string)$config['main_dir'];
            $this->mppl = (int)$config['mppl'];
        }
        else{
            echo date("d-M-Y H:i:s")." - EPG - no config.conf in main directory. Exit.";
            exit;
        }
		
		$this->output_type = $anOutputType;
    }

    public function __destruct(){

    }

	public function set_max_el( $num ){
		$this->max_el = $num;
	}

	public function searchChannel( $str ){
		$DB = new db("stb_admin");
		$chanArr = $DB->sqlq("	SELECT DISTINCT sc.id, sc.Name FROM `EPG_ChanProgramm` as epg
								LEFT JOIN `SatChan` as sc ON sc.id = epg.ChanID
								WHERE sc.Name LIKE '%" . $str . "%'
								ORDER BY sc.Name ASC")->toArray();

		$channels = array();
		foreach ($chanArr as $key => $val) {
			$curProgram = $this->GetCurEPG($val['id']);
			$channels[] = array('id'=>$val['id'], 'Name' => $val['Name'], 'Program' => $curProgram);
		}

		
		
		return $channels;
		
	}

	public function getChannels(){
		$DB = new db("stb_admin");
		$chanArr = $DB->sqlq("	SELECT DISTINCT sc.id, sc.Name FROM `EPG_ChanProgramm` as epg
								LEFT JOIN `SatChan` as sc ON sc.id = epg.ChanID")->toArray();
		foreach ($chanArr as $key => $val) {
			$curProgram = $this->GetCurEPG($val['id']);
			$channels[] = array('id'=>$val['id'], 'Name' => $val['Name'], 'Program' => $curProgram);
		}
		
		return $channels;
		
	}

    public function ParseEPGData( $date = "" ){
        $DB = new db("epg");

        if ($date == "") $date = date("Y-m-d");             // если не указана дата устанавливаем на текущую
        $epgFileName =  "./epgArchive/".$date.".epg";
        echo date("d-M-Y H:i:s")." - EPG - Parsing EPG from downloaded page";
        $epgFile = file_get_contents($epgFileName);

        //находим названия каналов
        preg_match_all("/class=\"channeltitle\">([\w|\W|\d|\D]+?)\<\/td\>/", $epgFile, $channelsName);
        $dataSize = sizeof( $channelsName[1] );
        for ( $i = 0; $i < $dataSize; $i++ ){
            $channels[$i]['name'] = strip_tags($channelsName[1][$i]);    //записываем в массивв Channels названия каналов
        }

        //находим рассписание телепередач
        preg_match_all("/\<div id=\"schedule_container\" style=\"width:\d{1,3}px\">([\w|\W|\d|\D]+?)\<\/div\>\<div class=\"[\w]+?\"\>\<\/div\>/", $epgFile, $epgData);
        for ($i = 0; $i<$dataSize; $i++){
            preg_match_all("/\<div class=\"time\">(\d\d:\d\d)<\/div\><div class=\"prname2\">([\w|\W|\d|\D]+?)\<\/div\>/", $epgData[1][$i], $epg);
            for ($j = 0; $j < sizeof($epg[1]); $j++ ){
                $channels[$i]['time'][$epg[1][$j]] = strip_tags($epg[2][$j]);      //   записываем в массивв Channels epg данные для каждого канала
            }
        }
        $channelList = "";
        $counter = 0;
        $dataSize = sizeof($channels);
        for ($i = 0; $i < $dataSize; $i++){
            $counter++;
            $search = Array("/", "\"", "?", ".");
            $replace = Array("-", "`", "", " ");
            $channels[$i]['name'] = str_replace($search, $replace, $channels[$i]['name']);
            $channels[$i]['name'] = $this->Utf8ToWin(str_replace($this->searchChNames, $this->newChNames, $this->win2utf($channels[$i]['name'])));
            $file = $channels[$i]['name'];
            $search = Array("я", "+", "-");
            $replace = Array("а", "plus", "minus");
            $file = str_replace($search, $replace, $this->win2utf($file));
            //$DB->sqlq("INSERT INTO `channels` ( `id`, `chanName`) VALUES ('', '".$file."')");
            $chanID = $DB->sqlq("SELECT `id` FROM `channels` WHERE `chanName`='".$file."'")->toArray();
            if ($chanID){
                foreach($channels[$i]['time'] as $key => $value){
                    $time = $date." ".$key.":00";
                    $DB->sqlq(" INSERT INTO `channelEPG` ( `id` , `chanID` , `time` , `program` , `comment` )
                                VALUES ('', '".$chanID[0]['id']."', '".$time."', '".$this->win2utf($value)."', 'generating by server')");
                }
            }
        }
        echo "Done\n".date("d-M-Y H:i:s")." - EPG - Saved ".$counter." files.\n";
    }

    public function LoadEPG4week(){
        ob_implicit_flush();
        $week = Array();
        $week = $this->MakeWeekDays();

        $size = sizeof($week);
        for ($i = 0; $i < $size; $i++){
            $this->ParseEPGData($week[$i]);
            //$this->LoadEPG($week[$i]);
        }
    }

    public function LoadEPG( $date = "" ) {
        if ($date == "") $date = date("Y-m-d"); // если не указана дата устанавливаем на текущую
        $target_url = "http://www.vsetv.com/login.php";
        $post = "inlogin=".$this->accName."&inpassword=".$this->accPassword."&login.x=26&login.y=12&returntopage=/index.php";
        $this->setCurl( $target_url, $post );
        $this->debug[] = "create epg file. STATUS: ";
        $target_url = "http://www.vsetv.com/schedule_package_personal_day_".$date."_ft_all.html";
        echo date("d-M-Y H:i:s")." - EPG - Loading EPG from url ".$target_url;
        $parse = $this->setCurl( $target_url, 0 );
        if ($parse) {
            $file = fopen("./epgArchive/".$date.".epg", "w");
            fwrite($file, $parse);
            fclose($file);
            $this->debug[] = "SUCCESS. File created: ".$date.".epg\n";
            echo " SUCCESS\n";
            $this->ParseEPGData($date);
            return 1;
        }
        else {
            $this->debug[] = "FAILED\n";
            echo "FAILED\n";
            return 0;
        }
    }

    public function ShowEPGMenu( $chanID ){
        $DB = new db($this->db_name);
        $DB->sqlq(" SELECT DISTINCT sc.id, sc.Name FROM SatChan AS sc
                    INNER JOIN EPG_ChanProgramm AS cp ON sc.id=cp.chanID
                    WHERE 1")->toArray($channels);
        $menu = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">';
        $menu .= "</head><body>";
        $menu .= "\t<form action=\"index.php\" method=\"GET\">\n";
        $menu .= "\t\t<select name=\"channel\">\n";
        //sort($channels[0]);
        $count = 0;
        foreach($channels as $key => $val){
            $count++;
            $txt = $count.". ".$val['Name']."[".$val['id']."]";
            if ( $chanID == $val['id'] ){
                $menu .= "\t\t\t<option value=\"".$val['id']."\" selected=\"selected\">".$txt."</option>\n";
            }
            else{
                $menu .= "\t\t\t<option value=\"".$val['id']."\">".$txt."</option>\n";
            }
        }
        $menu .= "\t\t</select>\n";
        $menu .= "\t\t<input type=\"submit\"/>\n\t</form>\n";
        $menu .= "</body></html>";
        return $menu;
    }



    public function ShowEPG( $chanID = "" ){
        if ($chanID != ""){
            $DB = new db($this->db_name);
            $DB->sqlq(" SELECT TIME(a.startTime) as time, a.program, b.Name
                        FROM `EPG_ChanProgramm` AS a
                        INNER JOIN SatChan AS b ON a.chanID=b.id
                        WHERE b.id = '".$chanID."'
                        AND TIME(endTime) > CURTIME()
                        AND CURDATE() = DATE(a.startTime)")->toArray($chanEPG);
			
            if ($chanEPG){
				
				if ($this->output_type == 'json'){
					return json_encode($chanEPG);
				}
				
                $chanName = $chanEPG[0]['Name'];
                $html =  "\t<div style=\"width: ".$this->main_width."px;\">\n";
                $html .= "\t\t<div style=\" font-size: 20px; text-align: center;\"><b>\"".$chanName."\"</b></div>\n";
                $html .= "\t\t<div style=\"width: ".$this->main_width."px;text-align: center;\">телепрограмма на <b>".date("Y-m-d")."</b></div>\n";
                $html .= "\t</div>\n";
                $html .= "\t<div style=\"font-family:  Tahoma,Verdana,sans-serif;font-size: 18px; width: ".$this->main_width."px; height: ".$this->main_height."px; border: ".$this->border."px solid black; color: white; overflow: hidden;\">\n";
                $html .= "\t\t<div id=\"text\">\n";
                $html .= "\t\t\t<div>\n";

                foreach($chanEPG as $key => $value){
                    if ( $key == "0" ){
                        $html .= "\t\t\t\t<div style=\"background-color: #FFCC99;\"><b><font color=\"#111111\">".substr($value['time'],0,-3)."</font> - <font color=\"#111111\">".$value['program']."</font></b></div>\n";
                    }
                    else{
                        $html .= "\t\t\t\t<b><font color=\"#BB0000\">".substr($value['time'],0,-3)."</font> - <font color=\"white\">".$value['program']."</font></b><br/>\n";
                    }
                }
                $html .= "\t\t\t</div>\n\t\t</div>\n\t</div>\n";
                return $html;
            }
            else return 0;//$html="No EPG available for $channel channel";
        }
    }

	public function ShowEPGFullEx ( $chanID = "", $weekday = "" ){
		if ($chanID != ""){
			$DB = new db($this->db_name);
			
			$week = $this->MakeWeekDays();
			if ($weekday != 0){
				$weekday = $weekday-1;
			} else {
				$weekday = 6;
			}

			$sql = " 	SELECT TIME(a.startTime) as time, a.program, b.Name
                        FROM `EPG_ChanProgramm` AS a
                        INNER JOIN SatChan AS b ON a.chanID=b.id
                        WHERE b.id = '".$chanID."' ";
			if ( $weekday === '' || ($weekday+1) == date('N')){
				$sql .= " 	
							AND CURDATE() = DATE(a.startTime) ";

			} else {
				$sql .= " AND '" . $week[$weekday] . "' = DATE(a.startTime) ";
			}

			$DB->sqlq($sql)->toArray($chanEPG);

            if ($chanEPG){
				
				if ($this->output_type == 'json'){
					return json_encode($chanEPG);
				}
				
            	$chanName = $chanEPG[0]['Name'];
				$html_header = '<div class="chan-header">';
				$html_header .= '<div class="chan-date">'. $this->getDateName($week[$weekday]) . "&nbsp;" . $this->getWeekDayName($weekday) . '</div>';
				$html_header .= '<div class="chan-name">Телеканал: "' . $chanName . '"</div>';
				
				$html_header .= '</div>';
				
				$num = 0;
				$pages = 1;
				$el_nums = sizeof($chanEPG);
				if ($el_nums > $this->max_el_per_page){
					$this->max_el = round($el_nums/2);
				} else {
					$this->max_el = $el_nums;
				}
				
				if ( $el_nums >= $this->max_el ) $pages = 2;
				$html_content = '<div class="chan-content">';
				for( $j = 1; $j <= $pages; $j++ ){
					$html_content .= '<div class="shedule-container">';
					$s = ($j - 1) * $this->max_el;
					for ( $i = $s; $i < $this->max_el*$j; $i++){
						if ( isset($chanEPG[$i]) ){
							//echo $chanEPG[$i]['time'];
							( $i == 0) ? $class = "cur_time" : $class="time";
							$html_content .= '<div class="time">' . substr($chanEPG[$i]['time'],0,-3) . '</div>';
							$html_content .= '<div class="programm">' . $chanEPG[$i]['program'] . '</div>';
						}
					}
					$html_content .= '</div>';
				}
				$html_content .= '</div>';
				$html_nav = '
					<div class="nav-container">
						<div class="nav">
							<div class="left"><img src="./images/ArrowLeft.png" alt=""/></div>
							<div class="right"><img src="./images/ArrowRight.png" alt=""/></div>
							<div class="content">кнопка <strong>EPG</strong> - закрыть</div>
						</div>
					</div>';

				$html = '<div class="epg">' . $html_header . $html_content . $html_nav . "</div>";
				return $html;
			} else {
				return 0;
			}
		}
	}
	
	public function GetCurEPG( $chanID = "" ){
        $DB = new db($this->db_name);
        if ($chanID != ""){

			$DB->sqlq(" SELECT TIME(a.startTime) as startTime, a.program, TIME(a.endTime) as endTime
                        FROM `EPG_ChanProgramm` AS a
                        INNER JOIN SatChan AS b ON a.chanID=b.id
                        WHERE b.id = '".$chanID."'
                        AND UNIX_TIMESTAMP(a.endTime) >= UNIX_TIMESTAMP(NOW())
                        LIMIT 1")->toArray($chanEPG);
			$html = "";
			
			if ($this->output_type == 'json'){
				return json_encode($chanEPG);
			}
			
            if ($chanEPG){
                foreach($chanEPG as $key => $value){
					$program['start'] = substr($value['startTime'],0,-3);
					$program['end'] = substr($value['endTime'],0,-3);
					$shortText = $value['program'];
					
					$program['text'] = $shortText;
                }
				
                if (isset($program['text'])) $html = json_encode($program);
                
            }
			
			return $html;
        }
    }
	
    public function ShowCurEPG( $chanID = "" ){
        $DB = new db($this->db_name);
        if ($chanID != ""){

			$DB->sqlq(" SELECT TIME(a.startTime) as time, a.program, TIME(a.endTime) as endTime
                        FROM `EPG_ChanProgramm` AS a
                        INNER JOIN SatChan AS b ON a.chanID=b.id
                        WHERE b.id = '".$chanID."'
                        AND UNIX_TIMESTAMP(a.endTime) >= UNIX_TIMESTAMP(NOW())
                        LIMIT 2")->toArray($chanEPG);

            if ($chanEPG){
				
				if ($this->output_type == 'json'){
					return json_encode($chanEPG);
				}
				
                foreach($chanEPG as $key => $value){
                      $time[] = substr($value['time'],0,-3); // убираем заначения секунд
					  $endTime[] = substr($value['endTime'],0,-3); // убираем заначения секунд
                      $program[] = $value['program'];
                }
                header("Cache-Control: no-cache, must-revalidate");
                header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
                $html = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">';
                $html .= "</head><body>";
                $html .= "<div id=content>";
				/*
                if (isset($time[0])) $html .= "<div style=\"font-size: 18px;height: 26px; overflow: hidden;\">&nbsp;<b><span style=\"background-color:#bb0000; color: white; padding: 0 4px;\">".$time[0]."</span> - ".$program[0]."</b></div>\n";
                if (isset($time[1])) $html .= "<div style=\"\"><b><font color=\"white\">&nbsp;&nbsp;&nbsp;".$time[1]."</font> - ".$program[1]."</b></div>\n";
                $html .= "</div>";
                $html .= "<script>parent.OnloadIframe(window)</script></body></html>";
				*/
				$html .= '<div class="program-container">';
				if (isset($time[0])) $html .= "<div class=\"start green\">".$time[0]."</div><div class=\"program\"> ".$program[0]."</div>";
				$html .= '</div>';
				$html .= '<div class="program-container">';
                if (isset($time[1])) $html .= "<div class=\"start orange\">".$time[1]."</div><div class=\"program\"> ".$program[1]."</div>";
				$html .= '</div>';
                $html .= "</div>";
                $html .= "<script>parent.OnloadIframe(window)</script></body></html>";
				
                return $html;
            }
        }
    }
	public function ShowSimple($chanID = "" ){
        $DB = new db($this->db_name);
		
        if ($chanID != ""){

			$DB->sqlq(" SELECT TIME(a.startTime) as time, a.program, TIME(a.endTime) as endTime
                        FROM `EPG_ChanProgramm` AS a
                        INNER JOIN SatChan AS b ON a.chanID=b.id
                        WHERE b.id = '".$chanID."'
                        AND UNIX_TIMESTAMP(a.endTime) >= UNIX_TIMESTAMP(NOW())
                        LIMIT 2")->toArray($chanEPG);

            if ($chanEPG){
				$out = array();
				
                foreach($chanEPG as $key => $value){
                      $time[] = substr($value['time'],0,-3); // убираем заначения секунд
					  $endTime[] = substr($value['endTime'],0,-3); // убираем заначения секунд
                      $program[] = $value['program'];
                }

                
            } else {
				$chanEPG = 0;
			}
			
			return json_encode($chanEPG);
        }
    }
	
  public function ShowCurEPGTest( $chanID = "" ){
        $DB = new db($this->db_name);
        if ($chanID != ""){

             $DB->sqlq(" SELECT UNIX_TIMESTAMP(a.startTime) as unixtime, UNIX_TIMESTAMP(NOW()) as current, TIME(a.startTime) as time, a.program
                        FROM `EPG_ChanProgramm` AS a
                        INNER JOIN SatChan AS b ON a.chanID=b.id
                        WHERE b.id = '".$chanID."'
                        AND UNIX_TIMESTAMP(a.endTime) >= UNIX_TIMESTAMP(NOW())
                        LIMIT 2")->toArray($chanEPG);

			print_r($chanEPG);

            if ($chanEPG){
                foreach($chanEPG as $key => $value){
                      $time[] = substr($value['time'],0,-3); // убираем заначения секунд
                      $program[] = $value['program'];
                }
                header("Cache-Control: no-cache, must-revalidate");
                header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
                $html = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">';
                $html .= "</head><body>";
                $html .= "<div id=content>";
                if (isset($time[0])) $html .= "<div style=\"font-size: 18px;height: 26px; overflow: hidden;\">&nbsp;<b><span style=\"background-color:#bb0000; color: white; padding: 0 4px;\">".$time[0]."</span> - ".$program[0]."</b></div>\n";
                if (isset($time[1])) $html .= "<div style=\"\"><b><font color=\"white\">&nbsp;&nbsp;&nbsp;".$time[1]."</font> - ".$program[1]."</b></div>\n";
                $html .= "</div>";
                $html .= "<script>parent.OnloadIframe(window)</script></body></html>";
                return $html;
            }
        }
    }
    public function ShowAnons( $page = "1" ){
        $DB = new db();
        $rusMonth = array(   '', 'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
                             'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря');
        $chanOnList = 10;
        $maxWidth = 700;
        $NameWidth = 150;
        $windowWidth = $maxWidth-$NameWidth;
        $timeRange = 3*60*60;
        $pxHr = $windowWidth/$timeRange;

        if ( $page < 0 ) $page = 1;
        $fromChan = $chanOnList*$page - $chanOnList;

        // формируем временной интервал
        $curTimeUnix = mktime(date("H"), 0, 0,  date("n"),  date("j"),  date("Y"));
        $stopTimeUnix = $curTimeUnix+(3*60*60);
        $TimeHeadWidth = floor(1*60*60*$pxHr);
        $startHour = date("H", $curTimeUnix);
        $chanEPG = $DB->sqlq("  SELECT sc.Name, cp.program, UNIX_TIMESTAMP(cp.startTime) AS startTime, UNIX_TIMESTAMP(cp.endTime) AS endTime
                                FROM `EPG_ChanProgramm` AS `cp`
                                LEFT JOIN `SatChan` AS `sc` ON cp.chanID = sc.id
                                WHERE UNIX_TIMESTAMP(cp.startTime) BETWEEN ".($curTimeUnix-(1*60*60))." AND ".$stopTimeUnix."
                                AND DATE(cp.startTime) = CURDATE()
                                LIMIT 100")->toArray();
        $html = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">';
        $html .= "</head><body>";
        $html .= "<div class=\"EPG_container\" style=\"display: block; width: ".$maxWidth."px; height:500px; position: relative; overflow: hidden;\">
                    <div id=\"EPG_Anons\" style=\"width: 1600px; height:500px; position: relative; overflow: hidden;\">";
        $html .= "
                        <div class=\"cell1\" style=\"text-align: center; display: table-cell; width: 150px;\">Name</div>
                        <div class=\"cell1\" style=\"text-align: center; border: 1px solid black; display: table-cell; width: ".$TimeHeadWidth."px;\">".date("H:i - j ", $curTimeUnix).$rusMonth[date("n", $curTimeUnix)]."</div>
                        <div class=\"cell2\" style=\"text-align: center; border: 1px solid black; display: table-cell; width: ".$TimeHeadWidth."px;\">".date("H:i - j ", ($curTimeUnix+(1*60*60))).$rusMonth[date("n", ($curTimeUnix+(1*60*60)))]."</div>
                        <div class=\"cell3\" style=\"text-align: center; border: 1px solid black; display: table-cell; width: ".$TimeHeadWidth."px;\">".date("H:i - j ", ($curTimeUnix+(2*60*60))).$rusMonth[date("n", ($curTimeUnix+(2*60*60)))]."</div>
                        <div style=\"height: 0px;\"></div>\n";
        //print_r($chanEPG);
        foreach( $chanEPG as $key => $val ){
            $percent[$val['Name']]['time'][] = $val['endTime']-$val['startTime'];
            $percent[$val['Name']]['program'][] = $val['program'];
            $percent[$val['Name']]['startTime'][] = $val['startTime'];
            $percent[$val['Name']]['endTime'][] = $val['endTime'];
        }
        echo $pxHr;
        //print_r($percent);
        foreach ($percent as $key => $val){
            $html .= "<div class=\"cell1\" style=\"text-align: center; display: table-cell; width: 150px;\">$key</div>\n";

            for ( $i = 0; $i < sizeof($val['time']); $i++){
                if ($val['endTime'][$i] > $curTimeUnix && $val['startTime'][$i] < $stopTimeUnix){
                    ( $val['startTime'][$i] < $curTimeUnix ) ? $from = $curTimeUnix : $from = $val['startTime'][$i];
                    ( $val['endTime'][$i] > $stopTimeUnix ) ? $to = $stopTimeUnix : $to = $val['endTime'][$i];

                    $width = floor(( $to-$from )*$pxHr);
                    $color = rand(111111,888888);
                    $program = $val['program'][$i]." (".date("H:i", $val['startTime'][$i])." - ".date("H:i", $val['endTime'][$i]).")";
                    $program = str_replace("\"", "", $program);
                    $html .= "<div class=\"cell\" title=\"".$program."\" style=\"text-align: center; border: 1px solid black; background-color: #$color; overflow: hidden; display: table-cell; width: ".$width."px;\"></div>\n";
                }
            }

            $html.= "<div style=\"height: 0px;\"></div>\n";
        }
        $html .= "  </div>\n";
        // формируем список каналов для анонса

        print_r($html);
    }

	public function ExportXML($chanID){
		
		$DB = new db($this->db_name);
        if ($chanID != ""){

             $DB->sqlq(" SELECT UNIX_TIMESTAMP(a.startTime) as unixtime, UNIX_TIMESTAMP(NOW()) as current, TIME(a.startTime) as time, a.program
                        FROM `EPG_ChanProgramm` AS a
                        INNER JOIN SatChan AS b ON a.chanID=b.id
                        WHERE b.id = '".$chanID."'
                        AND UNIX_TIMESTAMP(a.endTime) >= UNIX_TIMESTAMP(NOW())
                        LIMIT 2")->toArray($chanEPG);

			print_r($chanEPG);

            if ($chanEPG){
                foreach($chanEPG as $key => $value){
                      $time[] = substr($value['time'],0,-3); // убираем заначения секунд
                      $program[] = $value['program'];
                }
                header("Cache-Control: no-cache, must-revalidate");
                header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
                $html = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">';
                $html .= "</head><body>";
                $html .= "<div id=content>";
                if (isset($time[0])) $html .= "<div style=\"font-size: 18px;height: 26px; overflow: hidden;\">&nbsp;<b><span style=\"background-color:#bb0000; color: white; padding: 0 4px;\">".$time[0]."</span> - ".$program[0]."</b></div>\n";
                if (isset($time[1])) $html .= "<div style=\"\"><b><font color=\"white\">&nbsp;&nbsp;&nbsp;".$time[1]."</font> - ".$program[1]."</b></div>\n";
                $html .= "</div>";
                $html .= "<script>parent.OnloadIframe(window)</script></body></html>";
                return $html;
            }
        }
		
	}

    private function ShowNowPosition( $timeArr, $hour="" ){
        /**
         * определяем какая телепередача транслируется в данное время,
         * $timeArr - массив значений времени на весь день для конкретного канала
         * $hour - установка определенного часа для поиска (по-умолчанию, берем текущее время)
         * возвращает ближайшее значение времени в формате ч:м (9:30)
         */

        if (is_array($timeArr)){
            $pos = -1;
            $curM = date("i");
            ($hour == "") ? $curH = date("H") : $curH = $hour;
            $s = sizeof($timeArr);
            $time = array();
            for ($i = 0; $i < $s; $i++){
                $arr = explode(":", $timeArr[$i]);
                $time[$arr[0]][] = $arr[1];
            }
            if (isset($time[$curH])){
                if ($curH != date("H")) $pos = sizeof($time[$curH])-1;// если телепередача началась часом ранее значит берем последнее значение времени в минутах
                else{
                    if (sizeof($time[$curH]) > 1){ # если в одном часу больше одной телепередачи

                        if ($curM > $time[$curH][0]){

                            # если текущая минута больше минуты первой телепередачи,
                            # тогда находим индекс текущей телепередачи.

                            foreach ($time[$curH] as $key => $val){
                                if ($curM >= $val) $pos = (int)$key;
                            }
                        }
                        else {

                            # если тек. минута меньше минуты первой телепередачи данного часа,
                            # тогда ищем последнюю передачу прошлого часа.

                            if ($curH > 0) $curH = $curH - 1;
                            if ($curH < 10) $curH = (string)"0".$curH;
                            return $this->ShowNowPosition($timeArr, $curH);
                        }
                    }
                    else { # если в одном часу  одна телепередача
                        if ($curM > $time[$curH][0]) $pos=0;
                        else {

                            # если тек. минута меньше минуты первой телепередачи данного часа,
                            # тогда ищем ближайщую передачу прошлого часа

                            if ($curH > 0) $curH = $curH - 1;
                            if ($curH < 10) $curH = (string)"0".$curH;
                            return $this->ShowNowPosition($timeArr, $curH);
                        }
                    }
                }
                    return $curProg = $curH.":".$time[$curH][$pos];
            }
            else {  # если в данном часе нет передач, тогда ищем их в прошлом часу
                if ($curH > 0) $curH = $curH - 1;
                if ($curH < 10) $curH = (string)"0".$curH;
                return $this->ShowNowPosition($timeArr, $curH);
            }
        }
    }

	private function ellipsize($str, $max_length, $position = 1, $ellipsis = '&hellip;')
	{
		// Strip tags
		$str = trim(strip_tags($str));

		// Is the string long enough to ellipsize?
		if (strlen($str) <= $max_length)
		{
			return $str;
		}

		$beg = substr($str, 0, floor($max_length * $position));

		$position = ($position > 1) ? 1 : $position;

		if ($position === 1)
		{
			$end = substr($str, 0, -($max_length - strlen($beg)));
		}
		else
		{
			$end = substr($str, -($max_length - strlen($beg)));
		}

		return $beg.$ellipsis.$end;
	}

	public function MakeWeekDays(){
		/*
         *  Создает массив календарной недели.
         *  Начиная с понедельника
         */
		 
		$week = Array();
		$curDayWeek = (int) date('w') - 1;
		$unixtimeMonday = strtotime("-{$curDayWeek} days");
		for ($i = 0; $i<7; $i++){
			$week[$i] = date('Y-m-d', strtotime("+{$i} days", $unixtimeMonday));
		}
		return $week;
	}

	private function getWeekDayName( $weekday = '' ){

		$weekdayNames = array( "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье");

		if ( is_numeric($weekday) ){
			if (($weekday) == (date('N')-1)){
				return 'Сегодня';
			} else {
				return $weekdayNames[$weekday];
			}
		} else {
			return $weekdayNames[date('N')-1];
		}

	}

	private function getMonthName( $num ){

		$monthArray = array("", "Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря");

		if (is_numeric($num)){
			return $monthArray[$num];
		}
		return FALSE;
	}

	private function getDateName( $date_str = false ){
		if ( $date_str ){
			$t = explode('-', $date_str);
			return ($t[2]*1). ' ' . $this->getMonthName($t[1]*1);
		}

		return FALSE;
	}

    private function setCurl( $target_url, $post ) {
        $ch = curl_init();
        $userAgent = "User-Agent: Mozilla/5.0 (Windows; U; Windows NT 5.1; ru; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6 (.NET CLR 3.5.30729)";
        $cookie = dirname(__FILE__).'/cookie.txt';
        curl_setopt($ch, CURLOPT_USERAGENT, $userAgent);
        curl_setopt($ch, CURLOPT_URL,$target_url);
        curl_setopt($ch, CURLOPT_FAILONERROR, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER,true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 100);
        curl_setopt($ch, CURLOPT_COOKIEFILE, $cookie);
        curl_setopt($ch, CURLOPT_COOKIEJAR, $cookie);
        $html = curl_exec($ch);
        if (!$html) {
            echo "<br />cURL error number:" .curl_errno($ch);
            echo "<br />cURL error:" . curl_error($ch);
            exit;
        }
        else return $html;
    }

    private function win2utf( $s ){
        for($i=0, $m=strlen($s); $i<$m; $i++){
            $c=ord($s[$i]);
            if ($c<=127) {$t.=chr($c); continue; }
            if ($c>=192 && $c<=207)    {$t.=chr(208).chr($c-48); continue; }
            if ($c>=208 && $c<=239) {$t.=chr(208).chr($c-48); continue; }
            if ($c>=240 && $c<=255) {$t.=chr(209).chr($c-112); continue; }
            if ($c==184) { $t.=chr(208).chr(181); continue; };
            if ($c==168) { $t.=chr(208).chr(129);  continue; };
            //if ($c==184) { $t.=chr(209).chr(145); continue; }; #ё
            if ($c==168) { $t.=chr(208).chr(129); continue; }; #Ё
            if ($c==179) { $t.=chr(209).chr(150); continue; }; #і
            if ($c==178) { $t.=chr(208).chr(134); continue; }; #І
            if ($c==191) { $t.=chr(209).chr(151); continue; }; #ї
            if ($c==175) { $t.=chr(208).chr(135); continue; }; #ї
            if ($c==186) { $t.=chr(209).chr(148); continue; }; #є
            if ($c==170) { $t.=chr(208).chr(132); continue; }; #Є
            if ($c==180) { $t.=chr(210).chr(145); continue; }; #ґ
            if ($c==165) { $t.=chr(210).chr(144); continue; }; #Ґ
            //if ($c==184) { $t.=chr(209).chr(145); continue; }; #Ґ
        }
        return $t;
    }

    public function Utf8ToWin( $fcontents ) {
        $out = $c1 = '';
        $byte2 = false;
        for ($c = 0;$c < strlen($fcontents);$c++) {
            $i = ord($fcontents[$c]);
            if ($i <= 127) {
                $out .= $fcontents[$c];
            }
            if ($byte2) {
                $new_c2 = ($c1 & 3) * 64 + ($i & 63);
                $new_c1 = ($c1 >> 2) & 5;
                $new_i = $new_c1 * 256 + $new_c2;
                if ($new_i == 1025) {
                    $out_i = 168;
                } else {
                    if ($new_i == 1105) {
                        $out_i = 184;
                    } else {
                        $out_i = $new_i - 848;
                    }
                }
                // UKRAINIAN fix
                switch ($out_i){
                    case 262: $out_i=179;break;// і
                    case 182: $out_i=178;break;// І
                    case 260: $out_i=186;break;// є
                    case 180: $out_i=170;break;// Є
                    case 263: $out_i=191;break;// ї
                    case 183: $out_i=175;break;// Ї
                    case 321: $out_i=180;break;// ґ
                    case 320: $out_i=165;break;// Ґ
		    case 184: $out_i=229;break;// ё
                }
                $out .= chr($out_i);

                $byte2 = false;
            }
            if ( ( $i >> 5) == 6) {
                $c1 = $i;
                $byte2 = true;
            }
        }
        return $out;
    }

    public function Debug() {
	    $file = fopen("epg.log","a+");
        for($i=0;$i<sizeof($this->debug);$i++) {
            $string = $this->curDate.": EPG GENERATOR: ".$this->debug[$i]."<br/>\n";
        }
        fwrite($file, $string);
		fclose($file);
    }
}

?>