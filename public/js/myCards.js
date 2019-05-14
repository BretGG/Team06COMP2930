/** Dummy data */
var question = ["1", "2", "3", "54", "324"];
var answer = ["sad", "dad", "da", "ba", "saa"];

$(document).ready(() => {

    /** Dummy function that will add dummy cards to screen */
    $('#cardsCon').click(()=>{
      const card = document.createElement('div');
      card.setAttribute('class', 'card');

      const h5 = document.createElement('h5');
      $(h5).css("padding-left", "8px");
      $(h5).css("padding-top", "3px");
      h5.textContent = question[0];

      const p = document.createElement('p');
      $(p).css("padding-left", "8px");
      // movie.description = movie.description.substring(0, 300);
      p.textContent = `${answer[0]}...`;

      $('#cardsCon').append(card);
      card.appendChild(h5);
      card.appendChild(p);     
    });

    /** Switches container from Create Cards to My Cards */
    $(".headerRight").click(() => {
        $("#status").text("");
        $(".headerLeft").css("border-bottom", "none");
        $(".headerRight").css("border-bottom", "2px solid #42A164");
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
        $("#status").text("Card successfully added. Check under My Cards");

        //Did not route to myCards.html yet so idk if this ajax will work.

        // $.ajax({
        //         type: "post",
        //         url: "/users",
        //         dataType: 'json',
        //         data: {
        //             question: $("#question").val(),
        //             correct_answer: $("#answer").val(),
        //         },
        //         success: user => {
        //             $("#status").innerHTML("Card successfully added. Check under My Cards");
        //             print($("#question").val() + "\n" + $("#answer").val())
        //             window.location.href="/";
        //             $("#status").fadeOut().delay(3000).innerHTML("");
        //         },
        //         error: err => {
        //             // print(err.responseText)
        //             $("#status").innerHTML("Unforunate circumstance. Card failed to be added.");
        //             $("#status").fadeOut().delay(3000).innerHTML("");
        //         }
        // });
    });

});
