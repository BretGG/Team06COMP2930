$(document).ready(() => {
  let print = user => {
    console.log("JSON.stringify(user)");
    // $("#userInfo").html("User Info: " + JSON.stringify(user));
  };

  $("#submit").click(() => {
    console.log("hello");
    if (
      $("#pass")
        .val()
        .equals($("#cpass").val())
    )
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

  $("#signin").click(() => {
    console.log("sign-in");
    $("#signup").css("border-bottom", "none");
    $("#signin").css("border-bottom", "2px solid #42A164");
    $("#cpass0").css("display", "none");
    $("#cpass1").css("display", "none");
    $("#email0").css("display", "none");
    $("#email1").css("display", "none");
  });

  $("#signup").click(() => {
    console.log("sign-up");
    $("#signin").css("border-bottom", "none");
    $("#signup").css("border-bottom", "2px solid #42A164");
    $("#cpass0").css("display", "inline");
    $("#cpass1").css("display", "inline");
    $("#email0").css("display", "inline");
    $("#email1").css("display", "inline");
  });
});
