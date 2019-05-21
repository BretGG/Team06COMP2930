// TODO: Create button is gone when the screen width is smaller than 388px

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
        $(".headerLeft").css("border-bottom", "none");
        $(".headerRight").css("border-bottom", "2px solid #42A164");
        // $("#back").css("padding-top:", "15px");
        // $("#newdeck").hide();

    });

    /** Switches container from My Cards to Create Cards */
    $(".headerLeft").click(() => {
        $(".headerRight").css("border-bottom", "none");
        $(".headerLeft").css("border-bottom", "2px solid #42A164");
        $("#headerRightCon").hide();
        $("#headerLeftCon").show();
    });

    $("#back").click(() => {
        window.location.href = "main";
    });

    // function updateMessage(message, color){
    //     $('.toast').css('background-color', color);
    //     M.toast({html: message});
    // }

    function getDeckList(callback) {
        $.ajax({
            type: "get",
            url: "/decks",
            success: function(data) {
                callback(data.decks)
            },
            error: function(e) {
                console.log(e.responseText);
                callback("");
            }
        });
    }

    function setDeckList(decks) {
        if (decks.length == 0) {
            console.log("You have no deck!");
        } else {
            for (let mydeck of decks) {
                // deck.material_select();
                $('#myDeck').append($("<option></option>").attr("value", mydeck._id).text(mydeck.name));
                $('#creDeck').append($("<option></option>").attr("value", mydeck._id).text(mydeck.name));
            }
            $('#myDeck').formSelect();
            $('#creDeck').formSelect();
        }
    }
    /** Calling setDeckList function */
    getDeckList(setDeckList);


    /*******************************************************************/
    /**           Down here, it is for displaying my cards!            */
    /*******************************************************************/

    function getMyCard(callback, currentDeck, currentCate) {
        console.log("Function getMyCard in myCards.js is working now");
        // if (currentCate) {
        $.ajax({
            type: 'put',
            url: '/cards/get',
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
                p.textContent = `${mycard.answer}`;

                $('#cardsCon').append(card);
                card.appendChild(h5);
                card.appendChild(p);
            }
        }
    }

    // initialize my card from the list
    getMyCard(populateCards);

    //this gets only the cards that user want in the specific category
    $("#myCate").change(function() {
        getMyCard(populateCards, $('select#deck').val(), $('select#myCate').val());
        console.log($('select#myCate').val());
    });

    //this gets only the cards that user want in the specific category
    $("#myDeck").change(function() {
        getMyCard(populateCards, $('select#myDeck').val(), $('select#myCate').val());
        console.log($('select#myDeck').val());
    });



    /*******************************************************************/
    /**             Down here, it is for creating cards!               */
    /*******************************************************************/
    $("#creDeck").change(function() {
        console.log($('select#creDeck').val());
        if ($('select#creDeck').val() == "createnewdeck") {
            document.getElementById("deckName").disabled = false;
            document.getElementById("deckName").setAttribute('value', "");
            document.getElementById("deckName").setAttribute('placeholder', 'Your New Deck!');
            // document.getElementById("deckName").setAttribute('background-color', 'rgb(217, 242, 237) !important');
        } else {
            document.getElementById("deckName").disabled = true;
            document.getElementById("deckName").setAttribute('value', $("#creDeck option:selected").text());
        }

    });

    /** This is for storing new cards as user wants! */
    $("#submitLeft").click(function() {

        if (!$('select#creCate').val() || !$('#deckName').val()) {
                M.toast({html: 'Category and Deck must be set!!!', classes: 'redcolor'});
        } else {
            if ($('select#creDeck').val() == 'createnewdeck') {
                //create a deck first
                $.ajax({
                    type: "post",
                    url: "/decks",
                    dataType: 'json',
                    data: {
                        name: $("#deckName").val(),
                    },
                    success: function(deck) {
                        console.log(JSON.stringify(deck));
                        //and then store new card on the new deck
                        $.ajax({
                            type: "post",
                            url: "/cards",
                            dataType: 'json',
                            data: {
                                format: "tf",
                                category: $('select#creCate').val(),
                                question: $("#question").val(),
                                answer: $("#answer").val(),
                                deck: deck._id //store deckId
                            },
                            success: function(card) {
                                updateMessage('Card successfully added. Check under My Cards', '#26a69a');
                                console.log("Card Created: " + JSON.stringify(card));

                                $("#question").text("");
                                document.getElementById("answer").setAttribute('value', "");

                            },
                            error: err => {
                                $("#status").text("Unforunate circumstance. Card failed to be added.");
                                console.log(err);
                                // $("#status").fadeOut().delay(3000).innerHTML("");
                            }
                        });
                    },
                    error: err => {
                        console.log(err);
                    }
                });
            } else {
                $.ajax({
                    type: "post",
                    url: "/cards",
                    data: {
                        format: "tf",
                        category: $('select#creCate').val(),
                        question: $("#question").val(),
                        answer: $("#answer").val(),
                        deck: $('select#creDeck').val() //store deckId
                    },
                    success: function(card) {
                        updateMessage('Card successfully added. Check under My Cards', '#26a69a');
                        console.log(JSON.stringify(card));
                        document.getElementById("question").setAttribute('value', "");
                        document.getElementById("answer").setAttribute('value', "");
                        $("#status").fadeOut().delay(3000).text("");

                    },
                    error: err => {
                        $("#status").text("Unforunate circumstance. Card failed to be added.");
                        console.log(err);
                        // $("#status").fadeOut().delay(3000).innerHTML("");
                    }
                });
            }

        }
    });









});
