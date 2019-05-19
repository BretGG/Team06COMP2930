// var active = "avatar";
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
        callback(data.user);
      },
      error: function(e) {
        console.log(e.responseText);
        callback("Unknown");
      }
    });
  }

  /** Grabs user's username and appends to it welcome text */
  function setProfileInfo(user) {
    // var points = '<i class="material-icons left">filter_vintage</i>';

    $("#points").text(user.points);
    // $('#points').appendChild(points);
  }

  /** Calling setProfileInfo function */
  getUserInfo(setProfileInfo);

  /** On page load, plays avatar animation */
  window.onload = function() {
    $("#avatar").toggleClass("bounceIn");
  };

  $("#back").click(() => {
    window.location.href = "main";
  });

  function getItems(category, cb) {
    $.ajax({
      url: `/items/${category}`,
      dataType: "json",
      type: "get",
      success: function(data) {
        console.log("status: success", data);
        cb(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log("ERROR:", jqXHR, textStatus, errorThrown);
      }
    });
  }

  function populateCarousel(items) {
    // Buld the amazing carousel
    let innerHtml = "";
    for (let item of items) {
      innerHtml += `
        <div id=${item._id} class="carousel-item" href="#four!">
          <div class="singleGalleryTitle">
            ${items.name}
          </div>
          <i class="material-icons left">filter_vintage</i>
          <div id="cost4" class="itemCost">
            ${item.cost}
          </div>
		</div>
		`;
    }

    console.log(innerHtml);
    $("#slideAvatar").html(innerHtml);

    for (let item of items) {
      $(`#${item.id}`).click(() => {
        if (item.category === "avatar") $("#char").prop("src", item.imageLink);
        else if (item.category === "platform")
          $("#char").css("background-image", item.imageLink);
        else if (items.category === "bg")
          $("html").css("background-image", item.imageLink);
      });
    }
  }

  $("#shopAvatar").click(() => {
    getItems("avatar", populateCarousel);

    //     $("#buy").removeClass("disabled");

    //     $("#shopPlatform").css("background-color", "#26a69a");
    //     $("#shopBackground").css("background-color", "#26a69a");
    //     $("#shopAvatar").css("background-color", "#55B1C1");
    //     $("#item1").css(
    //       "background-image",
    //       "url(../images/shopIcons/avatar/default.png)"
    //     );
    //     $("#item2").css(
    //       "background-image",
    //       "url(../images/shopIcons/avatar/greenChar.png)"
    //     );
    //     $("#item3").css(
    //       "background-image",
    //       "url(../images/shopIcons/avatar/greyChar.png)"
    //     );
    //     $("#item4").css(
    //       "background-image",
    //       "url(../images/shopIcons/avatar/yellowChar.png)"
    //     );
    //     $("#item5").css(
    //       "background-image",
    //       "url(../images/shopIcons/avatar/redChar.png)"
    //     );
    //     $("#item6").css(
    //       "background-image",
    //       "url(../images/shopIcons/avatar/blueChar.png)"
    //     );
    //     $("#ditem1").text("Black Sesame");
    //     $("#ditem2").text("Green Apple");
    //     $("#ditem3").text("Cloud");
    //     $("#ditem4").text("Mango");
    //     $("#ditem5").text("Red Apple");
    //     $("#ditem6").text("Blueberry");
    //     $("#cost1").text("0");
    //     $("#cost2").text("200");
    //     $("#cost3").text("100");
    //     $("#cost4").text("250");
    //     $("#cost5").text("200");
    //     $("#cost6").text("300");
    //     active = "avatar";
  });

  $("#shopPlatform").click(() => {
    getItems("platform", populateCarousel);
    //     $("#buy").addClass("disabled");
    //     $("#shopAvatar").css("background-color", "#26a69a");
    //     $("#shopBackground").css("background-color", "#26a69a");
    //     $("#shopPlatform").css("background-color", "#55B1C1");
    //     $("#item1").css(
    //       "background-image",
    //       "url(../images/shopIcons/platform/default.png)"
    //     );
    //     $("#item2").css(
    //       "background-image",
    //       "url(../images/shopIcons/platform/pinkplatform.png)"
    //     );
    //     $("#item3").css(
    //       "background-image",
    //       "url(../images/shopIcons/platform/purpleplatform.png)"
    //     );
    //     $("#item4").css(
    //       "background-image",
    //       "url(../images/shopIcons/platform/rabbitpet.png)"
    //     );
    //     $("#item5").css(
    //       "background-image",
    //       "url(../images/shopIcons/platform/duckpet.png)"
    //     );
    //     $("#item6").css(
    //       "background-image",
    //       "url(../images/shopIcons/platform/birdpet.png)"
    //     );
    //     $("#ditem1").text("Flying Grass");
    //     $("#ditem2").text("Modest Flowers");
    //     $("#ditem3").text("Exquisite Flowers");
    //     $("#ditem4").text("Pet Rabbit");
    //     $("#ditem5").text("Pet Duck");
    //     $("#ditem6").text("Pet Bird");
    //     $("#cost1").text("0");
    //     $("#cost2").text("200");
    //     $("#cost3").text("100");
    //     $("#cost4").text("250");
    //     $("#cost5").text("200");
    //     $("#cost6").text("300");
    //     active = "platform";
  });

  $("#shopBackground").click(() => {
    getItems("background", populateCarousel);

    // $("#shopPlatform").css("background-color", "#26a69a");
    // $("#shopAvatar").css("background-color", "#26a69a");
    // $("#shopBackground").css("background-color", "#55B1C1");
    // $("#item1").css(
    //   "background-image",
    //   "url(../images/shopIcons/bg/default.png)"
    // );
    // $("#item2").css("background-image", "url(../images/shopIcons/bg/city.png)");
    // $("#item3").css(
    //   "background-image",
    //   "url(../images/shopIcons/bg/darkblue.png)"
    // );
    // $("#item4").css(
    //   "background-image",
    //   "url(../images/shopIcons/bg/night.png)"
    // );
    // $("#item5").css(
    //   "background-image",
    //   "url(../images/shopIcons/bg/pixelatedbg.png)"
    // );
    // $("#item6").css(
    //   "background-image",
    //   "url(../images/shopIcons/bg/sunset.png)"
    // );
    // $("#ditem1").text("Forest View");
    // $("#ditem2").text("City Sunset");
    // $("#ditem3").text("Blue Skies");
    // $("#ditem4").text("Purple Night");
    // $("#ditem5").text("Pixelated Ocean");
    // $("#ditem6").text("Sunset");
    // $("#cost1").text("0");
    // $("#cost2").text("250");
    // $("#cost3").text("200");
    // $("#cost4").text("150");
    // $("#cost5").text("100");
    // $("#cost6").text("50");
    // active = "bg";
  });

  //   $("#item1").click(() => {
  //     if (active == "avatar")
  //       $("#char").prop("src", "../images/avatar/default.png");
  //     else if (active == "platform")
  //       $("#char").css("background-image", "url(../images/platform/default.png)");
  //     else if (active == "bg")
  //       $("html").css("background-image", "url(../images/bg/default.png)");
  //   });

  //   $("#item2").click(() => {
  //     if (active == "avatar")
  //       $("#char").prop("src", "../images/avatar/greenChar.png");
  //     else if (active == "platform")
  //       $("#char").css(
  //         "background-image",
  //         "url(../images/platform/pinkplatform.png)"
  //       );
  //     else if (active == "bg")
  //       $("html").css("background-image", "url(../images/bg/city.png)");
  //   });

  //   $("#item3").click(() => {
  //     if (active == "avatar")
  //       $("#char").prop("src", "../images/avatar/greyChar.png");
  //     else if (active == "platform")
  //       $("#char").css(
  //         "background-image",
  //         "url(../images/platform/purpleplatform.png)"
  //       );
  //     else if (active == "bg")
  //       $("html").css("background-image", "url(../images/bg/darkblue.png)");
  //   });

  //   $("#item4").click(() => {
  //     if (active == "avatar")
  //       $("#char").prop("src", "../images/avatar/yellowChar.png");
  //     else if (active == "platform")
  //       $("#char").css(
  //         "background-image",
  //         "url(../images/platform/rabbitpet.png)"
  //       );
  //     else if (active == "bg")
  //       $("html").css("background-image", "url(../images/bg/night.png)");
  //   });

  //   $("#item5").click(() => {
  //     if (active == "avatar")
  //       $("#char").prop("src", "../images/avatar/redChar.png");
  //     else if (active == "platform")
  //       $("#char").css("background-image", "url(../images/platform/duckpet.png)");
  //     else if (active == "bg")
  //       $("html").css("background-image", "url(../images/bg/pixelatedbg.png)");
  //   });

  //   $("#item6").click(() => {
  //     if (active == "avatar")
  //       $("#char").prop("src", "../images/avatar/blueChar.png");
  //     else if (active == "platform")
  //       $("#char").css("background-image", "url(../images/platform/birdpet.png)");
  //     else if (active == "bg")
  //       $("html").css("background-image", "url(../images/bg/sunset.png)");
  //   });
});
