$(document).ready(() => {

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


  /** Takes user gameLobby page */
  $("#submit").click(() => {
    console.log("join");
    $.ajax({
      type: "put",
      url: "/game",
      data: {
        sessionId: $("#roomNo").val(),
        sessionPass: $("#roomPass").val()
      },
      success: function(data) {
        console.log("joined room: ", data);
        window.location.href = "/game/lobby";
      },
      error: function(err) {
        M.Toast.dismissAll();
        M.toast({
          html: err.responseText,
          classes: "redcolor",
          displayLength: 2500 });
      }
    });
  });

  //Calls function to update background
  updateCosmetics();

  /** Takes user back to main menu */
  $("#back").click(() => {
    window.location.href = "main";
  });
});
