<?php
DEFINE ("DEBUG", false); 
DEFINE ("HTML_DIR", "/www/server/");
DEFINE ("LIB_DIR",HTML_DIR."lib/");
DEFINE ("SCRIPT_DIR", HTML_DIR."lib/admin/");

require_once(LIB_DIR."mysql.cl.php");
$DB = new db();

require_once("vod_film.php");
require_once("../DAO.cl.php");
$DAO = new dao();

$a = $DAO->Object("vod_film", $DB);//->getById("19");
$a->filename = "NochVMuzee2";
//$a->image="sdfs";
//$a->Update();
$a->Insert();
//print_r($a);
?>