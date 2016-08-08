<?php
/**
 *      30.04.2010
  *     плагин для STB для просмотра новостей с rss ленты
  *     rss можно брать с удаленного сайта, либо из файла на сервере
  *
  */
    echo '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <meta http-equiv="Content-Language" content="ru"/>
        <meta http-equiv="Pragma" content="no-cache"/>
        <script type="text/javascript" src="../js_lib/MagApi.js"></script>
		<script type="text/javascript" src="../js_lib/jquery-1.5.min.js"></script>

    	<script type="text/javascript" src="../js_lib/clock.js"></script>
		<script type="text/javascript" src="../js_lib/weather-widget.js"></script>
    	<script type="text/javascript" src="./js/Menu.js"></script>

		<script type="text/javascript" src="./js/init.js"></script>

        <link rel="stylesheet" type="text/css" href="./css/style.css" />
</head>
<body>
    <div class="wrapper">
		<div id="header">
				<div id="left">
					<div class="image">
						<img src="./images/clock-v2.png" alt=""></img>
					</div>

					<div class="clock">
						11:30
						<br/>
						<span>12 сентября 2012</span>
					</div>
				</div>
				<div id="right"><img width="75px" src="../images/weather/_0_sun.png" alt="" />
					<div class="temp">
						+10
					</div>
				</div>
			</div><!-- #header-->
		<div id="content">
            <div class="title">НОВОСТИ</div>
			<div class="main">
            	<div id="playlist_block">
                	<div id="playlist">';

    $rss = simplexml_load_file("http://192.168.1.100/dlink2/data/podrobnosti_all.rss");
    $size = sizeof($rss->channel->item);
    echo "\n\t\t\t<ul class=\"dailyNews\">";
    if (isset($_GET['type'])){
        unset($category);
        $size = sizeof($rss->channel->item);
        for ( $i = 0; $i < $size; $i++){
            $el = (string) $rss->channel->item[$i]->category;
            $category[$el] += 1;
        }

        foreach ($category as $key => $value){
            echo "\n\t\t\t\t<li id=\"".$key."\" class=\"dailyNewsBlock\" onclick=\"LoadCategory()\">";
            echo $key." [$value]";
            echo "</li>";
        }
    }
    else if (isset($_GET['debug'])){
        $rss = simplexml_load_file("http://192.168.1.100/dlink2/data/bbc_ukraine.rss");
        $size = sizeof($rss->entry);
        for ( $i = 0; $i < $size; $i++){
                echo "\n\t\t\t\t<li id=\"".$i."\" class=\"dailyNewsBlock\">";
                $time = preg_match("/(\d\d:\d\d):\d\d/", $rss->entry[$i]->published, $matches);
                echo $matches[1]."&nbsp&nbsp<strong>".$rss->entry[$i]->title."</strong>";

                $descr = trim(preg_replace("/\<img .+? \/\>/", "", $rss->entry[$i]->summary));
                echo "<div class=\"description\" style=\"display: none;\">".$descr."</div>";

                echo "</li>";
        }
    }
    else if (isset($_GET['category']) || $size > 0 ){ // Правка для вывода всех новостей (с) Дельцов В.С. 23-10-15
        //$size = sizeof($rss->channel->item);
        for ( $i = 0; $i < $size; $i++){
            $el = (string) $rss->channel->item[$i]->category;
            //if (trim($el) == $_GET['category']){
                echo "\n\t\t\t\t<li name=\"".$rss->channel->item[$i]->link."\" id=\"".$i."\" class=\"dailyNewsBlock\">";
                $time = preg_match("/(\d\d:\d\d):\d\d/", $rss->channel->item[$i]->pubDate, $matches);
                echo $matches[1]."&nbsp&nbsp<strong>".$rss->channel->item[$i]->title."</strong>";

                $descr = trim(preg_replace("/\<img .+? \/\>/", "", $rss->channel->item[$i]->description));
                echo "<div class=\"description\" style=\"display: none;\">".$descr."</div>";

                echo "</li>";
            //}
        }
    }
    else {
        unset($category);
        $size = sizeof($rss->channel->item);
        for ( $i = 0; $i < $size; $i++){
            $el = (string) $rss->channel->item[$i]->category;
            if (isset($el)){
				$category[$el] += 1;
			}
        }
        foreach ($category as $key => $value){
            echo "\n\t\t\t<li name=\"\" id=\"".$key."\" class=\"dailyNewsBlock\" onclick=\"LoadCategory()\">";
            echo $key." [$value]";
            echo "</li>";
        }
    }
    echo "\n\t\t\t</ul>";
    echo '
                	</div>
				</div>
            </div>
        </div>

      </div>

</body>
</html>';

?>
