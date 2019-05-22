$(document).ready(() => {
  let lobbyInfo;

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
        $("html").css(
          "background-image",
          `url(${data.activeBackground.imageLink})`
        );
      },
      error: function(e) {
        console.log(e.responseText);
      }
    });
  }

  // Sets lobbyInfo and calls the cb with returned data
  function getLobbyInfo(cb) {
    console.log("get lobby info");
    $.ajax({
      type: "get",
      url: "../../game/lobbyinfo",
      success: function(data) {
        console.log(data);
        lobbyInfo = data;
        cb(lobbyInfo);
      },
      error: function(err) {
        console.log(err.responseText);
        // Let the user know that they have no lobby and send back to main page
      }
    });
  }

  updateCosmetics();

  /** Max number of players in a game lobby */
  var max = 4;
  /** Dummy counter */
  var count = 0;
  /** Dummy players info */
  var username = ["Stella", "Jessica", "Rose", "Hannah", "Bret"];

  /**Takes you to game page */
  $("#start").click(() => {
    window.location.href = "game";
  });

  /**Takes you back to the main page */
  $("#back").click(() => {
    window.location.href = "../main";
  });

  /**Function disappear all players in the room */
  $("#memberpool").click(() => {
    console.log("k");
    if (count < 4) {
      const member = document.createElement("div");
      member.setAttribute("class", "member");
      member.textContent = username[count];
      $("#memberpool").append(member);
      count++;
    }
  });

  function connectSocket(lobby) {
    console.log("/" + lobby.sessionId);
    socket = io("/hello");
  }

  getLobbyInfo(connectSocket);

  console.log("Game lobby");
});
