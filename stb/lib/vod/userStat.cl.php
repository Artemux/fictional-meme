<?php

/**
 * @author Vladimir
 * @copyright 2009
 */

class UserStat
{	
	public $setup;
	
	private $ip;
	private $watched;
	private $debug;
	
	public function __construct()
	{
		date_default_timezone_set('Europe/Helsinki');
		$this->ip = $_SERVER['REMOTE_ADDR'];
		if(isset($this->ip))
		{
            $DB = new db();
			$this->debug[] = date("d M y H:i:s")." - connect from ip ".$this->ip;
            $check = $DB->sqlq("    SELECT `id` FROM `VOD_UserStat` WHERE ip = '".$this->ip."'")->num_rows();
			if ($check!=0){
                $this->debug[] = date("d M y H:i:s")." - ".$this->ip." already in database";
                return true;
            }
            else{
				$this->debug[] = date("d M y H:i:s")." - ".$this->ip." not registered . Registration user STB";
                $DB->sqlq("INSERT INTO `VOD_UserStat` VALUES ('', '".$this->ip."', 19, 0, '', '', '1' )");
				$this->debug[] = date("d M y H:i:s")." - ".$this->ip." is now registering in database";
			}					
		}
		else return false;
	}
	
	public function Destroy()
	{
		unset($this->ip);
		unset($this->watched);
		unset($this->debug);
	}
		
	public function WatchNow($string)
	{
		if (isset($string))
		{
            $DB = new db();
			$time=time();
			$string = (string) $string;
			$string = htmlspecialchars($string);
            $DB->sqlq(" UPDATE `VOD_UserStat` SET `watchnow` = '".$string."', `time` = '".$time."' 
                        WHERE `ip` = '".$this->ip."' AND `status` = 1 LIMIT 1;");
			$DB->sqlq("UPDATE `VOD_FilmBase` SET `counter` = `counter`+1 WHERE `filename` = '".$string."';");
		}
		else 
		{
			$this->debug[] = date("d M y H:i:s")." - ".$this->ip." send incorrect querry for WatchNow() function";
		}
	}
	
	public function WatchEnd(){
        $DB = new db();
        $DB->sqlq(" UPDATE `VOD_UserStat` SET `watchnow` = '', `time` = '' 
                    WHERE `ip` = '".$this->ip."' AND `status` = 1 LIMIT 1;");
	}
	
	public function UpdateUserInfo($watched)
	{
        $DB = new db();
        $watch = $DB->sqlq("SELECT `watched` FROM `VOD_UserStat` WHERE `ip` = '".$this->ip."' LIMIT 1")->toArray();
		if( $watch ){
			if( isset($watch[0]['watched']) ){
				$string = (string) $watch[0]['watched'];
                $filmID = $DB->sqlq("SELECT `id` FROM `VOD_FilmBase` WHERE `filename` = '".$watched."'")->toArray();			
				if ($filmID){
					if ($string != NULL)
					{
						$stringCheck = explode(',',$string);
						$i=0;
						$trigger="false";
						while ( $i<count( $stringCheck ) ){
							if($stringCheck[$i] == $filmID[0]['id']){
								$temp = $stringCheck[$i];
								break;
							}	
								$i++;
						}
						if ( !isset($temp) && $filmID[0]['id'] != '' ){
							$string .= ','.$filmID[0]['id'];
							$this->debug[] = date("d M y H:i:s")." - string for update ".$string;
                            $DB->sqlq("UPDATE `VOD_UserStat` SET `watched` = '".$string."', `watchnow` = '', time='0' WHERE ip='".$this->ip."' LIMIT 1;");
							$this->debug[] = date("d M y H:i:s")." - Updated watched film \"".$watched."\" for ".$this->ip;
							return true;
						}
						else
						{
							$this->debug[] = date("d M y H:i:s")." - Film \"".$watched."\" already watched from ".$this->ip;
							return false;
						}
					}
					else 
					{
						$this->debug[] = date("d M y H:i:s")." - ".$this->ip." never watched any film";
						$DB->sqlq("UPDATE `VOD_UserStat` SET watched='".$filmID[0]['id']."', watchnow='' WHERE ip='".$this->ip."' LIMIT 1;");
					}
				}			
			}
		}
	}
	
	public function Debug()
	{
        for($i=0;$i<sizeof($this->debug);$i++)  echo "DATABASE: ".$this->debug[$i]."\n";
    } 	
}

?>