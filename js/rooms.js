$(document).ready(function () {
  $.ajax({
    url: 'php_scripts/showRooms.php',
    method: 'POST',
    success: function (msg) {
      let rooms = JSON.parse(msg);
      showRooms(rooms);
    },
    error: function (err) {

    }
  })
});

function showRooms(obj) {

  obj.forEach(function (room, i) {
    $("#rooms").append(`<tr>
        <td class='private private${i}'>
            
        </td>
        <td class="session_id">
            ${room.session_id}
        </td>
        <td>
          ${room.host}
        </td>
        <td>
          ${(room.guest) ? room.guest : "-"}
        </td>
        <td>
          <input name="session_id" type="hidden" value="${room.session_id}">
          <input type="submit" value="DOŁĄCZ" class="button join_button" ${(room.guest && room.host) ? "disabled" : ""}>
        </td>
    </tr>`);
    if (room.isPrivate) {
      $(`.private${i}`).html("<img src='assets/img/lock.png'>");
    }
  });
}