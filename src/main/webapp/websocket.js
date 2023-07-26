var ws;

function connect() {
    var username = document.getElementById("username").value;

    var host = document.location.host;
    var pathname = document.location.pathname;

    ws = new WebSocket("ws://" +host  + pathname + "chat/" + username);

    ws.onmessage = function(event) {
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
}

function send() {
    var content = document.getElementById("msg").value;
    // var json = JSON.stringify({
    //     "content":content
    // });

    ws.send(content);
    document.getElementById("msg").value = "";
}
