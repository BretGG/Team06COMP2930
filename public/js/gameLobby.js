$(document).ready(() => {
  let lobbyInfo;

  //Preloads jwt into ajax header 
  $.ajaxSetup({
    headers: {
      "auth-token": localStorage.getItem("auth-token")
    }
  });

  //Updates background according to the active background user has equipped.
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

  //Displays users on front end
  function displayMembers(players) {
    $("#memberpool").html("");
    for (let player of players) {
      const member = document.createElement("div");
      member.setAttribute("class", "member");
      member.textContent = player.username;
      $("#memberpool").append(member);
    }
  }

  /** Current Lobby Members */
  let lobbyMembers = [];

  // 
  //
  //           START OF
  //
  //     STELLA'S TESTING AREA
  //
  //
  //
  //ø
  //

  var test = ["StellaKING", "StellaPeasant", "StellaRook", "StellaKnight"];

  function addMembers(){
    test.forEach((user) => {
      console.log(user);
      let ava = $('<div class="icon"></div>');

      //THIS IS WHERE USER.ACTIVEAVATAR GOES V
      ava.css("background-image", "url('../images/avatar/default.png')");
      let con = $('<div class="memberCon" id="' + user + '">' + '</div>');
      
      //THIS IS FOR THE USER THAT IS ROOM MASTER!!!
      if(user == "StellaKING"){
        let crown = $('<img class="crown" src="../images/crown.png" />');
        ava.append(crown);
      } else {
        let crown = $('<img class="crown" style="visibility: hidden" src="../images/crown.png" />');
        ava.append(crown);
      }

      let name = $('<div class="name">' + user + '</div>');

      con.append(ava);
      con.append(name);
      $("#memberpool").append(con);
    })

    
  }

  /**Takes you to game page */
  $("#start").click(() => {
    addMembers();
    // window.location.href = "../game";
  });

  // 
  //
  //            END OF 
  //
  //     STELLA'S TESTING AREA
  //
  //
  //
  //
  //

  /**Takes you back to the main page */
  $("#back").click(() => {
    window.location.href = "../main";
  });

  //Registers user into lobby
  function connectSocket(lobby) {
    $("#roomNo").html(lobby.sessionId);
    socket = io("http://localhost:3001");
    socket.emit("register", localStorage.getItem("auth-token"));
    socket.on("users", users => {
      lobbyMembers = [];
      lobbyMembers.push(...users);
      displayMembers(lobbyMembers);
    });
    socket.on("noavailablelobby", () => console.log("No available lobby"));
  }

  //Connects Lobby into Socket.io
  getLobbyInfo(connectSocket);
  //Calls function to update background
  updateCosmetics();
});
