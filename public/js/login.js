$(document).ready(() => {
  let print = user => {
    console.log("JSON.stringify(user)");
    // $("#userInfo").html("User Info: " + JSON.stringify(user));
  };

  $("#submit").click(() => {
    console.log("hello");
    if($("#pass").val().equals($("#cpass").val()))
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
    $("#signin").css("height", "#signupcon.height");
    $("#signupcon").css("display", "none");
    $("#signincon").css("display", "block");
  });

  $("#signup").click(() => {
    console.log("sign-up");
    $("#signin").css("border-bottom", "none");
    $("#signup").css("border-bottom", "2px solid #42A164");
    $("#signincon").css("display", "none");
    $("#signupcon").css("display", "block");
  });
});
