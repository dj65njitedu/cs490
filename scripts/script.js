
var runOnce = false;
var username;

$( document ).ready(function() {
	getUserRole();
	allButtonsHide();
	getUserRole();
	$("#addQuestions").click(function(){
		allButtonsSlideUp();
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
		
						
	});
	$("#makeTest").click(function(){
		allButtonsSlideUp();
		$("#makeTestDropDown").slideDown();
	});
	$("#GetReport").click(function(){
		allButtonsSlideUp();
		$("#GetReportDropDown").slideDown();
	});
	$("#seeTest").click(function(){
		allButtonsSlideUp();
		$("#seeTestDropDown").slideDown();
	});
	$("#seeHistory").click(function(){
		allButtonsSlideUp();
		$("#seeHistoryDropDown").slideDown();
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
		var openEndedHtml = '<div id="openEndedDiv" style="padding:20px"><table><tr><td>Enter Question Here </td><td><div><textarea cols="85" rows="15"></textarea></div></td></tr><tr><td><br></td><td><br></td></tr><tr><td>Enter Answer Here </td><td><div><textarea cols="85" rows="15"></textarea></div></td></tr><tr><td></td><td style="float:right"><input type="submit"></input></td></tr></table></div>';
		$("#rightPanel").html(openEndedHtml);	
	});
	
	$("#makeTest").click(function(){
		//Ajax request will go here
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
	});
 
});

function allButtonsSlideUp(){
		$("#addQuestionsDropDown").slideUp();
		$("#makeTestDropDown").slideUp();
		$("#GetReportDropDown").slideUp();
		$("#seeTestDropDown").slideUp();
		$("#seeHistoryDropDown").slideUp();
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

function countProperties(obj) {
	var count = 0;

	for(var prop in obj) {
		if(obj.hasOwnProperty(prop))
				++count;
	}

	return count;
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
		