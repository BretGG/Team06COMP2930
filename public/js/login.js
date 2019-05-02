$(document).ready(() => {
  let print = user => {
    console.log("Printing User Info");
    $("#userInfo").html("User Info: " + JSON.stringify(user));
  };

  $("#submit").click(() => {
    console.log("submit");
    $.ajax({
      type: "post",
      url: "/users",
      data: {
        username: $("#uname").val(),
        email: $("#email").val(),
        password: $("#pass").val()
      },
      success: user => print(user),
      error: err => print(err.responseText)
    });
  });

  $("#login").click(() => {
    console.log("login");
    $.ajax({
      type: "post",
      url: "/login",
      data: {
        username: $("#uname").val(),
        email: $("#email").val(),
        password: $("#pass").val()
      },
      success: user => print(user),
      error: err => print(err.responseText)
    });
  });

  $("#StartSession").click(() => {
    console.log("StartSession");
    $.ajax({
      type: "post",
      url: "/game",
      data: {
        owner: $("#email").val(),
        gameType: "ecoQuest",
        sessionPass: "something",
        sessionId: "somethingElse"
      },
      success: user => print(user),
      error: err => print(err.responseText)
    });
  });
});
