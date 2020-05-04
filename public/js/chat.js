const socket = io();

const $messageForm = document.querySelector("#message");
const $messageInput = $messageForm.querySelector("input");
const $messageButton = $messageForm.querySelector("button");
const $locationButton = document.querySelector("#location-button");
const $messages = document.querySelector("#messages");
const $sidebar = document.querySelector("#sidebar");
//templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationMessageTemplate = document.querySelector(
  "#location-message-template"
).innerHTML;
const enterMessageTemplate = document.querySelector("#enter-message-template")
  .innerHTML;
const exitMessageTemplate = document.querySelector("#exit-message-template")
  .innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

const autoScroll = () => {
  const $newMessage = $messages.lastElementChild;

  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  const visibleHeight = $messages.offsetHeight;

  const containerHeight = $messages.scrollHeight;

  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};
//Qs
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.on("userList", (userList) => {
  const html = Mustache.render(sidebarTemplate, {
    room: userList.room,
    userList: userList.userList,
  });
  $sidebar.innerHTML = html;
});

socket.on("message", (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

socket.on("locationMessage", (message) => {
  console.log(message);
  const html = Mustache.render(locationMessageTemplate, {
    username: message.username,
    message: message.url,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

socket.on("enterMessage", (message) => {
  console.log(message);
  const html = Mustache.render(enterMessageTemplate, {
    message,
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

socket.on("exitMessage", (message) => {
  console.log(message);
  const html = Mustache.render(exitMessageTemplate, {
    message,
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  $messageButton.setAttribute("disabled", "disabled");

  const message = $messageInput.value;
  socket.emit("sendMessage", message, (message) => {
    $messageButton.removeAttribute("disabled");
    $messageInput.value = "";
    $messageInput.focus();
    console.log("meesage was delivered", message);
  });
});

$locationButton.addEventListener("click", () => {
  $locationButton.setAttribute("disabled", "disabled");
  if (!navigator.geolocation) {
    $locationButton.removeAttribute("disabled");
    return alert("Geolocation is not supported by your browser");
  }

  navigator.geolocation.getCurrentPosition((position) => {
    const newObj = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
    if (newObj)
      socket.emit(
        "location",
        `https://www.google.com/maps?q=${newObj.latitude},${newObj.longitude}`,
        (message) => {
          $locationButton.removeAttribute("disabled");
          console.log("location shared", message);
        }
      );
    else {
      $locationButton.removeAttribute("disabled");
      console.log("error 404");
    }
  });
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
