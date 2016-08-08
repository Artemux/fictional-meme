<?php
$query = "http://192.168.1.101/zyxel/load3.php?mac=".$_REQUEST['mac'].'&';
$fileName = date('Y-m') . '-access-iptv.log';

if ( isset($_GET['g']) && !is_array($_GET['g']) ){
    $query .= "g=".$_GET['g'].":".$_SERVER['REMOTE_ADDR'];
    $a = file_get_contents( html_entity_decode($query) );
    print_r($a);
}
else if ( isset($_GET['addFav']) && !is_array($_GET['addFav']) ){
    $query .= "addFav=".$_GET['addFav'].":".$_SERVER['REMOTE_ADDR'];
    $a = file_get_contents( html_entity_decode($query) );
    print_r($a);
}
else if ( isset($_GET['delFav']) && !is_array($_GET['delFav']) ){
    $query .= "delFav=".$_GET['delFav'].":".$_SERVER['REMOTE_ADDR'];
    $a = file_get_contents( html_entity_decode($query) );
    print_r($a);
}
else if ( isset($_GET['record']) && !is_array($_GET['record']) ){
    //$query = "http://172.17.24.13/test/timeshift.php?";
    //$act = "record=".$_GET['record']."$".$_GET['chanID']."$".$_SERVER['REMOTE_ADDR'];
    //$query .= $act;
    //if ( $_GET['record'] == 'start' ) $query .= "&startRecord=true";
    //else if ( $_GET['record'] == 'stop' ) $query .= "&stopRecord=true";
    //else $query .= "&getRecord=true";
    //$query .= "&chanID=".$_GET['chanID'].":".$_SERVER['REMOTE_ADDR'];
    //$a = file_get_contents( $query );
    //print_r($a);
} 

$file = fopen('../../logs/' . $fileName, "a+");

if ( $file ){
	fwrite($file, date("d-m-Y H:i:s")." ". $query . "\n");
	fclose($file);
}

?>