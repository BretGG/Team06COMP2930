$(document).ready(() => {
  /** Max number of players in a game lobby */
  var max = 4;
  /** Dummy counter */
  var count = 0;
  /** Dummy players info */
  var username = ["Stella", "Jessica", "Rose", "Hannah", "Bret"];

  /**Takes you to game page */
  $("#start").click(() => {
    window.location.href = "game";
  });

  /**Takes you back to the main page */
  $("#back").click(() => {
    window.location.href = "main";
  });

  /**Function disappear all players in the room */
  $("#memberpool").click(() => {
    console.log("k");
    if (count < 4) {
      const member = document.createElement("div");
      member.setAttribute("class", "member");
      member.textContent = username[count];
      $("#memberpool").append(member);
      count++;
    }
  });
});
