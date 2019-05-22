// TODO: Create button is gone when the screen width is smaller than 388px
let allMyDecks;
let allMyCards;

$(document).ready(() => {
    // setting encrypted and secure user token
    $.ajaxSetup({
        headers: {
            'auth-token': localStorage.getItem('auth-token')
        }
    });

    $('select').formSelect();
    $('.modal').modal();
    $('#headerLeftCon').hide();


    /** Switches container from Create Cards to My Cards */
    $(".headerRight").click(() => {
        $('#headerLeftCon').hide();
        $('#headerRightCon').show();
        $(".headerLeft").css("border-bottom", "none");
        $(".headerRight").css("border-bottom", "2px solid #42A164");
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
        let card = $('<div class="card"></div>');
        let cardcategory = $('<span class="cardC">Category: ' + cardData.category + '</span>');

        let cardquestion = $('<p class="cardQ">' + cardData.question + '</p>');

        let edit = $('<a class = "modal-trigger editting hoverPointer" href = "#modal1" value = ' + cardData._id + '></a>');
        let editIcon = $('<i class= "cardE material-icons right">more_vert</i>');
        // $('.editting').innerHTML = "<i class= 'cardE material-icons right'>more_vert</i>"";


        let deleting = $('<a class = "modal-trigger deleting hoverPointer" href = "#modal2" value = ' + cardData._id + '></a>');
        let deletingIcon = $('<i class= "cardD material-icons right">delete</i>');

        let cardanswer = $('<p class = "cardA">' + cardData.answer + '</p>');

        $('#cardsCon').append(card);
        card.append(cardcategory, deleting, edit, cardquestion, cardanswer);
        edit.append(editIcon);
        deleting.append(deletingIcon);
    }

    $(document).on("click", ".editting", function() {
        let editdId = $(this).get(0).getAttribute('value');
        $('#editcard').text($(this).get(0).getAttribute('value'));
        // var editCon =
    });

    //DELETE THE CARD
    $(document).on("click", ".deleting", function() {
        let deleteId = $(this).get(0).getAttribute('value');
        $("#deleteyes").click(function() {
            $.ajax({
                type: "delete",
                url: "/cards/" + deleteId,
                dataType: "json",
                data: {
                    cardId: deleteId
                },
                success: function(data) {
                    window.location.href = "mycard";
                },
                error: function(e) {
                    console.log(e.responseText);
                }
            });
        });
    });

    function filterCard(cards, catefilter, deckfilter) {
        let filteredCards = cards;
        if (deckfilter) {
            console.log("filtering by deck");
            filteredCards = filteredCards.filter(card => card.deck == deckfilter);
        }
        if (catefilter) {
            console.log("filtering by category");
            filteredCards = filteredCards.filter(card => card.category == catefilter);
        }
        console.log(filteredCards);
        return filteredCards;
    }

    function getDeckList(callback) {
        $.ajax({
            type: "get",
            url: "/decks",
            success: function(data) {
                allMyDecks = data;
                callback(data);
            },
            error: function(e) {
                console.log(e.responseText);
            }
        });
    }

    function getAllMyCards(callback) {
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


    /*******************************************************************/
    /**           Down here, it is for displaying my cards!            */
    /*******************************************************************/
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


    //this gets only the cards that user want in the certain category and certain deck.
    $("#myCate, #myDeck").change(function() {
        populateCards(filterCard(allMyCards, $('select#myCate').val(), $('select#myDeck').val()));
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
                                // window.location.href = "/mycard";
                                M.toast({
                                    html: 'Success! Check under My Cards',
                                    classes: 'greencolor'
                                });

                                // document.getElementById("question").setAttribute('value', "");
                                // document.getElementById("answer").setAttribute('value', "");

                            },
                            error: err => {
                                M.toast({
                                    html: "Unforunate circumstance. Card failed to be added.",
                                    classes: "redcolor"
                                });
                                console.log(err);
                            }
                        });
                    },
                    error: err => {
                        M.toast({
                            html: "Unforunate circumstance. Deck failed to be added.",
                            classes: "redcolor"
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
                            html: 'Success! Check under My Cards',
                            classes: 'greencolor'
                        });
                        console.log(JSON.stringify(card));
                        document.getElementById("question").setAttribute('value', "");
                        document.getElementById("answer").setAttribute('value', "");
                    },
                    error: err => {
                        M.toast({
                            html: "Unforunate circumstance. Card failed to be added.",
                            classes: "redcolor"
                        });
                        console.log(err);
                    }
                });
            }

        }
    });

    /** Calling setDeckList function */
    getDeckList(setDeckList);

    // initialize my card from the list
    getAllMyCards(populateCards);



});
