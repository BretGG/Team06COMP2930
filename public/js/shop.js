$(document).ready(() => {

  $.ajaxSetup({
    headers: {
      "auth-token": localStorage.getItem("auth-token")
    }
  });

  function getUserInfo(callback) {
    console.log("sign in");
    $.ajax({
      type: "get",
      url: "/login/me",
      success: function(data) {
        callback(data);
      },
      error: function(e) {
        console.log(e.responseText);
        callback("Unknown");
      }
    });
  }

  /** Grabs user's username and appends to it welcome text */
  function setProfileInfo(user) {
    $("#points").text(user.points);
  }

  /** Calling setProfileInfo function */
  getUserInfo(setProfileInfo);

  /** On page load, plays avatar animation */
  window.onload = function() {
    $("#avatar").toggleClass("bounceIn");
    $("#shopAvatar").trigger("click");
    if ($(window).width() < 400) 
      $("#back").html("<i class='material-icons'>home</i>");
      $("#shopBackground").html("BG");
      $("#shopPlatform").css("padding-left", "10px");
  };

  $(window).resize(function() {
    if ($(window).width() < 400) {
      $("#back").html("<i class='material-icons'>home</i>");
      $("#shopBackground").html("BG");
      $("#shopPlatform").css("padding-left", "10px");
    } else {
      $("#back i").addClass("left");
      $("#back").html("Main Menu<i class='material-icons left'>home</i>");
      $("#shopBackground").html("Background");
      $("#shopPlatform").css("padding-left", "16px");
    }
  });

  $("#back").click(() => {
    window.location.href = "main";
  });

  function getItems(category, cb) {
    $.ajax({
      url: `/items/${category}`,
      dataType: "json",
      type: "get",
      success: function(data) {
        cb(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log("ERROR:", jqXHR, textStatus, errorThrown);
      }
    });
  }

  function populateCarousel(items) {
    let innerHtml = "";
    for (let item of items) {
      innerHtml += `
        <div id=${item._id} class="carousel-item">
          <div class="singleGalleryTitle"> ${item.name}</div>
          <i class="material-icons left">filter_vintage</i>
          <div id="cost4" class="itemCost"> ${item.cost}</div>
        </div>`;
    }

    $("#slideAvatar").html(innerHtml);

    for (let item of items) {
      $(`#${item._id}`).click(() => {
        if(item.owned){
          $("#buy").addClass("disabled");
        } else {
          $("#buy").removeClass("disabled");
        }

        if (item.category === "avatar") {
          $("#char").prop("src", item.imageLink);
        }
        else if (item.category === "platform"){
          $("#char").css("background-image", `url(${item.imageLink})`);
        }
        else if (item.category === "background"){
          $("html").css("background-image", `url(${item.imageLink})`);
        }
      });

      $(`#${item._id}`).css("background-image", `url(${item.shopIcon})`);
    }

    if ($(".carousel").hasClass("initialized")) {
      $(".carousel").removeClass("initialized");
    }

    $(".carousel").carousel();
  }

  $("#shopAvatar").click(() => {
    $("#buy").addClass("disabled");
    $("#shopPlatform").css("background-color", "#26a69a");
    $("#shopBackground").css("background-color", "#26a69a");
    $("#shopAvatar").css("background-color", "#55B1C1");
    getItems("avatar", populateCarousel);
  });

  $("#shopPlatform").click(() => {
    $("#buy").addClass("disabled");
    $("#shopAvatar").css("background-color", "#26a69a");
    $("#shopBackground").css("background-color", "#26a69a");
    $("#shopPlatform").css("background-color", "#55B1C1");
    getItems("platform", populateCarousel);
  });

  $("#shopBackground").click(() => {
    $("#buy").addClass("disabled");
    $("#shopPlatform").css("background-color", "#26a69a");
    $("#shopAvatar").css("background-color", "#26a69a");
    $("#shopBackground").css("background-color", "#55B1C1");
    getItems("background", populateCarousel);
  });

});