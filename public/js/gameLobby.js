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

  function displayMembers(players) {
    $("#memberpool").html("");
    for (let player of players) {
      const member = document.createElement("div");
      member.setAttribute("class", "member");
      member.textContent = player.username;
      $("#memberpool").append(member);
    }
  }

  updateCosmetics();

  /** Current Lobby Members */
  let lobbyMembers = [];

  /**Takes you to game page */
  $("#start").click(() => {
    window.location.href = "game";
  });

  /**Takes you back to the main page */
  $("#back").click(() => {
    window.location.href = "../main";
  });

  function connectSocket(lobby) {
    $("#roomNo").html(lobby.sessionId);
    socket = io("http://localhost:3001");
    socket.emit("register", localStorage.getItem("auth-token"));
    socket.on("users", users => {
      lobbyMembers = [];
      lobbyMembers.push(...users);
      displayMembers(lobbyMembers);
      console.log(users);
      console.log(lobbyMembers);
    });
    socket.on("noavailablelobby", () => console.log("No available lobby"));
  }

  getLobbyInfo(connectSocket);

  console.log("Game lobby");
});
