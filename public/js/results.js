$(document).ready(() => {
    var ranks = [1, 2, 3, 4];
    var player = ["Hannah", "Bret", "Rose", "Jessica"];
    var points = [800, 400, 300, 200];
    var i = 0;

    while(i < 4){
      var entry = document.createElement('div');
      entry.setAttribute('class', 'entry');

      var h3 = document.createElement('h3');
      h3.setAttribute('class', 'ranking')
      var rankNo = "#";
      rankNo += ranks[i];
      h3.textContent = rankNo;

      var userName = document.createElement('div');
      userName.setAttribute('class', 'userInfo name');
      userName.textContent = player[i];

      var score = document.createElement('div');
      score.setAttribute('class', 'userInfo score');
      score.textContent = points[i];

      entry.appendChild(h3);
      entry.appendChild(userName);
      entry.appendChild(score); 
      $('#roomCon').append(entry);
  
      
      i++;
    }

});
