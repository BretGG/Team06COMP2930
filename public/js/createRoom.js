$(document).ready(() => {
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

  updateCosmetics();

  /**Takes you back to the main page */
  $("#back").click(() => {
    window.location.href = "main";
  });

  /** Create the new game lobby */
  $("#submit").click(() => {
    $.ajax({
      type: "post",
      url: "/game",
      data: {
        sessionId: $("#roomNo").val(),
        sessionPass: $("#roomPass").val(),
        gameType: "no yet implemented"
      },
      success: function(data) {
        window.location.href = "/game/lobby";
      },
      error: function(err) {
        M.Toast.dismissAll();
        M.toast({
          html: `${err.responseText}`,
          classes: "redcolor",
          displayLength: 2500
        });
      }
    });
  });
});
