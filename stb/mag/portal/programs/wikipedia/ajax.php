<?
require_once('wiky.inc.php');

if (isset($_GET['search'])){

	$wiki_data = get_wiki($_GET['search']);
	
	foreach ($wiki_data as $data)
	{
		
		$array[] = (string)$data->Text;
		//echo "<input type='radio' name='wiki_url'  size='30' value='".(string)$data->Url."'> ";
		//echo (string)$data->Text."  <a href='".(string)$data->Url."' target='_blank' title='".htmlspecialchars((string)$data->Description)."'><b>URL</b></a><br>"; 
	}
	echo json_encode($array);
	
} 
else if(isset($_GET['get_page']))
{
	$str = str_replace(' ', '_', $_GET['get_page']);
	$html = setCurl('http://ru.m.wikipedia.org/wiki/'.urlencode($str));
	echo $html;
}

function setCurl( $target_url ) {
	$ch = curl_init();
	$userAgent = "User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.97 Safari/537.11";
	curl_setopt($ch, CURLOPT_USERAGENT, $userAgent);
	curl_setopt($ch, CURLOPT_URL,$target_url);
	curl_setopt($ch, CURLOPT_FAILONERROR, true);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
	curl_setopt($ch, CURLOPT_POST, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER,true);
	curl_setopt($ch, CURLOPT_TIMEOUT, 100);
	$html = curl_exec($ch);
	if (!$html) {
		echo "<br />cURL error number:" .curl_errno($ch);
		echo "<br />cURL error:" . curl_error($ch);
		exit;
		} 
	else return $html;
}

function get_wiki($title, $page = FALSE)
{

	if (!$page){
		$url = "http://ru.wikipedia.org/w/api.php?action=opensearch&limit=15&namespace=0&format=xml&search=".urlencode($title);
		} else {
		$url = "http://ru.wikipedia.org/w/api.php?format=xml&action=query&titles=".urlencode($title)."&prop=revisions&rvprop=content";
	}

	$xml = simplexml_load_file($url, "SimpleXMLElement",LIBXML_NOCDATA);
	
	if (!$page){
		return $xml->Section->Item;
	} else {
		return $xml->query->pages->page->revisions->rev;
	}

}

?>