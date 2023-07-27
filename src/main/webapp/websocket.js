var ws;

const messageInput = document.getElementById("msg");

function connect() {
    var usernameIn = document.getElementById("username");
    var username = usernameIn.value;

    var host = document.location.host;
    var pathname = document.location.pathname;

    ws = new WebSocket("ws://" + host + pathname + "chat/" + username);

    ws.onmessage = function (event) {
        // var log = document.getElementById("log");
        // console.log(event.data.content);
        var message = JSON.parse(event.data);
        // log.innerHTML += message.from + " : " + message.content + "\n";

        var iDiv = document.createElement('div');
        // iDiv.id = 'block';
        iDiv.className = 'm-1 chat-message';
        // iDiv.textContent = message.content;

        const senderSpan = document.createElement("span");
        senderSpan.classList.add("font-weight-bold");
        senderSpan.textContent = message.from + ": ";

        const messageSpan = document.createElement("span");
        messageSpan.textContent = message.content;
        iDiv.appendChild(senderSpan);
        iDiv.appendChild(messageSpan);

        document.getElementById('chat-box').appendChild(iDiv);
    };

    var connectButtonEle = document.getElementById('connect');
    usernameIn.remove();
    connectButtonEle.remove();
}

function send() {
    var content = messageInput.value;
    // var json = JSON.stringify({
    //     "content":content
    // });

    ws.send(content);
    messageInput.value = "";
    messageInput.focus();
}

messageInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevents the default behavior (form submission, new line)
        const message = messageInput.value.trim();
        if (message !== "") {
            // Add your code to send the message or display it on the chat container
            // For example:
            ws.send(message);
            messageInput.value = "";
            messageInput.focus();
        }
    }
});
