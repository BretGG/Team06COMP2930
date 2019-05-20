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
    if(localStorage.getItem("avatar"))
      $("#avatar").children("img").prop("src", localStorage.getItem("avatar"));
    else $("#avatar").children("img").prop("src", "../images/avatar/default.png");
    if(localStorage.getItem("platform"))
      $("#avatar").css("background-image", localStorage.getItem("platform"));
    else $("#avatar").css("background-image", "../images/platform/default.png");
    if(localStorage.getItem("background"))
      $("html").css("background-image", "url('" + localStorage.getItem("background") +"')");
    else $("html").css("background-image", "../images/background/default.png");
  }

  function getUserInfo(callback) {
    console.log("sign in");
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
    localStorage.setItem("avatar", $("#avatar").children("img").prop("src"));
    localStorage.setItem("platform", $("#avatar").css("background-image"));
    localStorage.setItem("background", $("html").css("background-image"));
    window.location.href = "/shop";
  });

  /** Takes user back to mycard page */
  $("#myCards").click(() => {
    window.location.href = "/mycard";
  });
});
