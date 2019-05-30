var interval_is_join_player; //interval
var interval_check_is_session;
function getGameId(color){
    $('.creator--box').css('display','none');
    $.ajax({
        url:'php_scripts/generate_game_id.php',
        type:'POST',
        success: function(results) {
            
            $.ajax({
                url:'php_scripts/sendColors.php',
                type:'POST',
                data: {
                    color: color
                },
                success:function(result) {
                },
                error:function(r) {
                    console.log(r);
                }
            });

            if(!results) {

                return;
            }
            $('.loader').css('display','flex').find('.game_id').html(results);
            interval_check_is_session = setInterval(simple_check,200);
            interval_is_join_player = setInterval(listenForPlayers,1000);
        },
        error: function() {

        }
    });
}

function simple_check() {
    jQuery.ajax({
        url:'php_scripts/utilities_php/check_session.php',
        type:'POST',
        success:function(results) {
            console.log('check  interveal');
            console.log(results); //! obsługa valcovera
        }
    });
}

function listenForPlayers() {
    $.ajax({
        url:'php_scripts/utilities_php/inrerval_query_update_join_user2.php',
        type:'POST',
        success: function(results) {
            if(results){
                console.log('true');
                $('.loader').css('display','none');
                clearInterval(interval_is_join_player);
            } else {
                console.log('false');
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