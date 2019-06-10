function simple_ping() {
    jQuery.ajax({
        url:'./ping_to_active/ping.php',
        type:'POST',
        success:function(results) {

        }
    });
}

t = setInterval(simple_ping,1000);