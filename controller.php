<?php
//Author: Desmond Johnson CS:490 Date: 10/12/13

$resultsArray = Array();
$dbServerAddress = 'http://web.njit.edu/~cem6/dblogin3.php';


if(isset($_GET['method'])){	
	$method = $_GET['method'];
	$method($_GET['param1'],$_GET['param2'],$_GET['param3'],$_GET['param4'],$_GET['param5'],$_GET['param6'],$_GET['param7'],$_GET['param8'],$_GET['param9'],$_GET['param10'],$_GET['param11'],$_GET['param12'],$_GET['param13'],$_GET['param14'],$_GET['param15'],$_GET['param16'],$_GET['param17'],$_GET['param18'],$_GET['param19'],$_GET['param20'],$_GET['param21'],$_GET['param22'],$_GET['param23'],$_GET['param24'],$_GET['param25'],$_GET['param26'],$_GET['param27'],$_GET['param28'],$_GET['param29'],$_GET['param30'],$_GET['param31'],$_GET['param32'],$_GET['param33'],$_GET['param34'],$_GET['param35'],$_GET['param36'],$_GET['param37'],$_GET['param38'],$_GET['param39'],$_GET['param40'],$_GET['param41'],$_GET['param42'],$_GET['param43'],$_GET['param44'],$_GET['param45'],$_GET['param46'],$_GET['param47'],$_GET['param48']);
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
	///echo '<br><br><br>Level 0<br><br><br>';
	$examInfoResult = file_get_contents('http://web.njit.edu/~dj65/cs490/dblogin3.php?method=getProfExamByID&param1='.$ID);
	if(strlen($examInfoResult) > 4){
		$jsonToPHPArrayResults = json_decode($examInfoResult,true);
		$examOpenDate =  dateToMinutes($jsonToPHPArrayResults[0]['examopentime']);
		$examCloseDate =  dateToMinutes($jsonToPHPArrayResults[0]['examclosetime']);
		$examDuration =  (dateToMinutes('0000-00-00 '.$jsonToPHPArrayResults[0]['examduration']))/60;
		$examDuration2 = (dateToMinutes('0000-00-00 '.$jsonToPHPArrayResults[0]['examduration']));
		$currentTime =  dateToMinutes($jsonToPHPArrayResults[0]['currenttime']);
		//echo "examOpenDate: $examOpenDate <br> examCloseDate: $examCloseDate <br> examDuration: $examDuration <br> currentTime: $currentTime<br>";
		//echo  (dateToMinutes(date("Y-m-d H:i:s")) -  dateToMinutes('2013-11-27 21:30:00'));
		///echo '<br><br><br>Level 1<br><br><br>';
		if ($currentTime < $examCloseDate){
				///echo '<br><br><br>Level 2<br><br><br>';
				//echo "Your exam will expire in ".($examCloseDate - $currentTime)." minutes";
				$studentExamInfoResult = file_get_contents('http://web.njit.edu/~dj65/cs490/dblogin3.php?method=getStudentExamByID&param1='.$ID.'&param2='.$username);
				if(strlen($studentExamInfoResult) > 4){
					//echo '<br><br><br>Level 3<br><br><br>';
					$jsonResult = json_decode($studentExamInfoResult,true);
					//return all of the questions for that exam
					//return all of the answers that they previously answered 
					//echo $jsonResult[0]['endtime'];
					//echo "<br>currenTime-starttime= ".($currentTime - dateToMinutes($jsonResult[0]['starttime']))."<br>currentTime = ".$currentTime."<br>Level 5<br>starttime = ".dateToMinutes($jsonResult[0]['starttime'])."<br>ExamDuration = ".$examDuration2."<br><br>(($currentTime - dateToMinutes($jsonResult[0]['starttime'])) > $examDuration) = ".(($currentTime - dateToMinutes($jsonResult[0]['starttime'])) > $examDuration2)."<br><br>";
					if(isset($jsonResult[0]['endtime'])){
						echo 'submitted';
					}else if(isset($jsonResult[0]['starttime'])){
						///echo '<br><br><br>Level 4a<br><br><br>';
						if(($currentTime - dateToMinutes($jsonResult[0]['starttime'])) >= $examDuration2){
							echo "taken";
							//echo "<br>currenTime-starttime= ".($currentTime - dateToMinutes($jsonResult[0]['starttime']))."<br>currentTime = ".$currentTime."<br>Level 5<br>starttime = ".dateToMinutes($jsonResult[0]['starttime'])."<br>ExamDuration = ".$examDuration2."<br><br>(($currentTime - dateToMinutes($jsonResult[0]['starttime'])) > $examDuration) = ".(($currentTime - dateToMinutes($jsonResult[0]['starttime'])) > $examDuration2)."<br><br>";
						}else{
							//echo "<br>currenTime-starttime= ".($currentTime - dateToMinutes($jsonResult[0]['starttime']))."<br>currentTime = ".$currentTime."<br>Level 5<br>starttime = ".dateToMinutes($jsonResult[0]['starttime'])."<br>ExamDuration = ".$examDuration."<br><br>(($currentTime - dateToMinutes($jsonResult[0]['starttime'])) > $examDuration) = ".(($currentTime - dateToMinutes($jsonResult[0]['starttime'])) > $examDuration)."<br><br>";
							echo file_get_contents('http://web.njit.edu/~dj65/cs490/dblogin3.php?method=getStudentExamAndAnswersByID&param1='.$ID.'&param2='.$username);
						}
					}else{
						//echo '<br><br><br>Level 4b<br><br><br>';
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


function submitExam($ID, $username, $param3, $param4, $param5, $param6, $param7, $param8, $param9, $param10, $param11, $param12, $param13, $param14, $param15, $param16, $param17, $param18, $param19, $param20, $param21, $param22, $param23, $param24, $param25, $param26, $param27, $param28, $param29, $param30, $param31, $param32, $param33, $param34, $param35, $param36, $param37, $param38, $param39, $param40, $param41, $param42, $param43, $param44, $param45, $param46, $param47, $param48 ){
	$examInfoResult = file_get_contents('http://web.njit.edu/~dj65/cs490/dblogin3.php?method=getProfExamByID&param1='.$ID);
	if(strlen($examInfoResult) > 4){
		$jsonToPHPArrayResults = json_decode($examInfoResult,true);
		$examOpenDate =  dateToMinutes($jsonToPHPArrayResults[0]['examopentime']);
		$examCloseDate =  dateToMinutes($jsonToPHPArrayResults[0]['examclosetime']);
		$examDuration2 =  (dateToMinutes('0000-00-00 '.$jsonToPHPArrayResults[0]['examduration']));
		$currentTime =  dateToMinutes($jsonToPHPArrayResults[0]['currenttime']);

		if ($currentTime < $examCloseDate){
				//echo "Your exam will expire in ".($examCloseDate - $currentTime)." minutes";
				$studentExamInfoResult = file_get_contents('http://web.njit.edu/~dj65/cs490/dblogin3.php?method=getStudentExamByID&param1='.$ID.'&param2='.$username);
				if(strlen($studentExamInfoResult) > 4){
					$jsonResult = json_decode($studentExamInfoResult,true);
					if(isset($jsonResult[0]['endtime'])){
						echo 'submitted';
					}else if(isset($jsonResult[0]['starttime'])){
						///echo '<br><br><br>Level 4a<br><br><br>';
						if(($currentTime - dateToMinutes($jsonResult[0]['starttime'])) >= $examDuration2){
							echo "taken";
							//echo "<br>currenTime-starttime= ".($currentTime - dateToMinutes($jsonResult[0]['starttime']))."<br>currentTime = ".$currentTime."<br>Level 5<br>starttime = ".dateToMinutes($jsonResult[0]['starttime'])."<br>ExamDuration = ".$examDuration2."<br><br>(($currentTime - dateToMinutes($jsonResult[0]['starttime'])) > $examDuration) = ".(($currentTime - dateToMinutes($jsonResult[0]['starttime'])) > $examDuration2)."<br><br>";
						}else{
							//////insert record here
							$studentExamID = $jsonResult[0]['id'];
							$studentID = $jsonResult[0]['studentID'];
							//$url = 'http://web.njit.edu/~dj65/cs490/dblogin3.php?method=submitExam&param1='.$ID.'&param2='.$studentExamID.'&param3='.$param3.'&param4='.$param4.'&param5='.$param5.'&param6='.$param6.'&param7='.$param7.'&param8='.$param8.'&param9='.$param9.'&param10='.$param10.'&param11='.$param11.'&param12='.$param12.'&param13='.$param13.'&param14='.$param14.'&param15='.$param15.'&param16='.$param16.'&param17='.$param17.'&param18='.$param18.'&param19='.$param19.'&param20='.$param20.'&param21='.$param21.'&param22='.$param22.'&param23='.$param23.'&param24='.$param24.'&param25='.$param25.'&param26='.$param26.'&param27='.$param27.'&param28='.$param28.'&param29='.$param29.'&param30='.$param30.'&param31='.$param31.'&param32='.$param32.'&param33='.$param33.'&param34='.$param34.'&param35='.$param35.'&param36='.$param36.'&param37='.$param37.'&param38='.$param38.'&param39='.$param39.'&param40='.$param40.'&param41='.$param41.'&param42='.$param42.'&param43='.$param43.'&param44='.$param44.'&param45='.$param45.'&param46='.$param46.'&param47='.$param47.'&param48='.$param48;
							$SEQAPID = array();
							$paramArray = array();
							$paramArray[3] = $param3; $paramArray[4] = $param4; $paramArray[5] = $param5; $paramArray[6] = $param6; $paramArray[7] = $param7; $paramArray[8] = $param8; $paramArray[9] = $param9; $paramArray[10] = $param10; $paramArray[11] = $param11; $paramArray[12] = $param12; $paramArray[13] = $param13; $paramArray[14] = $param14; $paramArray[15] = $param15; $paramArray[16] = $param16; $paramArray[17] = $param17; $paramArray[18] = $param18; $paramArray[19] = $param19; $paramArray[20] = $param20; $paramArray[21] = $param21; $paramArray[22] = $param22; $paramArray[23] = $param23; $paramArray[24] = $param24; $paramArray[25] = $param25; $paramArray[26] = $param26; $paramArray[27] = $param27; $paramArray[28] = $param28; $paramArray[29] = $param29; $paramArray[30] = $param30; $paramArray[31] = $param31; $paramArray[32] = $param32; $paramArray[33] = $param33; $paramArray[34] = $param34; $paramArray[35] = $param35; $paramArray[36] = $param36; $paramArray[37] = $param37; $paramArray[38] = $param38; $paramArray[39] = $param39; $paramArray[40] = $param40; $paramArray[41] = $param41; $paramArray[42] = $param42; $paramArray[43] = $param43; $paramArray[44] = $param44; $paramArray[45] = $param45; $paramArray[46] = $param46; $paramArray[47] = $param47; $paramArray[48] = $param48;
							//print_r($paramArray).'<br><br><br>';
							for($i = 0;$i < 46; ++$i){

								$seqap_ID = file_get_contents('http://web.njit.edu/~dj65/cs490/dblogin3.php?method=insertSEQAPIDAndReturnID&param1='.$ID.'&param2='.$studentID.'&param3='.$paramArray[$i+3].'&param4='.$paramArray[$i+4]);
								$seqap_IDResult = json_decode($seqap_ID,true);
								$SEQAPID[($i/2)] = array();
								$SEQAPID[($i/2)][0] = $paramArray[$i+3];
								$SEQAPID[($i/2)][1] = $seqap_IDResult[0]['id'];
								++$i;
								//insertSEQAPIDAndReturnID($profExamID, $userID, $qbID, $answer)
								
								//$urlpart += 
							}
							$submitUrl = 'http://web.njit.edu/~dj65/cs490/dblogin3.php?method=submitExam&param1='.$ID.'&param2='.$studentID.'&param3='.$studentExamID;
							//echo '<br><br>';
							//print_r($SEQAPID);
							//echo '<br><br>';
							for($i = 0;$i < 20; ++$i){
								
								$submitUrl = $submitUrl.'&param'.($i+4).'='.$SEQAPID[($i)][1];
								//insertSEQAPIDAndReturnID($profExamID, $userID, $qbID, $answer)
								
								//$urlpart += 
							}
							
							//echo '<br><br>The created Url is: '.$submitUrl;
							
							//echo file_get_contents($submitUrl);
							//echo $submitUrl;
							file_get_contents($submitUrl);
							
							//echo "<br>currenTime-starttime= ".($currentTime - dateToMinutes($jsonResult[0]['starttime']))."<br>currentTime = ".$currentTime."<br>Level 5<br>starttime = ".dateToMinutes($jsonResult[0]['starttime'])."<br>ExamDuration = ".$examDuration."<br><br>(($currentTime - dateToMinutes($jsonResult[0]['starttime'])) > $examDuration) = ".(($currentTime - dateToMinutes($jsonResult[0]['starttime'])) > $examDuration)."<br><br>";
							//echo file_get_contents('http://web.njit.edu/~dj65/cs490/dblogin3.php?method=getStudentExamAndAnswersByID&param1='.$ID.'&param2='.$username);
						}
					}else{
						//$studentExamID = $jsonResult[0]['id'];
						echo 'error';
						//echo "<br><br><br><br><br>".$jsonResult[0]['id']."<br><br><br><br>";
						//echo file_get_contents('http://web.njit.edu/~dj65/cs490/dblogin3.php?method=getStudentExamAndAnswersByID&param1='.$ID.'&param2='.$username);
					}
				}
				else{
					
					echo 'error';
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