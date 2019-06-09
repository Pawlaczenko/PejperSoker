$( document ).ready(function() {
    $.ajax({
        url: 'php_scripts/showRooms.php', //! TUTAJ BYŁA LITERÓWKA 'php_sripts' nie było 'c'
        method: 'POST',
        success: function(msg) {
            let rooms = JSON.parse(msg);
            showRooms(rooms);
        },
        error: function(err) {
            console.log(err);
        }
    })
});

  function showRooms(obj) {
      console.log(obj);
      obj.forEach(room => {
          $("#rooms").append(`<tr>
          <td class="session_id">
              ${room.session_id}
          </td>
          <td>
            ${room.host}
          </td>
          <td>
            ${(room.guest)?room.guest:"-"}
          </td>
          <td>
            <input name="session_id" type="hidden" value="${room.session_id}">
            <input type="submit" value="DOŁĄCZ" class="button join_button" ${(room.guest && room.host)?"disabled":""}>
          </td>
      </tr>`)
      });
  }