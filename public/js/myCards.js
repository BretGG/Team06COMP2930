// TODO: Create button is gone when the screen width is smaller than 388px

var question = ["1", "2", "3", "54", "324"];
var answer = ["sad", "dad", "da", "ba", "saa"];

$(document).ready(() => {
    // setting encrypted and secure user token
    $.ajaxSetup({
        headers: {
            'auth-token': localStorage.getItem('auth-token')
        }
    });

    $('select').formSelect();
    $('#headerLeftCon').hide();



    /** Switches container from Create Cards to My Cards */
    $(".headerRight").click(() => {
        $("#status").text("");
        $('#headerLeftCon').hide();
        $('#headerRightCon').show();
        // $(".headerLeft").css("border-bottom", "none");
        // $(".headerRight").css("border-bottom", "2px solid #42A164");
        // $("#back").css("padding-top:", "15px");
        // $(".headerLeftCon").hide();
        // $(".headerRightCon").show();
        // $("#newdeck").hide();

    });

    /** Switches container from My Cards to Create Cards */
    $(".headerLeft").click(() => {
        // $(".headerRight").css("border-bottom", "none");
        // $(".headerLeft").css("border-bottom", "2px solid #42A164");
        $("#headerRightCon").hide();
        $("#headerLeftCon").show();
    });

    /*******************************************************************/
    /**           Down here, it is for displaying my cards!            */
    /*******************************************************************/

    function getMyCard(callback, currentDeck, currentCate) {
        console.log("Function getMyCard in myCards.js is working now");
        // if (currentCate) {
            $.ajax({
                type: 'put',
                url: '/cards',
                dataType: 'json',
                data: {
                    format: 'tf',
                    deck: currentDeck,
                    category: currentCate
                },
                success: function(data) {
                    callback(data.cards)
                },
                error: function(e) {
                    console.log(e.responseText);
                    callback("");
                }
            });
        // }
    }

    /** Populate cards from my list . . . Ta da */
    function populateCards(cards) {
        $(".card").remove();
        if (cards.length == 0) {
            console.log("I told you no card!");
        } else {
            for (let mycard of cards) {
                let card = document.createElement('div');
                card.setAttribute('class', 'card');

                let h5 = document.createElement('h5');
                $(h5).css("padding-left", "8px");
                $(h5).css("padding-top", "3px");
                h5.textContent = mycard.question;

                let p = document.createElement('p');
                $(p).css("padding-left", "8px");
                // movie.description = movie.description.substring(0, 300);
                p.textContent = `${mycard.answer}...`;

                $('#cardsCon').append(card);
                card.appendChild(h5);
                card.appendChild(p);
            }
        }
    }

    // initialize my card from the list
    getMyCard(populateCards);

    //this gets only the cards that user want in the specific category
    $("#category").change(function() {
        getMyCard(populateCards, $('select#deck').val(), $('select#category').val());
        console.log($('select#category').val());
    });

    //this gets only the cards that user want in the specific category
    $("#deck").change(function() {
        getMyCard(populateCards, $('select#deck').val(), $('select#category').val());
        console.log($('select#deck').val());
    });



    /*******************************************************************/
    /**             Down here, it is for creating cards!               */
    /*******************************************************************/

    /** This is for storing new cards as user wants! */
    $("#submitLeft").click(() => {
        console.log("Category: " + $('select#category').val());
        console.log($("Deck: " + 'select#deck').val());
        $.ajax({
            type: "post",
            url: "/cards",
            dataType: 'json',
            data: {
                format: "tf",
                category: $('select#category').val(),
                question: $("#question").val(),
                answer: $("#answer").val(),
                deck: $('select#deck').val()
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
