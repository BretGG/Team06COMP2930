$(document).ready(() => {
	/** On page load, plays avatar animation */
	window.onload = function() {     
		$('#avatar').toggleClass('bounceIn');
  };

	$('#shopAvatar').click(() =>{
		$('#shopPlatform').css("background-color", "rgba(255,255,255, 0.75)");
		$('#shopBackground').css("background-color", "rgba(255,255,255, 0.75)");
		$('#shopAvatar').css("background-color", "#9CD6D6");
		
	})  

	$('#shopPlatform').click(() => {
		$('#shopAvatar').css("background-color", "rgba(255,255,255, 0.75)");
		$('#shopBackground').css("background-color", "rgba(255,255,255, 0.75)");
		$('#shopPlatform').css("background-color", "#9CD6D6");
		
	})

	$('#shopBackground').click(() => {
		$('#shopPlatform').css("background-color", "rgba(255,255,255, 0.75)");
		$('#shopAvatar').css("background-color", "rgba(255,255,255, 0.75)");
		$('#shopBackground').css("background-color", "#9CD6D6");
		
	})

});
