var interval_is_join_player; 
var interval_check_is_session;
function getGameId(color, pass, client_pass) {
    $.ajax({
        url: 'php_scripts/generate_game_id.php',
        type: 'POST',
        data: {
            color: color,
            pass: pass,
            client_pass: client_pass
        },
        success: function (results) {
           
            if (!results) {
                $('.creator--box').css('display', 'none');
                fillObjects();
                return;
            } else if (results === "kick") {
                $('.creator--box').css('display', 'none');
                window.location.href = "./multi.php";
            } else if (results == "wrong") {
                alert("Niepoprawne hasło");
                return;
            }
            $('.creator--box').css('display', 'none');
            $('.loader').css('display', 'flex');
           
            interval_is_join_player = setInterval(listenForPlayers, 1000);
        },
        error: function (r) {
            
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
            

            game.gamePrepare();
            game.gameStart();
        },
        error: function (er) {
            
        }
    })
}


function listenForPlayers() {
    $.ajax({
        url: 'php_scripts/utilities_php/inrerval_query_update_join_user2.php',
        type: 'POST',
        success: function (results) {
            if (results) {
                
                $('.loader').css('display', 'none');
                clearInterval(interval_is_join_player);
                fillObjects();
            } else {
                
            }
        },
        error: function (err) {
            
        }
    });
}

function start_check_for_round() {
   
    $.ajax({
        url: 'php_scripts/utilities_php/check_for_round.php',
        type: 'POST',
        success: (results) => {
            let res = JSON.parse(results);
            let move = Boolean(Number(res.move));
            let data = res.data;
            if (data == null) {
                game.gameEnd(personalBool, '<span class="subHead">Przeciwnik opuścił grę.</span>');
                return;
            }
            if (data.length > 1) {
                data = JSON.parse(res.data);
            }
            if (personalBool == move) {
                clearInterval(move_interval);
                let draw = setInterval(() => { game.draw(draw, data.moveArray, data.gameStatus) }, 1000);
            }
        },
        error: function (err) {
           
        }
    })
}

function joinTheGame(gameid) {
    $.ajax({
        url: './php_scripts/join_to_session.php',
        type: 'POST',
        data: {
            game_id: gameid
        },
        success: function (results) {
            if (results) {
                window.location.href = "./index2.php";
            } else {
                alert("NIE MA TAKIEJ GRY");
            }
        },
        error: function (err) {
            
        }
    });
}

$("#creator").submit(function (e) {
    let color = $(".colorInput[name=color]:checked").val();
    let pass = $(".game_pass").val();
    let client_pass;
    if (pass == undefined) { 
        client_pass = $(".game_pass_klient").val();
      
    }
    e.preventDefault();
    getGameId(color, pass, client_pass);
});


$('body').on('click', '.join_button', function (e) {
    let game_id = $(this).prev().val();
    joinTheGame(game_id);
})

$("#createGame").on('click', function (e) {
    e.preventDefault();
    $.ajax({
        url: './php_scripts/createGame.php',
        type: 'POST',
        success: function (result) {
            window.location.href = "./index2.php";
        }
    })
});

$('.copy').on('click', function (e) {
    let $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(this).prev().text()).select();
    document.execCommand("copy");
    $temp.remove();
});

$(window).on('unload', function () {
    var fd = new FormData();
    fd.append('ajax_data', 22);
    navigator.sendBeacon('php_scripts/delete_session.php', fd);
});

function showSession() {
    $.ajax({
        url: 'php_scripts/utilities_php/showSession.php',
        type: 'POST',
        success: function (result) {
          
        }
    });
}

$(window).keypress(function (e) {
    showSession();
});
