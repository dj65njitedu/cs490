<?php
//Author: Desmond Johnson CS:490 Date: 10/12/13

$resultsArray = Array();

if(isset($_GET['method'])){	
	$method = $_GET['method'];
	$method($_GET['param1'],$_GET['param2'],$_GET['param3'],$_GET['param4'],$_GET['param5'],$_GET['param6'],$_GET['param7'],$_GET['param8'],$_GET['param9'],$_GET['param10'],$_GET['param11'],$_GET['param12'],$_GET['param13'],$_GET['param14'],$_GET['param15'],$_GET['param16'],$_GET['param17'],$_GET['param18'],$_GET['param19'],$_GET['param20'],$_GET['param21'],$_GET['param22'],$_GET['param23'],$_GET['param24']);
}

if((isset($_POST['user'])) && (isset($_POST['pwd'])) )
{	
		$uname = 'CN='.$_POST['user'].',CN=Users,DC=academic,DC=campus,DC=njit,DC=edu';
		$ldapconn = ldap_connect("njitdm.campus.njit.edu");
		$ldapbind = ldap_bind($ldapconn, $uname, $_POST['pwd']);
		

		$resultsArray['loginStatus'] = ""; 
		
		if ($ldapbind) {
			$url = 'http://web.njit.edu/~cem6/dblogin.php?user='.$_POST['user'];
			//$url = 'http://web.njit.edu/~cem6/dblogin.php?user=cem6';
			$postdata = $_POST;
			$c = curl_init();
			curl_setopt($c, CURLOPT_HTTPHEADER, array('Content-Type' => 'text/plain'));
			curl_setopt($c, CURLOPT_URL, $url);
			curl_setopt($c, CURLOPT_POST, true);
			curl_setopt($c, CURLOPT_RETURNTRANSFER, true);
			curl_setopt($c, CURLOPT_POSTFIELDS,$postdata);
			$result = curl_exec ($c);
			curl_close ($c);
			

			
			if(strlen($result) > 4){
				$jsonToPHPArrayResults = json_decode($result,true);
				//echo print_r($jsonToPHPArray);
				//echo $jsonToPHPArray[0]['username']; 
				//print_r($jsonToPHPArray);
				$resultsArray['loginStatus'] = 'inDB';
				$resultsArray['data'] = $jsonToPHPArrayResults;
				//$resultsArray['count'] = print_r(($result));
				//$resultsArray['count'] = strlen($result);
			}
			else{
				$resultsArray['loginStatus'] = 'notInDB';

			}
			
		} else {
			$resultsArray['loginStatus'] = 'fail';

		}
		print json_encode($resultsArray);
}
else
{
	
}

//Test function
function printMessage(){
	echo "printMessage function just ran";
}

//Test function
function writeMessage(){
	echo "writeMessage function just ran";
}

//Test function
function newMessage($param){
	echo $param;
}

//Test function
function someMadeUpMethod($param){
	echo $param;
}

function getUserRole($param){
	echo file_get_contents('http://web.njit.edu/~cem6/dblogin.php?method=checkRole&param1='.$param);
} 

function returnCourses(){
	echo file_get_contents('http://web.njit.edu/~cem6/dblogin.php?method=returnCourses');
}

function compiler($someCode){
	echo '<pre>'.shell_exec('java Compiler '.'\''.htmlDecoder($someCode).'\'').'</pre>';
	//echo htmlDecoder($someCode);
	//echo "<br><br>".str_replace("djkgivmmlfm","^",str_replace("^"," ",str_replace("_"," ",str_replace(" ", "+",$someCode))));
	//echo "<br><br>".$someCode;
}

function runCode($param){
	//echo 
	echo compiler($_POST['code']);
}

function htmlDecoder($someString){
	return rawurldecode(str_replace("djkgivmmlfm","^",str_replace("^"," ",str_replace("_"," ",str_replace(" ", "+",$someString)))));
}

?>