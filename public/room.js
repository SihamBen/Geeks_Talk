const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const audioButton = document.getElementById("audioButton");
const videoButton = document.getElementById("videoButton");
const leave = document.getElementById("leave");
const messageContainer = document.getElementById("message-container");
const chatForm = document.getElementById("send-container");
const messageInput = document.getElementById("message-input");
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let username = urlParams.get("username");
let room = urlParams.get("room");
let users=0;

const myPeer = new Peer({
  host: "/",
  port: "3001",
});
const myVideo = document.createElement("video");
myVideo.muted = true;
const peers = {};
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    addVideoStream(myVideo, stream);

    myPeer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });
  });

myPeer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  call.on("close", () => {
    video.remove();
  });
users++;
  peers[userId] = call;
}

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.style.gridTemplateColumns=`repeat(${users}, 1fr)`;
  videoGrid.style.gridTemplateRows="auto";

  videoGrid.append(video);
}
audioButton.onclick = function () {
  const icon = document.getElementById("audioIcon");
  icon.classList.toggle("fa-microphone-slash");
};
videoButton.onclick = function () {
  const icon = document.getElementById("videoIcon");
  icon.classList.toggle("fa-video-slash");
};
leave.onclick = function () {
  window.location.replace(`/`);
};

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
// socket.on('roomUsers', ({ room, users }) => {
//   outputRoomName(room);
//   outputUsers(users);
// });

// Message from server
socket.on('message', message => {
  outputMessage(message);

  // Scroll down
  //chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  // Get message text
  const msg = messageInput.value;

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  messageInput.value = '';
  messageInput.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="-message-text">
    ${message.text}
  </p>`;
  messageContainer.appendChild(div);
}

// // Add room name to DOM
// function outputRoomName(room) {
//   roomName.innerText = room;
// }

// // Add users to DOM
// function outputUsers(users) {
//   userList.innerHTML = `
//     ${users.map(user => `<li>${user.username}</li>`).join('')}
//   `;
// }