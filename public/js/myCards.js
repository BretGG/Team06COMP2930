var question = ["1", "2", "3", "54", "324"];
var answer = ["sad", "dad", "da", "ba", "saa"];

$(document).ready(() => {
    $('#cardsCon').click(() => {
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

    $(".headerRight").click(() => {
        $("#status").text("");
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

        $.ajax({
            type: "post",
            url: "/cards",
            dataType: 'json',
            data: {
                question: $("#question").val(),
                format: "tf",
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
