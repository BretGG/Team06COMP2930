$(document).ready(() => {
  let print = user => {
    $("#userInfo").html("User Info: " + JSON.stringify(user));
  };

  $("#submit").click(() => {
    console.log("hello");
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
});
