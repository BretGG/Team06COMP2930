$(document).ready(() => {

    $("#start").click(() => {

        window.location.href = "game";
    });

    $("#back").click(() => {

        window.location.href = "main";
    });

    var max = 4;
    var count = 0;
    var username = ["Stella", "Jessica", "Rose", "Hannah", "Bret"]

    $('#memberpool').click(() => {
        console.log("k");
        if (count < 4) {
            const member = document.createElement('div');
            member.setAttribute('class', 'member');
            member.textContent = username[count];
            $('#memberpool').append(member);
            count++;
        }
    })
});
