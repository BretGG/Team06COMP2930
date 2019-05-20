$(document).ready(() => {
  $(".carousel").carousel();

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
    <div id=${item._id} 
     class="carousel-item" href="#four!" style="background-color= red;"
    >
          <div class="singleGalleryTitle">
            ${item.name}
          </div>
          <i class="material-icons left">filter_vintage</i>
          <div id="cost4" class="itemCost">
            ${item.cost}
          </div>
    </div>
    `;
    }

    $("#slideAvatar").html(innerHtml);

    for (let item of items) {
      $(`#${item._id}`).click(() => {
        console.log("click");
        if (item.category === "avatar") $("#char").prop("src", item.imageLink);
        else if (item.category === "platform")
          $("#char").css("background-image", item.imageLink);
        else if (items.category === "bg")
          $("html").css("background-image", item.imageLink);
      });

      console.log(item);

      $(`#${item._id}`).css("background-image", `url(${item.shopIcon})`);
    }

    if ($(".carousel").hasClass("initialized")) {
      $(".carousel").removeClass("initialized");
    }

    $(".carousel").carousel();
  }

  $("#shopAvatar").click(() => {
    getItems("avatar", populateCarousel);
  });

  $("#shopPlatform").click(() => {
    getItems("platform", populateCarousel);
  });

  $("#shopBackground").click(() => {
    getItems("background", populateCarousel);
  });

});