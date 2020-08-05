
const modal = document.getElementById("modal");
const enter = document.getElementById("go");
var roomId = "";

const span = document.getElementsByClassName("close")[0];
//display modal when clicking join room
 function joinRoom(obj) {
  modal.style.display = "block";
  roomId = obj.id;

};


span.onclick = function () {
  modal.style.display = "none";
};


window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
//submitting the username
enter.onsubmit = function (event) {
    event.preventDefault();
  window.location.replace(`/${roomId}`);
  
};
