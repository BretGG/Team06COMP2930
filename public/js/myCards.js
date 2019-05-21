// TODO: Create button is gone when the screen width is smaller than 388px
let myDecks;
let allMyCards;

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

    function createCard(cardData) {
        let card = document.createElement('div');
        card.setAttribute('class', 'card');

        let h5 = document.createElement('h5');
        $(h5).css("padding-left", "8px");
        $(h5).css("padding-top", "3px");
        h5.textContent = cardData.question;

        let p = document.createElement('p');
        $(p).css("padding-left", "8px");
        p.textContent = `${cardData.answer}`;

        $('#cardsCon').append(card);
        card.appendChild(h5);
        card.appendChild(p);
    }

    function getDeckList(callback) {
        $.ajax({
            type: "get",
            url: "/decks",
            success: function(data) {
                callback(data);
            },
            error: function(e) {
                console.log(e.responseText);
            }
        });
    }


    function getAllMyCards(callback){
        $.ajax({
            type: 'get',
            url: '/decks/allcards',
            success: function(data) {
                allMyCards = data;
                callback(data);
            },
            error: function(e) {
                console.log(e.responseText);
            }
        });

    }
    //set up the  initial setting including cards.
    function setDeckList(decks) {
        if (decks.length == 0) {
            console.log("You have no deck!");
        } else {
            for (let deck of decks) {
                $('#myDeck').append($("<option></option>").attr("value", deck._id).text(deck.name));
                $('#creDeck').append($("<option></option>").attr("value", deck._id).text(deck.name));
            }
            $('#myDeck').formSelect();
            $('#creDeck').formSelect();
        }
    }

    function setCardList(cards) {
        myCards = cards;

    }



    /*******************************************************************/
    /**           Down here, it is for displaying my cards!            */
    /*******************************************************************/


    // function getMyCard(callback, currentDeck, currentCate) {
        // console.log("Function getMyCard in myCards.js is working now");
        // $.ajax({
        //     type: "get",
        //     url: "/decks",
        //     success: function(data) {
        //         for (let eachdeck of data.decks) {
        //             console.log(eachdeck);
        //             $.ajax({
        //                 type: 'get',
        //                 url: '/decks/card',
        //                 dataType: 'json',
        //                 data: {
        //                     deckId: eachdeck._id
        //                 },
        //                 success: function(data) {
        //                     callback(data.cards)
        //                 },
        //                 error: function(e) {
        //                     console.log(e.responseText);
        //                     callback("");
        //                 }
        //             });
        //         }
        //     },
        //     error: function(e) {
        //         console.log(e.responseText);
        //         callback("");
        //     }
        // });

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
    }

    /** Populate cards from my list . . . Ta da */
    function populateCards(cards) {
        $(".card").remove();
        console.log(cards);
        if (!cards) {
            console.log("I told you no card!");
        } else {
            for (let mycard of cards) {
                createCard(mycard);
            }
        }
    }


    //this gets only the cards that user want in the specific category
    $("#myCate").change(function() {
        getMyCard(populateCards, $('select#deck').val(), $('select#myCate').val());
        console.log($('select#myCate').val());
        console.log(allMyCards);
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
            M.toast({
                html: 'Category and Deck must be set!',
                classes: 'redcolor'
            });
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
                    success: deck => {
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
                            success: card => {
                                M.toast({
                                    html: 'Card successfully added.<br>Check under My Cards',
                                    classes: 'greencolor'
                                });
                                console.log("Card Created: " + JSON.stringify(card));

                                document.getElementById("question").setAttribute('value', "");
                                document.getElementById("answer").setAttribute('value', "");

                            },
                            error: err => {
                                M.toast({
                                    html: "Unforunate circumstance. Card failed to be added.",
                                    classes: "redclor"
                                });
                                console.log(err);
                                // $("#status").fadeOut().delay(3000).innerHTML("");
                            }
                        });
                    },
                    error: err => {
                        M.toast({
                            html: "Unforunate circumstance. Deck failed to be added.",
                            classes: "redclor"
                        });
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
                    success: card => {
                        M.toast({
                            html: 'Card successfully added. Check under My Cards',
                            classes: 'greencolor'
                        });
                        console.log(JSON.stringify(card));
                        document.getElementById("question").setAttribute('value', "");
                        document.getElementById("answer").setAttribute('value', "");
                    },
                    error: err => {
                        M.toast({
                            html: "Unforunate circumstance. Card failed to be added.",
                            classes: "redclor"
                        });
                        console.log(err);
                        // $("#status").fadeOut().delay(3000).innerHTML("");
                    }
                });
            }

        }
    });

    console.log(allMyCards);
    /** Calling setDeckList function */
    getDeckList(setDeckList);
        // initialize my card from the list
        getAllMyCards(populateCards);

        // let scienceCards = allMyCards.filter(card => card.category === "science");

});
