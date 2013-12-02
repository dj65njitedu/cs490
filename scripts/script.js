
var runOnce = false;
var username;
var openEnded;
var timer;

$( document ).ready(function() {
	$("#loading").hide();
	getUserRole();
	allButtonsHide();
	getUserRole();
	$("#addQuestions").click(function(){
		allButtonsSlideUp();
		if($("#addQuestionsDropDown").is(":visible")){
			$("#addQuestionsDropDown").slideUp();
		}else{
			$(this).addClass("button2").removeClass("button");
			$("#addQuestionsDropDown").slideDown();
			
			var htmlCourseBuilder;
			//This string will be built from results from the server (in this case the results are simulated)				
			htmlCourseBuilder = '<div id="courseSelect"><table><tr><td>Choose the desired course</td></tr><tr><td><select>';
			
			var ajaxRequest = $.ajax({
				url:'?method=returnCourses', 
				success:function(){
				result = JSON.parse(ajaxRequest.responseText);
					//alert(ajaxRequest.responseText);
					//alert(result[0]['username']);
					for(var i = 0;i < countProperties(result);++i){
						//alert(result[i]['cname']);
						htmlCourseBuilder += '<option value="'+result[i]['cname']+'">'+result[i]['cname']+'</option>';
					}
					htmlCourseBuilder += '</select></td></tr></table></div><br>';
					if(runOnce == false){
						$('#multipleChoice').prepend(htmlCourseBuilder);
						runOnce = true;
					}
				}
			});
		}		

						
	});
	$("#makeTest").click(function(){
		allButtonsSlideUp();
		if($("#makeTestDropDown").is(":visible")){
			$("#makeTestDropDown").slideUp();
		}else{
			$(this).addClass("button2").removeClass("button");
			$("#makeTestDropDown").slideDown();
			var makeTestHtml = '<div id="makeTestCourseSelect"><table><tr><td>Choose where the questions will come from</td></tr><tr><td><select id="makeTestSelection">';
			var ajaxRequest = $.ajax({
				url:'?method=returnCourses', 
				success:function(){
				result = JSON.parse(ajaxRequest.responseText);
					//alert(ajaxRequest.responseText);
					//alert(result[0]['username']);
					for(var i = 0;i < countProperties(result);++i){
						//alert(result[i]['cname']);
						makeTestHtml += '<option value="'+result[i]['cname']+'">'+result[i]['cname']+'</option>';
					}
					makeTestHtml += '</select></td></tr></table></div><br>';
					$('#makeTestDropDown').html(makeTestHtml);
				}
			});
			$("#makeTestDropDown").html(makeTestHtml);	
			//$("#rightPanel").html(openEndedHtml);				
			
		}
	});
	
	$("#GetReport").click(function(){
		allButtonsSlideUp();
		if($("#GetReportDropDown").is(":visible")){
			$("#GetReportDropDown").slideUp();
		}else{
			$(this).addClass("button2").removeClass("button");
			$("#GetReportDropDown").slideDown();
			
			//Code goes here
			
		}			
	});
	$("#seeTest").click(function(){
		allButtonsSlideUp();
		if($("#seeTestDropDown").is(":visible")){
			$("#seeTestDropDown").slideUp();
		}else{
			$(this).addClass("button2").removeClass("button");
			$("#seeTestDropDown").slideDown();
			
			//Code goes here
			var ajaxRequest = $.ajax({
				url:'?method=getExamsForStudent&param1='+ username, 
				success:function(){
					var result = ajaxRequest.responseText;
					var studentExamsResultsAsHTML = ajaxRequest.responseText;
					if(result.length <= 4){
						$("#rightPanel").html("<center>There are no exams available to you at this time</center>");
					}
					else{
						result2 = JSON.parse(result);
						var tableBuilder = '<div ><table style="margin: 0 auto; width:1000px" border="1"><thead><tr class="crtr"><th>ID</th><th>Course Name</th><th>Exam Open Time</th><th>Exam Close Time</th><th>Exam Duration</th></tr></thead><tbody>'; 
						for(var i = 0;i<countProperties(result2); ++i){
							tableBuilder +=  '<tr class="examButtons">';
							tableBuilder +=  '<td >'+result2[i]['id']+'</td>';
							tableBuilder +=  '<td>'+result2[i]['cname']+'</td>';
							tableBuilder +=  '<td>'+formattedDate(result2[i]['examopentime'])+'</td>'; 
							tableBuilder +=  '<td>'+formattedDate(result2[i]['examclosetime'])+'</td>';
							var formattedHour = '00';
							var formattedMinute = '00';
							var formattedTime = result2[i]['examduration'];
							if(result2[i]['examduration'][0] == '0' && result2[i]['examduration'][1] == '0'){
								formattedTime = parseInt(result2[i]['examduration'][3] + result2[i]['examduration'][4]) + ' minutes';
							}
							else{
								formattedTime = parseInt(result2[i]['examduration'][0] + result2[i]['examduration'][1]) + ' hours and '+ parseInt(result2[i]['examduration'][3] + result2[i]['examduration'][4]) + ' minutes'
							}
							tableBuilder +=  '<td>'+formattedTime+'</td>';
							tableBuilder +=  '</tr>';	
						}
						tableBuilder += '</tbody></table></div>';
						$("#rightPanel").html(tableBuilder);
						$("tr").mousedown(function(){
							var pos = $(this).attr("class");
							if(pos == "crtr"){}
							else{  
								var id = '';
								var stopCapture = false;
								for(var i = 0;i < this.innerHTML.length; ++i){
									if((i > 3) && (stopCapture != true)){
										if(this.innerHTML.charAt(i) != '<'){
											id += this.innerHTML.charAt(i);
										}
										if(this.innerHTML.charAt(i) == '<'){
											stopCapture = true;
										}
									}
								}
								var ajaxRequest2 = $.ajax({
								url:'?method=takeExamByID&param1='+ id + '&param2='+ username, 
									success:function(){
										var questionAnswerPairs = new Array();
										var questionNum;
										var result = ajaxRequest2.responseText;
										var result2;
										$("#rightPanel").html(ajaxRequest2.responseText);
										if(result.length > 30){
											var lastQuestionID;
											var tableBuilder2 = '<div id="timer" style="font-weight:bold; font-size: 25px; position: fixed; left:55%; top:15px"></div><div ><table style="margin: 0 auto; width:1000px" border="1"><thead><tr class="crtr"><th>Question</th></tr></thead><tbody>';
											result2 = JSON.parse(result);
											result2[countProperties(result2)] =  {"questionID":"endOfObject"};
											lastQuestionID = 1000;
											questionNum = 1;
											for(var i = 0; i < countProperties(result2); ++i){
												if(result2[i]['questionID'] == lastQuestionID){
													tableBuilder2 +=  '<input type="radio" value="'+result2[i]['answerID']+'" name="'+result2[i]['questionID']+'">' + result2[i]['answer'] + '<br></input>';
													//alert(tableBuilder2);
													if(result2[i+1]['questionID'] != lastQuestionID && result2[i]['question'] != undefined){
														tableBuilder2 += '</form></td></tr>';
													}
												}else{
													lastQuestionID = result2[i]['questionID'];
													if(result2[i]['question'] != undefined){
														tableBuilder2 +=  '<tr class="examButtons"><td><b>'+questionNum+'</b><br><form id="'+questionNum+'">'+result2[i]['question']+'?<br><input type="radio" value="'+result2[i]['answerID']+'" name="'+result2[i]['questionID']+'">' + result2[i]['answer'] + '<br></input>';
														questionAnswerPairs[questionNum] = result2[i]['questionID'];
														questionNum++;
													}
												}
											}
											tableBuilder2 += '<tr class="examButtons"><td><button style="padding:20px" id="submitExam"><b>Submit Exam</b></button></td></tr></tbody></table></div>';
											$("#rightPanel").html(tableBuilder2);
											
											//alert(result2[0]['examduration'][3] + result2[0]['examduration'][4]);
												var year = parseInt(result2[0]['examduration'][0] + result2[0]['examduration'][1]);
												var month = parseInt(result2[0]['examduration'][0] + result2[0]['examduration'][1]);
												var day = parseInt(result2[0]['examduration'][0] + result2[0]['examduration'][1]);
												var hours = parseInt(result2[0]['examduration'][0] + result2[0]['examduration'][1]);
												var minutes = parseInt(result2[0]['examduration'][3] + result2[0]['examduration'][4]);
												var seconds = parseInt(result2[0]['examduration'][6] + result2[0]['examduration'][7]);
												var duration = (hours * 60 * 60) + (minutes * 60) + (seconds);
												
											if(result2[0]['starttime'] != undefined ){
												//alert((result2[0]['examduration'][11] + result2[0]['examduration'][12]) +':'+ (result2[0]['examduration'][14] + result2[0]['examduration'][15]) +':'+(result2[0]['examduration'][17] + result2[0]['examduration'][18]));
												var year3 = parseInt(result2[0]['examclosetime'][0] + result2[0]['examclosetime'][1] + result2[0]['examclosetime'][2] + result2[0]['examclosetime'][3]);
												var month3 = parseInt(result2[0]['examclosetime'][5] + result2[0]['examclosetime'][6]);
												var day3 = parseInt(result2[0]['examclosetime'][8] + result2[0]['examclosetime'][9]);												
												var hours3 = parseInt(result2[0]['examclosetime'][11] + result2[0]['examclosetime'][12]);
												var minutes3 = parseInt(result2[0]['examclosetime'][14] + result2[0]['examclosetime'][15]);
												var seconds3 = parseInt(result2[0]['examclosetime'][17] + result2[0]['examclosetime'][18]);
												var examCloseTime = (year3 * 12 * 30 * 24 * 60 * 60) + (month3 * 30 * 24 * 60 * 60) + (day3 * 24 * 60 * 60) + (hours3 * 60 * 60) + (minutes3 * 60) + (seconds3);

												var year4 = parseInt(result2[0]['currenttime'][0] + result2[0]['currenttime'][1] + result2[0]['currenttime'][2] + result2[0]['currenttime'][3]);
												var month4 = parseInt(result2[0]['currenttime'][5] + result2[0]['currenttime'][6]);
												var day4 = parseInt(result2[0]['currenttime'][8] + result2[0]['currenttime'][9]);												
												var hours4 = parseInt(result2[0]['currenttime'][11] + result2[0]['currenttime'][12]);
												var minutes4 = parseInt(result2[0]['currenttime'][14] + result2[0]['currenttime'][15]);
												var seconds4 = parseInt(result2[0]['currenttime'][17] + result2[0]['currenttime'][18]);
												var currentTime = (year4 * 12 * 30 * 24 * 60 * 60) + (month4 * 30 * 24 * 60 * 60) + (day4 * 24 * 60 * 60) + (hours4 * 60 * 60) + (minutes4 * 60) + (seconds4);		

												var year5 = parseInt(result2[0]['starttime'][0] + result2[0]['starttime'][1] + result2[0]['currenttime'][2] + result2[0]['currenttime'][3]);
												var month5 = parseInt(result2[0]['starttime'][5] + result2[0]['starttime'][6]);
												var day5 = parseInt(result2[0]['starttime'][8] + result2[0]['starttime'][9]);												
												var hours5 = parseInt(result2[0]['starttime'][11] + result2[0]['starttime'][12]);
												var minutes5 = parseInt(result2[0]['starttime'][14] + result2[0]['starttime'][15]);
												var seconds5 = parseInt(result2[0]['starttime'][17] + result2[0]['starttime'][18]);
												var startTime = (year5 * 12 * 30 * 24 * 60 * 60) + (month5 * 30 * 24 * 60 * 60) + (day5 * 24 * 60 * 60) + (hours5 * 60 * 60) + (minutes5 * 60) + (seconds5);													
												//alert("duration=" + duration + "<br>(examCloseTime-currentTime)=" + (examCloseTime - currentTime));
												var smallestDuration;
												if((examCloseTime - currentTime) < duration){
													smallestDuration = (examCloseTime - currentTime);
													//alert("examClosetime = "+examCloseTime+"<br><br>currentTime = "+currentTime+"<br><br>(examCloseTime - currentTime) = "+(examCloseTime - currentTime)+"<br><br>Duration= "+duration);
												}
												else{
													smallestDuration = duration - (currentTime - startTime);
												}
												timer = setInterval(function(){
													--smallestDuration;
													if(smallestDuration >= 0){
														$("#timer").html((new Date).clearTime().addSeconds(smallestDuration).toString('H:mm:ss'));
													}
													
													if(smallestDuration <= 0){
															var innerString = "?method=submitExam&param1="+id+"&param2="+username;
															var param = 3; 
															for(var i = 1; i < questionNum; ++i){
												
																innerString += "&param"+(param) + "=" + questionAnswerPairs[i];
																++param;
																innerString += "&param"+(param) + "=" + $("#"+i+" input:radio:checked").val();
																++param;
															}
																var ajaxRequest4 = $.ajax({
																	url:innerString, 
																	success:function(){
																	//result = JSON.parse(ajaxRequest3.responseText);
																		//alert(innerString);
																		//alert(ajaxRequest4.responseText);
																		//$("#rightPanel").html(innerString);
																		window.location.href = "";
																		
																	}
																});
																clearInterval( timer);
													}
												},1000);
											}
											else{
											
												timer = setInterval(function(){
													--duration;
													if(duration >= 0 ){
														$("#timer").html((new Date).clearTime().addSeconds(duration).toString('H:mm:ss'));
													}
													
													
													if(duration <= 0){
															var innerString = "?method=submitExam&param1="+id+"&param2="+username;
															var param = 3; 
															for(var i = 1; i < questionNum; ++i){
												
																innerString += "&param"+(param) + "=" + questionAnswerPairs[i];
																++param;
																innerString += "&param"+(param) + "=" + $("#"+i+" input:radio:checked").val();
																++param;
															}
																var ajaxRequest4 = $.ajax({
																	url:innerString, 
																	success:function(){
																	//result = JSON.parse(ajaxRequest3.responseText);
																		//alert(innerString);
																		//alert(ajaxRequest4.responseText);
																		//$("#rightPanel").html(innerString);
																		window.location.href = "";
																		
																	}
																});
																clearInterval( timer);
													}
												},1000);
												//alert(countProperties(result2));
											}
											
											$('#submitExam').click(function(){
												var answer = confirm("Submit now?");
												if(answer){
													clearInterval(timer);
													//alert($("#1 input:radio:checked").val());
													var innerString = "?method=submitExam&param1="+id+"&param2="+username;
													var param = 3; 
													for(var i = 1; i < questionNum; ++i){
										
														innerString += "&param"+(param) + "=" + questionAnswerPairs[i];
														++param;
														innerString += "&param"+(param) + "=" + $("#"+i+" input:radio:checked").val();
														++param;
													}
													//alert(innerString);
																var ajaxRequest3 = $.ajax({
																	url:innerString, 
																	success:function(){
																	//result = JSON.parse(ajaxRequest3.responseText);
																		//alert(innerString);
																		//alert(ajaxRequest3.responseText);
																		//$("#rightPanel").html(innerString);
																		window.location.href = "";
																		
																	}
																});
												}
											});
										}
									}

								});								
								
							}
						});
					}	
				}


			});
			
		}		
	});
	$("#seeHistory").click(function(){
		allButtonsSlideUp();
		if($("#seeHistoryDropDown").is(":visible")){
			$("#seeHistoryDropDown").slideUp();
		}else{
			$("#seeHistoryDropDown").slideDown();
			
			//Code goes here
			
		}			
	});
	
	$("#mc").click(function(){
		var multipleChoiceHtml = '<div id="multipleChoiceDiv" style="padding:20px"><table><tr><td>Enter Question Here</td><td><div><textarea cols="85"></textarea></div></td></tr><tr><td><br></td><td><br></td></tr><tr><td>Right Answer</td><td>Answer</td></tr><tr><td><input id="a" type="radio" name="multipleAnswer" value="a">A</td><td><textarea cols="85">Enter Answer Here</textarea></td></tr><tr><td><input id="b" type="radio" name="multipleAnswer" value="b">B</td><td><textarea cols="85">Enter Answer Here</textarea></td></tr><tr><td><input id="c" type="radio" name="multipleAnswer" value="c">C</td><td><textarea cols="85">Enter Answer Here</textarea></td></tr><tr><td><input id="d" type="radio" name="multipleAnswer" value="d">D</td><td><textarea cols="85">Enter Answer Here</textarea></td></tr><tr><td></td><td style="float:right"><input type="submit"></input></td></tr></table></div>';
		$("#rightPanel").html(multipleChoiceHtml);
	});
	
	$("#tf").click(function(){
		var trueOrFalseHtml = '<div id="trueOrFalseDiv" style="padding:20px"><table><tr><td>Enter Question Here</td><td><div><textarea cols="85"></textarea></div></td></tr><tr><td><br></td><td><br></td></tr><tr><td>Right Answer</td><td>Answer</td></tr><tr><td><input id="t" type="radio" name="multipleAnswer" value="t">True</td><td><textarea cols="85">Enter Answer Here</textarea></td></tr><tr><td><input id="f" type="radio" name="multipleAnswer" value="f">False</td><td><textarea cols="85">Enter Answer Here</textarea></td></tr><tr><td></td><td style="float:right"><input type="submit"></input></td></tr></table></div>';
		$("#rightPanel").html(trueOrFalseHtml);	
	});
	
	$("#oe").click(function(){
		var openEndedHtml = '<div id="openEndedDiv" style="padding:20px"><table><tr><td>Enter Question Here </td><td><div><textarea id="code" cols="85" rows="15"></textarea></div><div id="codeResponse" style="display:block"></div></td></tr><tr><td></td><td style="text-align:right"><button id="runCode">Run Code</button></td><tr><td><br></td><td><br></td></tr></tr><tr><td>Enter Answer Here </td><td><div><textarea cols="85" rows="15"></textarea></div></td></tr><tr><td></td><td style="float:right"><input type="submit"></input></td></tr></table></div>';
		$("#rightPanel").html(openEndedHtml);
		$("#runCode").click(function(){
			//alert($('#code').val());
				$("#loading").show();
				var ajaxRequest = $.ajax({
				url:'?method=compiler&param1='+ htmlEncoder($('#code').val()), 
				success:function(){
					//alert(ajaxRequest.responseText);
					//alert(result[0]['username']);
					//$('#code').val() = html(ajaxRequest.responseText);
					$("#codeResponse").html(ajaxRequest.responseText);
					//getElementById('codeResponse').value = ajaxRequest.responseText;
					//alert(ajaxRequest.responseText);
					$("#loading").hide();
				}


			});
				/*$.post( "", { compiler: $('#code').val()}).done(function( data ) {
					alert( "Data Loaded: " + data );
				});*/
		});
	});
 
});

function allButtonsSlideUp(){
		$("#addQuestionsDropDown").slideUp();
		$("#makeTestDropDown").slideUp();
		$("#GetReportDropDown").slideUp();
		$("#seeTestDropDown").slideUp();
		$("#seeHistoryDropDown").slideUp();
		$("#seeTest").addClass("button").removeClass("button2");
		$("#seeHistory").addClass("button").removeClass("button2");
		$("#addQuestions").addClass("button").removeClass("button2");
		$("#makeTest").addClass("button").removeClass("button2");
		$("#GetReport").addClass("button").removeClass("button2");
}

function allButtonsHide(){
		$("#seeTest").hide();
		$("#seeHistory").hide();
		$("#addQuestions").hide();
		$("#makeTest").hide();
		$("#GetReport").hide();	
		$("#addQuestionsDropDown").hide();
		$("#makeTestDropDown").hide();
		$("#GetReportDropDown").hide();
		$("#seeTestDropDown").hide();
		$("#seeHistoryDropDown").hide();
}

function getUserRole(){
	username = document.getElementById("hiddenUserName").value;
	var ajaxRequest = $.ajax({
					url:'?method=getUserRole&param1='+username, 
					success:function(){
					result = JSON.parse(ajaxRequest.responseText);
						//alert(ajaxRequest.responseText);
						//alert(result[0]['username']);
						if(result[0]['role'] == 'student'){
							$("#seeTest").show();
							$("#seeHistory").show();
						}
						if(result[0]['role'] == 'teacher'){
							$("#addQuestions").show();
							$("#makeTest").show();
							$("#GetReport").show();	
						}
					}
			});
}

function getQuestionsByCourse(course){
	var resultsAsHTML = "";
	//Ajax call will use the course, get the results, build html from it, and return the html.
	//the return clause will be in the AJAX success function 
	//return resultsAsHTML;
}

function countProperties(obj) {
	var count = 0;

	for(var prop in obj) {
		if(obj.hasOwnProperty(prop))
				++count;
	}

	return count;
}

function htmlEncoder(someString){
	var returnString = "";
	for(var i = 0;i < someString.length; ++i){
		if(someString[i] == " "){
			returnString += "^";
		}
		else if(someString[i] == "&"){
			returnString += "%26";
		}
		else if(someString[i] == "#"){
			returnString += "%23";
		}
		else if(someString[i] == "'"){
			returnString += "%27";
		}	
		else if(someString[i] == "^"){
			returnString += "djkgivmmlfm";
		}		
		else{
			returnString += someString[i];
		}
	}
	return encodeURIComponent(returnString);
}

function formattedDate(dateString){
	return Date.parse(dateString).toString("dddd, MMMM dd, yyyy h:mm:ss tt");
}

//Ajax template

/*
		var ajaxRequest = $.ajax({
							url:'?method=someMadeUpMethod&param1=someMadeUpParameter', 
							//url:'http://web.njit.edu/~cem6/dblogin.php?user=cem6', 
							success:function(){
							//result = JSON.parse(ajaxRequest.responseText);
								//alert(ajaxRequest.responseText);
								//alert(result[0]['username']);
								
							}
						});
*/
		