<?php
/**
 * @author Vladimir
 * @copyright 2010
 */
 
DEFINE ("HTML_DIR", "/opt/briz.ua/htdocs/stb/");
DEFINE ("LIB_DIR",HTML_DIR."lib/");
DEFINE ("SCRIPT_DIR", HTML_DIR."mag/epg/");
require_once(LIB_DIR."mysql.cl.php");
require_once(LIB_DIR."ssh.cl.php");
require_once(LIB_DIR."epg.cl.php");

    $output_type = 'html';

    if (isset($_REQUEST['output_type'])){
	$output_type = $_REQUEST['output_type'];
    }

    $EPG = new epg($output_type);
  
    if (isset($_POST['chanID'])){
        $ch = $_POST['chanID'];
		if (isset($_POST['method']) && $_POST['method'] == 'current'){
			echo $EPG->GetCurEPG($ch);
		} else {
			echo $EPG->ShowEPGFullEx($ch, $_POST['weekday']);
		}
        
        exit;
    } else if ( isset($_POST['simple']) ){
		$ch = $_POST['simple'];
		echo $EPG->ShowSimple($ch);
		exit;
	} else if (isset($_GET['channel'])){
        echo "<body style=\"background-color: black;\">";
        $ch = $_GET['channel'];
        echo $EPG->ShowEPGMenu($ch);
        echo $EPG->ShowEPG($ch);
        echo "</body>";
        exit;
    } else if (isset($_GET['anons'])){
        $EPG->ShowAnons( $_GET['anons'] );
    } else if (isset($_GET['curEpg'])){  
        $ch = html_entity_decode($_GET['curEpg']);
        echo $EPG->ShowCurEPG( $ch );
        exit;
    } if (isset($_GET['chanID'])){
        $ch = $_GET['chanID'];
        echo $EPG->ShowEPGFullEx($ch, $_GET['weekday']);
        exit;
    } else{ 
        echo $EPG->ShowEPGMenu();
    }
?>