/** Dummy data */
var question = ["1", "2", "3", "54", "324"];
var answer = ["sad", "dad", "da", "ba", "saa"];

$(document).ready(() => {
    // setting encrypted and secure user token
    $.ajaxSetup({
        headers: {
            'auth-token': localStorage.getItem('auth-token')
        }
    });

    function getMyCard(callback) {
        console.log('getting my card');

        $.ajax({
            type: 'put',
            url: '/cards',
            dataType: 'json',
            data: {
                format: 'tf',
                category: 'test'
            },
            success: function(data) {
                console.log(data);
                callback(data.cards)
            },
            error: function(e) {
                console.log(e.responseText);
                callback("no card ?");
            }
        });
    }

    /** Populate cards from my list . . . Ta da */
    function populateCards(cards) {
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


    /** Calling setProfileInfo function */
    getMyCard(populateCards);


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
    $("#decksubmit").click(() => {
        $.ajax({
            type: "post",
            url: "/decks",
            dataType: 'json',
            data: {
                deckname: $("#deckname").val(),
            },
            success: deck => {
                console.log(JSON.stringify(deck));
                // window.location.href="";
            },
            error: err => {
                console.log(err);
                // $("#status").fadeOut().delay(3000).innerHTML("");
            }
        });


    });

});
