<?php

/**
 * @author Vladimir
 * @copyright 2010
 */

//print_r($_SERVER);
header("Content-type:text/html");
header("charset:UTF-8");

if ($_POST['getNews'] && !is_array($_POST['getNews'])){
    $fileName = "visitors.txt";
    $newsFile = "news.txt";
    if (!file_exists($fileName)) {
        $file = fopen($fileName,"w");
        fwrite($file, "//Список пользователей прочитавших новость\n");
        fclose($file);
    }
    $file = file_get_contents($fileName);
    if (!strstr($file, (string)$_SERVER['REMOTE_ADDR'])) {
        if ($_POST['getNews'] == 'new'){
            $file = fopen($fileName,"a+");
            fwrite($file, "\n".$_SERVER['REMOTE_ADDR']);
            fclose($file);  
            if (file_exists($newsFile)) {
                $news = file_get_contents($newsFile);
                echo $news;
            }
            else return;
        }
        else echo "1"; 		// do not watch the news
    }
    else {
	if ($_POST['getNews'] == 'new'){
	    if (file_exists($newsFile)){
		$news = file_get_contents($newsFile);
		echo $news;
	    }
	}
	else echo "-1";
    }; 				// allready watched
}

?>