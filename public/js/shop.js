$(document).ready(() => {
  let selectedItem;
  let currentUserInfo;

  $.ajaxSetup({
    headers: {
      "auth-token": localStorage.getItem("auth-token")
    }
  });

  function getUserInfo(callback) {
    $.ajax({
      type: "get",
      url: "/login/me",
      success: function(data) {
        console.log(data);
        callback(data);
      },
      error: function(e) {
        console.log(e.responseText);
        callback("Unknown");
      }
    });
  }

  function setPointBalance(user) {
    $("#points").text(user.points);
  }

  function setPurchasedItems() {}

  function updateCosmetics() {
    $.ajax({
      type: "get",
      url: "/users/updateCosmetics",
      success: function(data) {
        $("#avatar")
          .children("img")
          .prop("src", data.activeAvatar);
        $("#avatar").css("background-image", data.activePlatform);
        $("html").css("background-image", data.activeBackground);
      },
      error: function(e) {
        console.log(e.responseText);
      }
    });
  }

  /** When user attempts to buy an item */
  $("#buy").click(() => {
    $.ajax({
      url: `/items/${selectedItem}`,
      dataType: "json",
      type: "put",
      success: function(data) {
        $(`#${data._id}`)
          .children("#cost4")
          .text("Owned");
        $("#buy").addClass("disabled");
        getUserInfo(setPointBalance);
        getUserInfo(userInfo => (currentUserInfo.items = userInfo.items));
        M.toast({
          html: `Purchased: ${data.name}`,
          classes: "blue"
        });
      },
      error: function(err) {
        console.log("ERROR: ", err.responseText);
        M.toast({
          html: err.responseText,
          classes: "red"
        });
      }
    });
  });

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
        if (currentUserInfo.items.find(userItem => userItem === item._id)) {
          $("#buy").addClass("disabled");
          localStorage.setItem(item.category, item.imageLink);
        } else {
          $("#buy").removeClass("disabled");
        }

        if (item.category === "avatar") {
          $("#char").prop("src", item.imageLink);
        } else if (item.category === "platform") {
          $("#char").css("background-image", `url(${item.imageLink})`);
        } else if (item.category === "background") {
          $("html").css("background-image", `url(${item.imageLink})`);
        }

        selectedItem = item._id;
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
    $("#slideAvatar").toggleClass("");
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

  // Calling all page setup functions
  updateCosmetics();
  getUserInfo(setPointBalance);
  getUserInfo(user => (currentUserInfo = user));
  $("#avatar").toggleClass("bounceIn");
  $("#shopAvatar").trigger("click");
});
