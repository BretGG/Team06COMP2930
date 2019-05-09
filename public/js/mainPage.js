// var request = require('request-promise');
// const jwt = require('jsonwebtoken');
// const express = require('express');
//
// const router = express.Router();

$(document).ready(() => {

    $.ajaxSetup({
        beforeSend: function(xhr) {
            xhr.setRequestHeader("auth-token", localStorage.getItem("auth-token"));
        }
    });

    let print = user => {
        console.log(JSON.stringify(user));
        // $("#userInfo").html("User Info: " + JSON.stringify(user));
    };

    function getUserInfo(callback) {

        console.log('sign in');
        $.ajax({
            type: 'get',
            url: '/login/me',
            // data: {
            //   username: 'test1',
            //   password: 'test1234'
            // },
            success: function(data) {
                console.log(data);
                callback(data.user)
            },
            error: function(e) {
                console.log(e.responseText);
                callback("Unknown");
            }
        });
    }

    function setProfileInfo(user) {

        let userName = $('#userName');
        // userName.text(user.username);
        // userName.value = user.username;
    }

    getUserInfo(setProfileInfo);
    // $.ajax({
    //     type: "get",
    //     url: "/login",
    //     dataType: 'json',
    //     data: {
    //         username: $("#unameIN1").val(),
    //         password: $("#passIN1").val()
    //     },
    //     success: user => {
    //         print(user);
    //     },
    //     error: err => print(err.responseText)
    // });



    $("#create").click(() => {

        window.location.href = "createRoom";

    });
});
