var interval_is_join_player; //interval
var interval_check_is_session;
function getGameId(color){
    $('.creator--box').css('display','none');
    $.ajax({
        url:'php_scripts/generate_game_id.php',
        type:'POST',
        data: {
            color: color
        },
        success: function(results) {
            if(!results) {
                fillObjects();
                return;
            }
            $('.loader').css('display','flex').find('.game_id').html(results);
            interval_check_is_session = setInterval(simple_check,200);
            interval_is_join_player = setInterval(listenForPlayers,1000);
        },
        error: function(r) {
            console.log(r);
        }
    });
}

function fillObjects() {
    $.ajax({
        url: 'php_scripts/fill_objects.php',
        method: 'POST',
        success: function(result) {
            let res = JSON.parse(result);
            players[0] = new Player(res.login1,colors[parseInt(res.color1)]);
            players[1] = new Player(res.login2,colors[parseInt(res.color2)]);

            let game = new Game();
            game.gamePrepare();
            game.gameStart();
        },
        error: function(er) {
            console.log(er);
        }
    })
}

function simple_check() {
    jQuery.ajax({
        url:'php_scripts/utilities_php/check_session.php',
        type:'POST',
        success:function(results) {
            // console.log('check  interveal');
            // console.log(results); //! obsługa valcovera
        }
    });
}

function listenForPlayers() {
    $.ajax({
        url:'php_scripts/utilities_php/inrerval_query_update_join_user2.php',
        type:'POST',
        success: function(results) {
            if(results){
                // console.log('true');
                $('.loader').css('display','none');
                clearInterval(interval_is_join_player);
                fillObjects();
            } else {
                // console.log('false');
            }
        },
        error: function(err) {
            console.log('error');
        }
    });
}

function joinTheGame(gameid) {
    $.ajax({
        url:'join_to_session.php',
        type:'POST',
        data: {
            game_id: gameid
        },
        success: function(results) {
            if(results){
                window.location.href="../index2.html";
            } else {
                alert("NIE MA TAKIEJ GRY");
            }
        },
        error: function(err) {
            console.log(err);
        }
    });
}

$("#creator").submit(function(e){
    let color = $(".colorInput[name=color]:checked").val();
    e.preventDefault();
    getGameId(color);
});

$("#join_form").submit(function(e){
    e.preventDefault();
    let game_id = $('#join_form input[name=game_id]').val();
    joinTheGame(game_id);
});

$("#createGame").on('click',function(e){
    e.preventDefault();
    $.ajax({
        url: 'createGame.php',
        type: 'POST',
        success : function(result) {
            window.location.href="../index2.html";
        }
    })
});

$('.copy').on('click',function(e){
    let $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(this).prev().text()).select();
    document.execCommand("copy");
    $temp.remove();
});

$(window).on('unload', function() {
    
    var fd = new FormData();
    fd.append('ajax_data', 22);
    navigator.sendBeacon('php_scripts/delete_session.php', fd);
});

// window.onbeforeunload = function() { 
//     window.setTimeout(function () { 
//         window.location = 'php_scripts/lobby.php';
//     }, 0); 
//     window.onbeforeunload = null; // necessary to prevent infinite loop, that kills your browser 
// }