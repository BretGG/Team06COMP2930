
// var bg = ["city.png", "darkblue.png", "night.png", "pixelatedbg.png", "sunset.png"];

var url = "../images/";
var active ="avatar";

$(document).ready(() => {
	/** On page load, plays avatar animation */
	window.onload = function() {     
		$('#avatar').toggleClass('bounceIn');
  };

/** THIS CODE IS VERY BRUTE FORCE. WILL OPTIMIZE LATER (PROBABLY LOL DEPENDS ON TIME) <3 STELLA */
$('#shopBackground').click(() => {
	$('#shopPlatform').css("background-color", "rgba(255,255,255, 0.75)");
	$('#shopAvatar').css("background-color", "rgba(255,255,255, 0.75)");
	$('#shopBackground').css("background-color", "#48748E");
	$('#item1').attr("src", "../images/bg/default.png");
	$('#item2').attr("src", "../images/bg/city.png");
	$('#item3').attr("src", "../images/bg/darkblue.png");
	$('#item4').attr("src", "../images/bg/night.png");
	$('#item5').attr("src", "../images/bg/pixelatedbg.png");
	$('#item6').attr("src", "../images/bg/sunset.png");
	active = "bg";
})

$('#shopAvatar').click(() =>{
	$('#shopPlatform').css("background-color", "rgba(255,255,255, 0.75)");
	$('#shopBackground').css("background-color", "rgba(255,255,255, 0.75)");
	$('#shopAvatar').css("background-color", "#48748E");
	$('#item1').attr("src", "../images/avatar/default.png");
	$('#item2').attr("src", "../images/avatar/greenChar.png");
	$('#item3').attr("src", "../images/avatar/greyChar.png");
	$('#item4').attr("src", "../images/avatar/redChar.png");
	$('#item5').attr("src", "../images/avatar/yellowChar.png");
	$('#item6').attr("src", "../images/avatar/blueChar.png");
	active ="avatar";
})  

$('#shopPlatform').click(() => {
	$('#shopAvatar').css("background-color", "rgba(255,255,255, 0.75)");
	$('#shopBackground').css("background-color", "rgba(255,255,255, 0.75)");
	$('#shopPlatform').css("background-color", "#48748E");
	$('#item1').attr("src", "../images/platform/default.png");
	$('#item2').attr("src", "../images/platform/pinkplatform.png");
	$('#item3').attr("src", "../images/platform/purpleplatform.png");
	$('#item4').attr("src", "../images/platform/rabbitpet.png");
	$('#item5').attr("src", "../images/platform/duckpet.png");
	$('#item6').attr("src", "../images/platform/birdpet.png");
	active ="platform";
})

$('#item1').click(() => {
	clearSelect();
	$('#item1').parent().css("background-color", "#48748E");
	if(active == "avatar")
		$("#char").prop("src", "../images/avatar/default.png");
	else if (active == "platform")
		$("#char").css("background-image", "url(../images/platform/default.png)");
	else if (active == "bg")
		$("body").css("background-image", "url(../images/bg/default.png)");
})

$('#item2').click(() => {
	clearSelect();
	$('#item2').parent().css("background-color", "#48748E");
	if(active == "avatar")
		$("#char").prop("src", "../images/avatar/greenChar.png");
	else if (active == "platform")
		$("#char").css("background-image", "url(../images/platform/pinkplatform.png)");
	else if (active == "bg")
		$("body").css("background-image", "url(../images/bg/city.png)");
})

$('#item3').click(() => {
	clearSelect();
	$('#item3').parent().css("background-color", "#48748E");
	if(active == "avatar")
		$("#char").prop("src", "../images/avatar/greyChar.png");
	else if (active == "platform")
		$("#char").css("background-image", "url(../images/platform/purpleplatform.png)");
	else if (active == "bg")
		$("body").css("background-image", "url(../images/bg/darkblue.png)");
})

$('#item4').click(() => {
	clearSelect();
	$('#item4').parent().css("background-color", "#48748E");
	if(active == "avatar")
		$("#char").prop("src", "../images/avatar/redChar.png");
	else if (active == "platform")
		$("#char").css("background-image", "url(../images/platform/rabbitpet.png)");
	else if (active == "bg")
		$("body").css("background-image", "url(../images/bg/night.png)");
})

$('#item5').click(() => {
	clearSelect();
	$('#item5').parent().css("background-color", "#48748E");
	if(active == "avatar")
		$("#char").prop("src", "../images/avatar/yellowChar.png");
	else if (active == "platform")
		$("#char").css("background-image", "url(../images/platform/duckpet.png)");
	else if (active == "bg")
		$("body").css("background-image", "url(../images/bg/pixelatedbg.png)");
})

$('#item6').click(() => {
	clearSelect();
	$('#item6').parent().css("background-color", "#48748E");
	if(active == "avatar")
		$("#char").prop("src", "../images/avatar/blueChar.png");
	else if (active == "platform")
		$("#char").css("background-image", "url(../images/platform/birdpet.png)");
	else if (active == "bg")
		$("body").css("background-image", "url(../images/bg/sunset.png)");
})

function clearSelect(){
	$('#item1').parent().css("background-color", "white");
	$('#item2').parent().css("background-color", "white");
	$('#item3').parent().css("background-color", "white");
	$('#item4').parent().css("background-color", "white");
	$('#item5').parent().css("background-color", "white");
	$('#item6').parent().css("background-color", "white");
}


});
