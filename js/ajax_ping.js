
// function simple_ping(){
   
//     $.ajax({
//         url:'../php_scripts/utilities_php/ping.php',
//         type:'POST',
//         data: {
            
//         },
//         success: function(results) {
            
//                 console.log('ping interveal');
//                 return;
            
            
            
//         },
//         error: function() {

//         }
//     });
// }

// t = setInterval(simple_ping,1000);

function simple_ping() {
    jQuery.ajax({
        url:'../php_scripts/utilities_php/ping.php',
        type:'POST',
        success:function(results) {
            console.log('ping interveal');
        }
    });
}

t = setInterval(simple_ping,2000);