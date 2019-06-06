var interval_is_join_player; //interval
var interval_check_is_session;
function getGameId(color,pass,client_pass) {
    $.ajax({
        url: 'php_scripts/generate_game_id.php',
        type: 'POST',
        data: {
            color: color,
            pass: pass,
            client_pass: client_pass
        },
        success: function (results) {
            console.log(results);
            if (!results) {
                $('.creator--box').css('display', 'none');
                fillObjects();
                return;
            } else if(results === "kick") {
                $('.creator--box').css('display', 'none');
                window.location.href = "./multi.html";
            } else if(results == "wrong") {
                alert("Niepoprawne hasło");
                return;
            }
            $('.creator--box').css('display', 'none');
            $('.loader').css('display', 'flex');
            interval_check_is_session = setInterval(simple_check, 200);
            interval_is_join_player = setInterval(listenForPlayers, 1000);
        },
        error: function (r) {
            console.log(r);
        }
    });
}

function fillObjects() {
    $.ajax({
        url: 'php_scripts/fill_objects.php',
        method: 'POST',
        success: function (result) {
            let res = JSON.parse(result);
            players[0] = new Player(res.login1, colors[parseInt(res.color1)]);
            players[1] = new Player(res.login2, colors[parseInt(res.color2)]);

            personalBool = res.role;
            console.log(res.role);

            game.gamePrepare();
            game.gameStart();
        },
        error: function (er) {
            console.log(er);
        }
    })
}

function simple_check() {
    jQuery.ajax({
        url: 'php_scripts/utilities_php/check_session.php',
        type: 'POST',
        success: function (results) {
            // console.log('check  interveal');
            // console.log(results); //! obsługa valcovera
        }
    });
}

function listenForPlayers() {
    $.ajax({
        url: 'php_scripts/utilities_php/inrerval_query_update_join_user2.php',
        type: 'POST',
        success: function (results) {
            if (results) {
                // console.log('true');
                $('.loader').css('display', 'none');
                clearInterval(interval_is_join_player);
                fillObjects();
            } else {
                // console.log('false');
            }
        },
        error: function (err) {
            //console.log('error');
        }
    });
}

function start_check_for_round() {
    //console.log('shrek');
    $.ajax({
        url: 'php_scripts/utilities_php/check_for_round.php',
        type: 'POST',
        success: (results) => {
            let res = JSON.parse(results);
            let move = Boolean(Number(res.move));
            let data = JSON.parse(res.data);
            //console.log(data);
            if (personalBool == move) {
                clearInterval(move_interval);
                let draw = setInterval(() => { game.draw(draw, data.moveArray, data.gameStatus) }, 500);
                $('.name').each(function (i) {
                    $(this).toggleClass('active');
                });
            }
        },
        error: function (err) {
            //console.log(err);
        }
    })
}



function joinTheGame(gameid) {
    $.ajax({
        url: 'join_to_session.php',
        type: 'POST',
        data: {
            game_id: gameid
        },
        success: function (results) {
            if (results) {
                window.location.href = "../index2.php";
            } else {
                alert("NIE MA TAKIEJ GRY");
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

$("#creator").submit(function (e) {
    let color = $(".colorInput[name=color]:checked").val();
    let pass = $(".game_pass").val();
    let client_pass;
    if(pass == undefined){ //tylko dla klienta
        client_pass = $(".game_pass_klient").val();
        console.log("tylko klinet");
    }
    e.preventDefault();
    getGameId(color,pass,client_pass);
});

// $("#join_form").submit(function (e) {
//     e.preventDefault();
//     let game_id =$(this).find('input[name=session_id]').val();
//     console.log(game_id);
//     //joinTheGame(game_id);
// });

$('body').on('click','.join_button',function(e){
    let game_id =$(this).prev().val();
    joinTheGame(game_id);
})

$("#createGame").on('click', function (e) {
    e.preventDefault();
    $.ajax({
        url: 'createGame.php',
        type: 'POST',
        success: function (result) {
            window.location.href = "../index2.php";
        }
    });
});

$('.copy').on('click', function (e) {
    let $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(this).prev().text()).select();
    document.execCommand("copy");
    $temp.remove();
});

$(window).on('unload', function (e) {
    navigator.sendBeacon('php_scripts/delete_session.php');
    e.preventDefault();
});

function showSession(){
    $.ajax({
        url: 'php_scripts/utilities_php/showSession.php',
        type: 'POST',
        success: function (result) {
            console.log(result);
        }
    });
}


$(window).keypress(function(e) {
    showSession();
    
});

// $('#login_form').submit(function(e){
//     e.preventDefault();
//     $.ajax({
//         url: 'php_scripts/logowanie.php', 
//         type: 'post',
//         data: $('#login_form').serialize(),
//         success: function(res) {
//             console.log('elo');
//             switch(res){
//                 case "logged":
//                     window.location.href = "index2.html";
//                     break;
//                 case "pass":
//                     alert("Podano złe hasło");
//                     break;
//                 case "login":
//                     alert("Użytkownik nie istnieje");
//                     break;
//             }
//         },
//         error: function(e){
//             console.log(e);
//         }
//     });
// })

// ss

