<?php
$query = "http://192.168.1.101/interface.php?";
$fileName = date('Y-m') . '-access.log';

	$query .= $_SERVER['QUERY_STRING']."&ip=".$_SERVER['REMOTE_ADDR'];
    $a = file_get_contents( html_entity_decode($query) );
	
	$file = fopen('logs/' . $fileName, "a+");
	
	if ( $file ){
		fwrite($file, date("d-m-Y H:i:s")." ". $query . " : " . $a . "\n");
		fclose($file);
	}
	
    print_r($a);

?>