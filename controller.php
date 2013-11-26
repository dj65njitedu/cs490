<?php
//Author: Desmond Johnson CS:490 Date: 10/12/13

$resultsArray = Array();
$dbServerAddress = 'http://web.njit.edu/~cem6/dblogin3.php';


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
			$url = $GLOBALS['dbServerAddress'].'?user='.$_POST['user'];
			//$url = $GLOBALS['dbServerAddress'].'?user=cem6';
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
	echo file_get_contents($GLOBALS['dbServerAddress'].'?method=checkRole&param1='.$param);
} 

function returnCourses(){
	echo file_get_contents($GLOBALS['dbServerAddress'].'?method=returnCourses');
}

function compiler($someCode){
	echo '<pre>'.str_replace("/afs/cad/u/d/j/dj65/public_html/cs490/output/sourceCode.java:","",shell_exec('java Compiler '.'\''.htmlDecoder($someCode).'\'')).'</pre>';
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

function getExamByID($ID){
	echo file_get_contents($GLOBALS['dbServerAddress'].'?method=getExamByID'.'&param1='.$ID);
}

function dateToMinutes($date){
	$minDiff = $date->format('i');
	$hourDiff = $date->format('H');
	$dayDiff = $date->format('d');
	$monthDiff = $date->format('m');
	$yearDiff = $date->format('Y');
	return ($date * 12 * 3600 * 30) + ($monthDiff * 3600 * 30) + ($dayDiff * 3600) + ($hourDiff * 60 )+ $minDiff;
}

function dateDiff($start, $end){
	$minDiff = ($end->format('i') - $start->format('i'));
	$hourDiff = ($end->format('H') - $start->format('H'));
	$dayDiff = ($end->format('d') - $start->format('d'));
	$monthDiff = ($end->format('m') - $start->format('m'));
	$yearDiff = ($end->format('Y') - $start->format('Y'));
	return ($yearDiff * 12 * 3600 * 30) + ($monthDiff * 3600 * 30) + ($dayDiff * 3600) + ($hourDiff * 60 )+ $minDiff;
}


///////////////////////////////////////
//functions for dblogin.php, to be copied and pasted directly there

function getQuestionsByCourse($param){
	//$param will be a number from 1 through 3
	$query = "SELECT DISTINCT qb.id, qb.question FROM CS_QUESTION_ANSWER_PAIRS qap, QUESTION_BANK qb, ANSWER_BANK ab WHERE qap.courseID = '".$param."' AND qap.id = qb.id";
	queryDB($query);
}



//////////////////////////////////////

?>