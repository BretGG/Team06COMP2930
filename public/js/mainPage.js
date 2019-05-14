$(document).ready(() => {

    /** On page load, plays avatar animation */
    window.onload = function() {     
        $('#avatar').toggleClass('bounceIn');
    };

    /**Grabbing user's unique login token for later functions*/
    $.ajaxSetup({
        headers: {
            'auth-token': localStorage.getItem('auth-token')
        }
    });

    function getUserInfo(callback) {
        console.log('sign in');
        $.ajax({
            type: 'get',
            url: '/login/me',
            success: function(data) {
                console.log(data);
                callback(data.user)
            },
            error: function(e) {
                console.log(e.responseText);
                callback("Unknown");
            }
        });
    }


    /** Grabs user's username and appends to it welcome text */
    function setProfileInfo(user) {
        let welcome = $('#welcome');
        welcome.text("Welcome, " + user.username + "!");
    }


    /** Calling setProfileInfo function */
    getUserInfo(setProfileInfo);

    /** Takes user to create room page */
    $("#create").click(() => {
        window.location.href = "createRoom";
    })

    /** Takes user to join room page */
    $("#join").click(() => {
        window.location.href = "joinRoom";
    })

    /** Takes user back to signup/signin page */
    $("#logout").click(() => {
        window.location.href = "/";
    });
});
