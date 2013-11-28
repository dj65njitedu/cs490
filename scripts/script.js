
var runOnce = false;
var username;
var openEnded;

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
							tableBuilder +=  '<td>'+result2[i]['examopentime']+'</td>';
							tableBuilder +=  '<td>'+result2[i]['examclosetime']+'</td>';
							tableBuilder +=  '<td>'+result2[i]['examduration']+'</td>';
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
										$("#rightPanel").html(ajaxRequest2.responseText);
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
		