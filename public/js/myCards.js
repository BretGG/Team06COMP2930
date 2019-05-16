// TODO: Create button is gone when the screen width is smaller than 388px

var question = ["1", "2", "3", "54", "324"];
var answer = ["sad", "dad", "da", "ba", "saa"];

$(document).ready(() => {
    $('select').formSelect();

  $("#back").click(() => {
    window.location.href="main";
  });

    // setting encrypted and secure user token
    $.ajaxSetup({
        headers: {
            'auth-token': localStorage.getItem('auth-token')
        }
    });

    /** Dummy function that will add dummy cards to screen */
    $('#cardsCon').click(()=>{
      var card = document.createElement('div');
      card.setAttribute('class', 'card');

      var h6 = document.createElement('h5');
      $(h6).css("padding-left", "8px");
      $(h6).css("padding-top", "0px");
      h6.textContent = question[0];

      var p = document.createElement('p');
      $(p).css("padding-left", "8px");
      p.textContent = `${answer[0]}...`;

      $('#cardsCon').append(card);
      card.appendChild(h6);
      card.appendChild(p);
    });

    /** Switches container from Create Cards to My Cards */
    $(".headerRight").click(() => {
        $("#status").text("");
        $(".headerLeft").css("border-bottom", "none");
        $(".headerRight").css("border-bottom", "2px solid #42A164");
        $("#back").css("padding-top:", "15px");
        $(".headerLeftCon").hide();
        $(".headerRightCon").show();
    });

    /** Switches container from My Cards to Create Cards */
    $(".headerLeft").click(() => {
        $(".headerRight").css("border-bottom", "none");
        $(".headerLeft").css("border-bottom", "2px solid #42A164");
        $(".headerRightCon").hide();
        $(".headerLeftCon").show();
    });

    /** Dummy function that updates page to let user know, card was successfully created */
    $("#submitLeft").click(() => {

        $.ajax({
            type: "post",
            url: "/cards",
            dataType: 'json',
            data: {
            format: "tf",
            category: "test",
                question: $("#question").val(),
                answer: $("#answer").val(),
                deck: "test"
            },
            success: card => {
                $("#status").text("Card successfully added. Check under My Cards");
                console.log(JSON.stringify(card));
                // window.location.href="";
                $("#status").fadeOut().delay(3000).text("");

            },
            error: err => {
                $("#status").text("Unforunate circumstance. Card failed to be added.");
                console.log(err);
                // $("#status").fadeOut().delay(3000).innerHTML("");
            }
        });


    });

});
