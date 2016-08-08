<?php
    $znaki = Array(     "aries", "taurus", "gemini", "cancer", "lion", "virgo", 
                        "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces");
                        
    echo '
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>	
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <meta http-equiv="Content-Language" content="ru"/>
        <meta http-equiv="Pragma" content="no-cache"/>
        
        <script type="text/javascript" src="./js_lib/jquery-1.5.min.js"></script>
		<script type="text/javascript" src="./js_lib/MagApi.js"></script> 
        <script type="text/javascript" src="./js_lib/goroskop.js"></script>
        <script type="text/javascript" src="./js_lib/clock.js"></script>
        <link rel="stylesheet" type="text/css" href="../css/main.css" />
</head>
<body>
    <div class="top">
        <div class="system">
				<div id="left">
					11:30
					<br/>
					<span>12 сентября 2012</span>
				</div><i>&nbsp;</i>
        </div>
        <div class="main" style="height: 520px;padding-top: 30px;color: white; font-size: 14px;">
            <div style="top: 130px; width: 700px; text-align: center; font-size: 28px; position: fixed;">ГОРОСКОП НА СЕГОДНЯ</div>';
    $goroskop = unserialize(file_get_contents("http://192.168.1.100/dlink2/data/goroskop.txt"));
    if ($goroskop == "") return 0;
    
    $imageurl = "./plugins/goroskop/clipart/";
    
    echo"
                <div id=\"line\" style=\"height: 230px; top: 190px;\"></div>
                <div id=\"goroskop_main\" style=\" left: 30px;top:77px; position:  relative; overflow: hidden; width: 660px; height: 300px; \">
                    <div id=\"goroskop_block\" style=\"margin-top: 35px; margin-left: 30px; position: relative; width: 660px; height: 2000px;\">";   
    foreach($znaki as $key=>$val){
        ( $key == 0 ) ? $class = "goroskopBodyActive" : $class = "goroskopBody"; 
               
        echo "
                        <div id=\"cur\" class=\"$class\" align=\"center\">
                            <span style=\"font-size: 24px;\"><b>".$goroskop[$val]['rusName']."</b></span><br/>
                            ".$goroskop[$val]['goroskop']."<br/>
                        </div>"; 
         }      
    echo '
                    </div>
                </div>           
                <div id="back_button" style="width: 221px; margin-top: 130px;"><img src="../images/button_back.png"/></div>        
            </div>
        
    <div class="bottom">
        <p></p>
    </div>
</body>
</html>';

?>