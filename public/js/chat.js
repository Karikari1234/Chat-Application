const socket = io();

const $messageForm = document.querySelector("#message");
const $messageInput = $messageForm.querySelector("input");
const $messageButton = $messageForm.querySelector("button");
const $locationButton = document.querySelector("#location-button");
const $messages = document.querySelector("#messages");

//templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationMessageTemplate = document.querySelector(
  "#location-message-template"
).innerHTML;
const enterMessageTemplate = document.querySelector("#enter-message-template")
  .innerHTML;
const exitMessageTemplate = document.querySelector("#exit-message-template")
  .innerHTML;

socket.on("message", (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("locationMessage", (message) => {
  console.log(message);
  const html = Mustache.render(locationMessageTemplate, {
    message: message.url,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("enterMessage", (message) => {
  console.log(message);
  const html = Mustache.render(enterMessageTemplate, {
    message,
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("exitMessage", (message) => {
  console.log(message);
  const html = Mustache.render(exitMessageTemplate, {
    message,
  });
  $messages.insertAdjacentHTML("beforeend", html);
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
