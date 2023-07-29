var ws;

const messageInput = document.getElementById("msg");

const userColors = {};

const usernameIn = document.getElementById("username");
const connectButtonEle = document.getElementById('connect');

function connect() {
    var username = usernameIn.value;

    var host = document.location.host;
    var pathname = document.location.pathname;

    ws = new WebSocket("ws://" + host + pathname + "chat/" + username);

    ws.onmessage = function (event) {
        // var log = document.getElementById("log");
        // console.log(event.data.content);
        var message = JSON.parse(event.data);
        // log.innerHTML += message.from + " : " + message.content + "\n";

        // iDiv.textContent = message.content;

        switch(message.messageType) {
            case 0:
                createUserToastNotification(message.from, 'offline')
                break;
            case 1:
                createUserToastNotification(message.from, 'online')
                break
            case 2:
                createChatMessageElement(message.from, message.content, 'received')
                break
            default:

        }
    };

    ws.close = function (code, reason) {
        usernameIn.style.display = "block"   // hide
        connectButtonEle.style.display = "block"  //hide
        document.getElementById('chat-box').innerHTML=""
    }

    usernameIn.value =""
    usernameIn.style.display = "none"   // hide
    connectButtonEle.style.display = "none"  //hide
}

function send() {

    const message = messageInput.value.trim();
    if (message !== "") {
        // Add your code to send the message or display it on the chat container
        // For example:
        createChatMessageElement('', message, 'sender')
        ws.send(message);
        messageInput.value = "";
        messageInput.focus();
    }
}

messageInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevents the default behavior (form submission, new line)
        send();
    }
});

document.getElementById("liveToastBtn").onclick = function() {
    var toastElList = [].slice.call(document.querySelectorAll('.toast'))
    var toastList = toastElList.map(function(toastEl) {
        return new bootstrap.Toast(toastEl)
    })
    toastList.forEach(toast => toast.show())
}

function createChatMessageElement(user, message, dynamicClass) {
    var iDiv = document.createElement('div');
    // iDiv.id = 'block';
    iDiv.className = 'm-1 chat-message ' + dynamicClass;
    const senderDiv = document.createElement("div");
    senderDiv.classList.add("font-weight-bold");

    const strongSmallEle = document.createElement("strong");
    senderDiv.appendChild(strongSmallEle)

    const senderSmallEle = document.createElement("small");
    senderSmallEle.textContent = user
    senderSmallEle.style.color = getUserColor(user);
    strongSmallEle.appendChild(senderSmallEle)

    const messageDiv = document.createElement("div");
    messageDiv.textContent = message;
    iDiv.appendChild(senderDiv);
    iDiv.appendChild(messageDiv);

    document.getElementById('chat-box').appendChild(iDiv);
}

function createUserToastNotification(user, status) {
    const containerDiv = document.getElementById('user-status-notif');
    // Create the main container div with class 'toast'
    const toastDiv = document.createElement('div');
    toastDiv.classList.add('toast','text-white');
    if(status === 'online')
        toastDiv.classList.add('bg-success')
    else
        toastDiv.classList.add('bg-danger')
    toastDiv.setAttribute('role', 'alert');
    toastDiv.setAttribute('aria-live', 'assertive');
    toastDiv.setAttribute('aria-atomic', 'true');


// Create the 'toast-body' div
    const toastBodyDiv = document.createElement('div');
    toastBodyDiv.classList.add('toast-body');
    const strongTag = document.createElement('strong');
    strongTag.textContent = user;
    toastBodyDiv.appendChild(strongTag);
    const smallTag = document.createElement('small');
    smallTag.textContent = ' is now ' + status;;
    toastBodyDiv.appendChild(smallTag);

// Append the 'toast-header' and 'toast-body' divs to the main 'toast' div
//     toastDiv.appendChild(toastHeaderDiv);
    toastDiv.appendChild(toastBodyDiv);

// Append the whole 'toast' div to the document body (or any other parent element you desire)
    document.body.appendChild(toastDiv);

    var toastElList = [].slice.call(document.querySelectorAll('.toast:not(.hide)'))
    var toastList = toastElList.map(function(toastEl) {
        return new bootstrap.Toast(toastEl)
    })
    toastList.forEach(toast => toast.show())

    containerDiv.appendChild(toastDiv)
}

function getUserColor(username) {
    if (!userColors[username]) {
        userColors[username] = getRandomDarkColor();
    }
    return userColors[username];
}

function getRandomDarkColor() {
    // Define the threshold for brightness (lower value means darker colors)
    const brightnessThreshold = 128;

    const getRandomComponent = () => Math.floor(Math.random() * 256);

    let color;
    do {
        color = `rgb(${getRandomComponent()}, ${getRandomComponent()}, ${getRandomComponent()})`;
    } while (getBrightness(color) >= brightnessThreshold);

    return color;
}

function getBrightness(color) {
    const rgb = color.match(/\d+/g).map(Number);
    return (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
}