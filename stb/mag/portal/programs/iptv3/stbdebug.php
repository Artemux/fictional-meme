<?php
function sqlq($queryz){
    global $link,$server,$user,$password,$db;
    if($link){
        $result=mysql_query($queryz);	
    } 
    else{
        $link = mysql_connect('localhost','cms_admin','dHj6tbZy5mvq5nNW');
        mysql_select_db("cms", $link) || die("Couldn't open db: $db. Error if any was: ".mysql_error() );
		mysql_query("SET NAMES 'utf8';",$link);
		mysql_query("SET CHARACTER SET 'utf8';",$link);
		mysql_query("SET SESSION collation_connection = 'utf8_general_ci';",$link);
        $result=mysql_query($queryz, $link) or die("MySQL query $query failed.  Error if any: ".mysql_error());
    }
    return $result;
}
/*
INSERT INTO  `billing`.`DisconnectMcastLog` (
`id` ,
`ChanID` ,
`Mac` ,
`IP` ,
`Time` ,
`CreateDate`
)
VALUES (
NULL ,  '1',  '00-00-00-00-00-00',  '172.17.23.13', 
CURRENT_TIMESTAMP , 
CURRENT_TIMESTAMP
)
*/
if ( isset($_GET['chanID']) ){
	$sql = sqlq("INSERT INTO  `cms`.`DisconnectMcastLog` (`id`, `ChanID`, `Mac`, `IP`, `Time`, `CreateDate`) 
					VALUES ( NULL, '".$_GET['chanID']."',  '".$_GET['mac']."', '".$_GET['ip']."', '".date('Y-m-d H-i-s',$_GET['time'])."', CURRENT_TIMESTAMP)");
}     

?>