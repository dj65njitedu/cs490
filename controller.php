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

function getExamsForStudent($param){
	echo file_get_contents($GLOBALS['dbServerAddress'].'?method=getExamsForStudent'.'&param1='.$param);
}

function getStudentExamByID($ID){
	echo file_get_contents($GLOBALS['dbServerAddress'].'?method=getStudentExamByID'.'&param1='.$ID);
}

function dateToMinutes($Date){
	$format = 'Y-m-d H:i:s';
	$date = DateTime::createFromFormat($format,$Date);
	$min = $date->format('i');
	$hour = $date->format('H');
	$day = $date->format('d');
	$month = $date->format('m');
	$year = $date->format('Y');
	return ($year * 12 * 30 * 24 * 60) + ($month * 30 * 24 * 60) + ($day * 24 * 60) + ($hour * 60 )+ $min;
}


//$query = SELECT id, prof_exams_ID, studentID, starttime, endtime FROM STUDENT_EXAMS WHERE prof_exams_ID = (someIDParam);
//function name = 'getExamByID';
function takeExamByID($ID, $username){
	$examInfoResult = file_get_contents('http://web.njit.edu/~dj65/cs490/dblogin3.php?method=getProfExamByID&param1='.$ID);
	if(strlen($examInfoResult) > 4){
		$timeOverStatement = 300;
		$jsonToPHPArrayResults = json_decode($examInfoResult,true);
		$examOpenDate =  dateToMinutes($jsonToPHPArrayResults[0]['examopentime']);
		$examCloseDate =  dateToMinutes($jsonToPHPArrayResults[0]['examclosetime']);
		$examDuration =  (dateToMinutes('0000-00-00 '.$jsonToPHPArrayResults[0]['examduration']))/60;
		$currentTime =  dateToMinutes(date("Y-m-d H:i:s")) - $timeOverStatement;
		//echo "examOpenDate: $examOpenDate <br> examCloseDate: $examCloseDate <br> examDuration: $examDuration <br> currentTime: $currentTime<br>";
		//echo  (dateToMinutes(date("Y-m-d H:i:s")) -  dateToMinutes('2013-11-27 21:30:00'));

		if ($currentTime < $examCloseDate){
				//echo "Your exam will expire in ".($examCloseDate - $currentTime)." minutes";
				$studentExamInfoResult = file_get_contents('http://web.njit.edu/~dj65/cs490/dblogin3.php?method=getStudentExamByID&param1='.$ID.'&param2='.$username);
				if(strlen($studentExamInfoResult) > 4){
					$jsonResult = json_decode($studentExamInfoResult,true);
					//return all of the questions for that exam
					//return all of the answers that they previously answered 
					//echo $jsonResult[0]['endtime'];
					if(isset($jsonResult[0]['endtime'])){
						echo 'ended';
					}else{
						echo file_get_contents('http://web.njit.edu/~dj65/cs490/dblogin3.php?method=getStudentExamAndAnswersByID&param1='.$ID.'&param2='.$username);
					}
				}
				else{
					
					//return all of the questions for that exam
					echo file_get_contents('http://web.njit.edu/~dj65/cs490/dblogin3.php?method=getProfExamQuestions&param1='.$ID.'&param2='.$username);	
					$userID = getIDFromUsername($username);
					file_get_contents('http://web.njit.edu/~dj65/cs490/dblogin3.php?method=insertStudentExamIntialRecord&param1='.$ID.'&param2='.$userID);

					//Start a record for that exam
					//Insert into(prof_exams_ID, studentID,startTime) into STUDENT_EXAMS VALUES (prof_exams_IDVariable, studentIDVariable,startTimeVariable);
				}
			}
			else{
				echo "expired";
			}
				
				
				
	}else{
		echo 'error';
	}
	
}

function getIDFromUsername($username){
	$result = file_get_contents('http://web.njit.edu/~dj65/cs490/dblogin3.php?method=getIDFromUsername&param1='.$username);
	$jsonToPHPArrayResults = json_decode($result,true);
	return $jsonToPHPArrayResults[0]['id'];
}



?>