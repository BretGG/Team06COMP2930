$(document).ready(() => {

  $("#back").click(() => {
    window.location.href="main";
  });
  
    /** Dummy data */
    var ranks = [1, 2, 3, 4];
    var player = ["Hannah", "Bret", "Rose", "Jessica"];
    var points = [800, 400, 300, 200];
    var i = 0;

    /** Dummy function that adds players' ranking to page visually*/
    while(i < 4){
      var entry = document.createElement('div');
      entry.setAttribute('class', 'entry');

      var h5 = document.createElement('h5');
      h5.setAttribute('class', 'ranking')
      var rankNo = "#";
      rankNo += ranks[i];
      h5.textContent = rankNo;

      var userName = document.createElement('div');
      userName.setAttribute('class', 'userInfo name');
      userName.textContent = player[i];

      var score = document.createElement('div');
      score.setAttribute('class', 'userInfo score');
      score.textContent = points[i];

      entry.appendChild(h5);
      entry.appendChild(userName);
      entry.appendChild(score); 
      $('#roomCon').append(entry);
      i++;
    }

});
