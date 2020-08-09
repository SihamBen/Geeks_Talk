const socket = io("/");

const modal = document.getElementById("modal");
const usernameForm = document.getElementById("usernameForm");
const username = document.getElementById("username");
var roomId = "";
const span = document.getElementsByClassName("close")[0];

//display modal when clicking join room
function joinRoom(obj) {
  modal.style.display = "block";
  roomId = obj.id;
}

span.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

//submitting the username
usernameForm.onsubmit = function (event) {
  event.preventDefault();
  const name = "siham";
  console.log(name);
  socket.emit('new-user', name);
  window.location.replace(`/${roomId}`);
};
