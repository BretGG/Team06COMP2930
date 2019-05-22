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

      
    updateCosmetics();

    /** Takes user back to main menu */
  $("#back").click(() => {
    window.location.href = "main";
  });
});
