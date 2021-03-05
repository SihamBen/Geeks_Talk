const socket = io(process.env.PUBLIC_URL||"/");
const modal = document.getElementById("modal");
const span = document.getElementsByClassName("close")[0];
const usernameForm = document.getElementById("usernameForm");
const usernameInput = document.getElementById("username");
var room="";

//display modal when clicking join room
function joinRoom(obj) {
  modal.style.display = "block";
  room = obj.id;
}
// Close modal when clicking leave button
span.onclick = function () {

  modal.style.display = "none";
};
// Close modal when clicking anywhere outside the modal
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

usernameForm.onsubmit = function () {
  let input = document.createElement("input");
  input.type = "hidden";
  input.name = "room";
  input.value = room;
  usernameForm.appendChild(input);
};
