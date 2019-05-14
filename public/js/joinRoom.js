$(document).ready(() => {
		/** Takes user gameLobby page */
    $("#join").click(() => {
    	window.location.href="gameLobby";
    });

    /** Takes user back to main menu */
    $("#back").click(() => {
    	window.location.href="main";
		});
});
