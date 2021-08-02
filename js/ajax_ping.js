function simple_ping() {
    jQuery.ajax({
        url:'../php_scripts/utilities_php/ping.php',
        type:'POST',
        success:function(results) {
            
        }
    });
}

t = setInterval(simple_ping,2000);