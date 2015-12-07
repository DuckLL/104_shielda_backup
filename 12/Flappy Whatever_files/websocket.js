var wsUri = "ws://" + document.location.host + document.location.pathname + "flappyendpoint";
if (!"WebSocket" in window)
{
    alert("WebSocket is not supported by your Browser!");
}
var websocket = new WebSocket(wsUri);

websocket.onerror = function (evt) {
    onError(evt);
};

function onError(evt) {

    writeToMsgboard('<span style="color: red;">ERROR:</span> ' + evt.data);
}

var msgboard = document.getElementById("message");
var score = document.getElementById("score");
var goal = document.getElementById("goal");
var tempScore = 0;
var targetScore = 77777;

websocket.onopen = function (evt) {
    onOpen(evt);
    goal.innerHTML = targetScore;
};

websocket.onmessage = function (evt) {
    var msg = JSON.parse(evt.data);
    console.log("getting message: " + JSON.stringify(msg));
    switch (msg.say) {
        case "GREETINGS":
            writeToMsgboard("<span style='color:green; font-weight:bold;'>[" + msg.t + "] </span>" + "Greetings, Player {id = " + msg.content + "}");
            break;
        case "POLO":
            if (!isNormalInteger(msg.content)) {
                console.log("content is NaN" + msg.content);
            } else {
                tempScore++;
                if (tempScore !== parseInt(msg.content)) {
                    console.log("Something wrong.");
                }
            }
            break;
        case "TOKEN":
            var token = msg.content;
            if (!isNormalInteger(token)) {
                console.log("token is NaN" + msg.content);
            } else {
                var json = '{"say":"REDEEM",' +
                        '"content":"TOKEN=' + token + ',SCORE=' + tempScore + '"}';
                sendMessage(json);
                tempScore = 0;
            }
            break;
        case "UPDATE":
            var updateScore = msg.content;
            if (isNormalInteger(updateScore)) {
                score.innerHTML = updateScore;
                if (parseInt(updateScore) < targetScore) {
                    writeToMsgboard("<span style='color:green; font-weight:bold;'>[" + msg.t + "] </span>" +
                            "Now you have <span style='color:green; font-weight:bold;'>" + updateScore + "</span> point(s), still <span style='color:red; font-weight:bold;'>" + (targetScore - updateScore) + "</span> to go.");
                }
            } else {
                console.log("score is NaN" + msg.content);
            }
            break;
        case "CONG":
            var key = msg.content;
            writeToMsgboard("<span style='color:green; font-weight:bold;'>[" + msg.t + "] </span>" + "<span style='background:#dddddd'>(*´ω`)人(´ω`*) Congratulations d(`･∀･)b!! <br/> >>> <span style='color:red; font-weight:bold; font-size:16px'>" + key + "</span> <<<!!!</span>");
            break;
        case "OOPS":
            msgboard.innerHTML += msg.content + "<br/>";
    }
};

function isNormalInteger(str) {
    var n = ~~Number(str);
    return String(n) === str && n >= 0;
}

function writeToMsgboard(message) {
    msgboard.innerHTML += message + "<br/>";
}

function onOpen() {
    //writeToScreen("Connected to " + wsUri);
}

function sendMessage(message) {
    console.log("sending message: " + message);
    websocket.send(message);
}