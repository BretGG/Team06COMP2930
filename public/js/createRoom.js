$(document).ready(() => {
    $.ajaxSetup({
        headers: {
            "auth-token": localStorage.getItem("auth-token")
        }
    });

    $('select').formSelect();

    function updateCosmetics() {
        $.ajax({
            type: "get",
            url: "/users/updateCosmetics",
            success: function(data) {
                $("html").css(
                    "background-image",
                    `url(${data.activeBackground.imageLink})`
                );
            },
            error: function(e) {
                console.log(e.responseText);
            }
        });
    }

    updateCosmetics();

    /**Takes you back to the main page */
    $("#back").click(() => {
        window.location.href = "main";
    });


    /** Gets a list of deck that this user has **/
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

    //set up the  initial setting including cards.
    function setDeckList(decks) {
        if (decks.length == 0) {
            console.log("You have no deck!");
        } else {
            for (let deck of decks) {
                $('#myDeck').append($("<option></option>").attr("value", deck._id).text(deck.name));
            }
            $('#myDeck').formSelect();
        }
    }

    /** Create the new game lobby */
    $("#submit").click(() => {
        if (!$('select#myCate').val() || !$('select#myDeck').val()) {
            M.Toast.dismissAll();
            M.toast({
                html: 'Category and Deck must be set!',
                classes: 'redcolor',
                displayLength: 2500
            });
        } else if (!$("#roomNo").val() || !$("#roomPass").val()) {
            M.Toast.dismissAll();
            M.toast({
                html: 'Room number and password must be set!',
                classes: 'redcolor',
                displayLength: 2500
            });
        } else {
            $.ajax({
                type: "post",
                url: "/game",
                data: {
                    sessionId: $("#roomNo").val(),
                    sessionPass: $("#roomPass").val(),
                    gameType: "no yet implemented",
                    category:$('select#myCate').val(),
                    deck:$('select#myDeck').val()
                },
                success: function(data) {
                    window.location.href = "/game/lobby";
                },
                error: function(err) {
                    M.Toast.dismissAll();
                    M.toast({
                        html: `${err.responseText}`,
                        classes: "redcolor",
                        displayLength: 2500
                    });
                }
            });
        }
    });

    /** Calling setDeckList function */
    getDeckList(setDeckList);
});
