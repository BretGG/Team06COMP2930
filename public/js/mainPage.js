$(document).ready(() => {
  // setting encrypted and secure user token
  $.ajaxSetup({
    headers: {
      "auth-token": localStorage.getItem("auth-token")
    }
  });

  /** On page load, plays avatar animation */
  window.onload = function() {
    updateCosmetics();
    $("#avatar").toggleClass("bounceIn");
  };

  function updateCosmetics(){
    $.ajax({
      type: "get",
      url: "/users/updateCosmetics",
      success: function(data) {
        $("#avatar").children("img").prop("src", data.activeAvatar);
        $("#avatar").css("background-image", data.activePlatform);
        $("html").css("background-image", data.activeBackground);
      },
      error: function(e) {
        console.log(e.responseText);
      }
    });
  }

  function getUserInfo(callback) {
    $.ajax({
      type: "get",
      url: "/login/me",
      success: function(data) {
        callback(data);
      },
      error: function(e) {
        console.log(e.responseText);
        callback("Unknown");
      }
    });
  }

  /** Grabs user's username and appends to it welcome text */
  function setProfileInfo(user) {
    let welcome = $("#title");
    welcome.text("Welcome, " + user.username + "!");
  }

  /** Calling setProfileInfo function */
  getUserInfo(setProfileInfo);

  /** Takes user to create room page */
  $("#create").click(() => {
    window.location.href = "createRoom";
  });

  /** Takes user to join room page */
  $("#join").click(() => {
    window.location.href = "joinRoom";
  });

  /** Takes user to join room page */
  $("#cards").click(() => {
    window.location.href = "mycard";
  });

  /** Takes user back to signup/signin page */
  $("#logout").click(() => {
    window.location.href = "/";
  });

  /** Takes user back to shop page */
  $("#shop").click(() => {
    window.location.href = "/shop";
  });

  /** Takes user back to mycard page */
  $("#myCards").click(() => {
    window.location.href = "/mycard";
  });
});
