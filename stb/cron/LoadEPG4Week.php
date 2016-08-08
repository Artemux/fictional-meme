#!/usr/local/bin/php
<?php
/**
 * @author Vladimir
 * @copyright 2010
 */
 
DEFINE ("HTML_DIR", "/opt/briz.ua/htdocs/stb/");
DEFINE ("LIB_DIR",HTML_DIR."lib/");
DEFINE ("SCRIPT_DIR", HTML_DIR."mag/epg/");
DEFINE ("EPG_DATA_DIR", "http://192.168.1.100/dlink2/data/");
require_once(LIB_DIR."mysql.cl.php");
require_once(LIB_DIR."ssh.cl.php");

class epg{
    
    public $fileName;
    
    private $accName;
    private $accPassword;
    private $curDate;
    private $debug;
    
    private $main_width;
    private $main_height;
    private $text_color;
    private $background_color;
    private $border;
    private $overflow;
    private $main_dir;
    private $mppl;
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

    public function __construct(){ 
        $this->TruncateOldEpg();
        $this->accName = urlencode("MarkAvrelii");       // устанвливаем логин преобразуя его в URL совместимую кодировку
        $this->accPassword = urlencode("03101984");
    }
    
    public function __destruct(){
        
    }
    
    private function TruncateOldEpg(){
        $DB = new db("stb_admin");
        $DB->sqlq("TRUNCATE TABLE `EPG_ChanProgramm`");
    } 
    public function ParseEPGData( $date = "" ){
        $DB = new db("stb_admin");
        if ($date == "") $date = date("Y-m-d");             // если не указана дата устанавливаем на текущую
        $epgFileName =  EPG_DATA_DIR."epgArchive/".$date.".epg";
        echo date("d-M-Y H:i:s")." - EPG - Parsing EPG from downloaded page ".$epgFileName;
        $epgFile = file_get_contents($epgFileName);
		
		$rename = $DB->sqlq("SELECT `Name`, `NameEPG` FROM `SatChan` WHERE `NameEPG` != ''")->toArray();
		foreach ($rename as $key => $val) {
			$dbNames[$val['NameEPG']] = $val['Name'];
		}
		
 		//находим полную информацию о EPG
		preg_match_all("/<div class=\"chname\">([\w|\W|\d|\D]+?<\/div><div class=\"(clearshed|clear)\"><\/div>)/", $epgFile, $channelData);
		if ($channelData){
			for( $i = 0; $i < sizeof( $channelData[1] ); $i++){
				preg_match_all("/class=\"channeltitle\">([\w|\W|\d|\D]+?)\<\/td\>/", $channelData[1][$i], $channelsName);
				$channels[$i]['name'] = strip_tags($channelsName[1][0]);
				
				preg_match_all("/<div id=\"schedule_container\" style=\"width:\d{1,3}px\">([\w|\W|\d|\D]+?)<\/div><div class=\"(clearshed|clear)\"><\/div>/", $channelData[1][$i], $epgData);

		        preg_match_all("/\<div class=\"\w{0,8}time\">(\d\d:\d\d)<\/div\><div class=\"\w{0,4}prname2\">([\w|\W|\d|\D]+?)\<\/div\>/", $epgData[1][0], $epg);

				for ($j = 0; $j < sizeof($epg[1]); $j++ ){
					$channels[$i]['time'][$j]['startProgram'] = $epg[1][$j];
					if ( isset($epg[1][$j+1]) ) {
						$channels[$i]['time'][$j]['stopProgram'] = $epg[1][$j+1];
					} else {
						$channels[$i]['time'][$j]['stopProgram'] = '04:59';
					}
					$channels[$i]['time'][$j]['program'] = strip_tags($epg[2][$j]);      //   записываем в массивв Channels epg данные для каждого канала
				}
			}
		}    
		
        $channelList = "";
        $counter = 0;
        $dataSize = sizeof($channels);
        for ($i = 0; $i < $dataSize; $i++){
            $search = Array("/", "\"", "?", ".");
            $replace = Array("-", "`", "", " ");
			
            $channels[$i]['name'] = $this->win2utf($channels[$i]['name']);
            if ( isset($dbNames[$channels[$i]['name']]) ){
            	$channels[$i]['name'] = $dbNames[$channels[$i]['name']];
            }
            $file = $channels[$i]['name'];          
            
            $chanID = $DB->sqlq("SELECT `id` FROM `SatChan` WHERE `Name`='".$file."'")->toArray();
			 
            if ( $chanID ){
                $counter++;
                foreach($channels[$i]['time'] as $key => $value){
					
					$startHour = explode(":", $value['startProgram']);
					if ( $startHour[0] < 5){
						$dateNext = date("Y-m-d" ,strtotime('+1 days' ,strtotime($date)));
						$startTime = $dateNext." ".$value['startProgram'].":00";
						if ( isset( $value['stopProgram'] ) ) $stopTime = $dateNext." ".$value['stopProgram'].":00";
					} else {
						$startTime = $date." ".$value['startProgram'].":00";
						if ( isset( $value['stopProgram'] ) ) {
							$stopHour = explode(":", $value['stopProgram']);
							if ( $stopHour[0] < 5){
								$dateNext = date("Y-m-d" ,strtotime('+1 days' ,strtotime($date)));
								$stopTime = $dateNext." ".$value['stopProgram'].":00";
							} else {
								$stopTime = $date." ".$value['stopProgram'].":00";
							}
							
						}
					}

					//echo $chanID[0]['id'] . " INSERT INTO `EPG_ChanProgramm` ( `id` , `chanID` , `startTime`, `endTime`, `program` , `comment` ) VALUES ('', '".$chanID[0]['id']."', '".$startTime."', '".$stopTime."', '".$this->win2utf($value['program'])."', 'generating by server')\n";
					
					$DB->sqlq(" INSERT INTO `EPG_ChanProgramm` ( `id` , `chanID` , `startTime`, `endTime`, `program` , `comment` )
                                VALUES ('', '".$chanID[0]['id']."', '".$startTime."', '".$stopTime."', '".$this->win2utf($value['program'])."', 'generating by server')");
                }
            }
        }
        echo " Done\n".date("d-M-Y H:i:s")." - EPG - Parsing TV programs for  ".$counter." channels.\n";
    }
	
    public function LoadEPG4week(){
        set_time_limit(0);
        ob_implicit_flush();
        $week = Array();
        $week = $this->MakeWeekDays();
        
        $size = sizeof($week);
        for ($i = 0; $i < $size; $i++){
            $this->ParseEPGData($week[$i]);
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
            $file = fopen(SCRIPT_DIR."epgArchive/".$date.".epg", "w");
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

    public function MakeWeekDays(){
        /*
         *  Создает массив календарной недели.
         *  Начиная с понедельника
         */
		 
		$week = Array();
		if ( date('w') > 0){
			$curDay = date('w');
		} else {
			$curDay = 7;
		}
		$curDayWeek = (int) $curDay - 1;
		$unixtimeMonday = strtotime("-{$curDayWeek} days");
		for ($i = 0; $i<7; $i++){
			$week[$i] = date('Y-m-d', strtotime("+{$i} days", $unixtimeMonday));
		}
		return (array) $week;
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
        $t = "";
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

$EPG = new epg();
//$EPG->ParseEPGData();
$EPG->LoadEPG4week();

//$EPG->ParseEPGData('2013-04-18');

?>