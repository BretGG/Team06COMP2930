$(document).ready(() => {
  // setting encrypted and secure user token
  $.ajaxSetup({
    headers: {
      "auth-token": localStorage.getItem("auth-token")
    }
  });

  function updateCosmetics() {
    $.ajax({
      type: "get",
      url: "/users/updateCosmetics",
      success: function(data) {
        getItem(data.activeAvatar, item => {
          $("#avatar")
            .children("img")
            .prop("src", item.imageLink);
        });
        getItem(data.activeAvatar, item => {
          $("html").css("background-image", item.imageLink);
        });
        getItem(data.activeAvatar, item => {
          $("#avatar").css("background-image", item.imageLink);
        });
      },
      error: function(e) {
        console.log(e.responseText);
      }
    });
  }

  function getItem(itemId, cb) {
    $.ajax({
      type: "get",
      url: `/items/${itemId}`,
      success: cb,
      error: function(e) {
        console.log(e.responseText);
      }
    });
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
    window.location.href = "/shop";
  });

  /** Takes user back to mycard page */
  $("#myCards").click(() => {
    window.location.href = "/mycard";
  });

  /** On page load, plays avatar animation */
  updateCosmetics();
  $("#avatar").toggleClass("bounceIn");
});
