$(document).ready(() => {
  /** Takes user gameLobby page */
  $("#join").click(() => {
    $.ajax({
      type: "put",
      data: {
        sessionId: $("#roomNo").val(),
        sessionPass: $("#roomPass").val()
      },
      success: function(data) {},
      error: function(err) {
        M.toast({ html: err.responseText, classes: "red" });
      }
    });
    window.location.href = "gameLobby";
  });

  /** Takes user back to main menu */
  $("#back").click(() => {
    window.location.href = "main";
  });
});
