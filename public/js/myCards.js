var question = ["1", "2", "3", "54", "324"];
var answer = ["sad", "dad", "da", "ba", "saa"];
$(document).ready(() => {
    $('#cardsCon').click(()=>{
      const card = document.createElement('div');
      card.setAttribute('class', 'card');

      const h4 = document.createElement('h4');
      h4.textContent = question[0];

      const p = document.createElement('p');
      // movie.description = movie.description.substring(0, 300);
      p.textContent = `${answer[0]}...`;

      $('#cardsCon').append(card);
      card.appendChild(h4);
      card.appendChild(p);     
    });

    $(".headerRight").click(() => {
        $(".headerLeft").css("border-bottom", "none");
        $(".headerRight").css("border-bottom", "2px solid #42A164");
        $(".headerLeftCon").hide();
        $(".headerRightCon").show();
    });

    $(".headerLeft").click(() => {
        $(".headerRight").css("border-bottom", "none");
        $(".headerLeft").css("border-bottom", "2px solid #42A164");
        $(".headerRightCon").hide();
        $(".headerLeftCon").show();
    });

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
