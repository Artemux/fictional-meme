<?php

/**
 * @author Vladimir
 * @copyright 2010
 */

DEFINE ("DEBUG", false); 
DEFINE ("HTML_DIR", "/www/server/");
DEFINE ("LIB_DIR",HTML_DIR."lib/");
DEFINE ("SCRIPT_DIR", HTML_DIR."lib/admin/");
DEFINE ("VOD_DIR", "/vod_new/");
DEFINE ("VOD_HTML_DIR", HTML_DIR."script/vod_new/");

require_once(LIB_DIR."mysql.cl.php");

$DB = new db();

if (isset($_GET['getNews']) && !is_array($_GET['getNews'])){
	$UserIP = sprintf("%u", ip2long($_SERVER['REMOTE_ADDR']));
	$watchedNews = array();
	$back_news = array();
	
	$DB->sqlq("SELECT *, UNIX_TIMESTAMP(`ExpiredDate`) AS `expDate` FROM `STB_News` WHERE `ToUser` IN (0,'".$UserIP."') ORDER BY `id` DESC")->toArrayEx($news, "id");
	$DB->sqlq("SELECT * FROM `STB_News_watched` WHERE `UserIP`='".$UserIP."'")->toArrayEx($watchedNews, "NewsID");
	
	if (sizeof($news) > 0){
		// убираем все новости которые истекли по ExpireDate
		foreach($news as $key => $val){
			if ($val['expDate'] < time() && $val['ToUser'] != 0){
				unset($news[$key]);
			}; 
		}	
		$back_news = $news;

		// убираем все просмотренные текущим IP новости
		if (sizeof($watchedNews) >= 1){
			$watchedIDs = array_keys($watchedNews);
			foreach($watchedIDs as $key => $val){
				if (isset($news[$val])){
					unset($news[$val]);
				}	
			}
		}

		if ($_GET['getNews'] == 'new'){
			if (sizeof($news) >= 1){
				$keys = array_keys($news);
				print_r(htmlspecialchars_decode($news[$keys[0]]['Message']));
				$DB->sqlq("	INSERT INTO `STB_News_watched` (`id`, `NewsID`, `UserIP`, `Date`)
							VALUES (NULL, '".$keys[0]."', '".$UserIP."', CURRENT_TIMESTAMP);");
			} else {
				if (sizeof($back_news) > 0){
					$keys = array_keys($back_news);
					print_r(htmlspecialchars_decode($back_news[$keys[0]]['Message']));
				}
			}
		} else {
			if (sizeof($news) >= 1){
				echo "1"; // есть новые новости
			} else {
				echo "0"; // нет новых новостей
			}
		}
	}
}

?>