let allMessages = [];
const msgAndres = [];
const msgAna = [];
const msgMe = [];

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

document.getElementById("AndresPanel").style.display = "block";
document.getElementById("AnaPanel").style.display = "none";

async function fetchMessagesJSON() {
    const response = await fetch('http://localhost:3000/msg');
    allMessages = await response.json();
    console.log(allMessages);
    for (let i = 0; i < allMessages.length; i++) {
        if(allMessages[i].sender === "Andres"){
            msgAndres.push(allMessages[i]);
            const node = document.createElement("li");
            node.classList.add('singleMessage');
            const textNode = document.createTextNode(msgAndres[msgAndres.length-1].content);
            node.appendChild(textNode);
            document.getElementById("msgListAndres").appendChild(node);
        }else if(allMessages[i].sender === "Ana"){
            msgAna.push(allMessages[i]);
            const node = document.createElement("div");
            node.classList.add('singleMessage');
            const textNode = document.createTextNode(msgAna[msgAna.length-1].content);
            node.appendChild(textNode);
            document.getElementById("msgListAna").appendChild(node);
        }else if(allMessages[i].sender === "Me"){
            msgMe.push(allMessages[i]);
            const node = document.createElement("div");
            node.classList.add('myMessages');
            const textNode = document.createTextNode(msgMe[msgMe.length-1].content);
            node.appendChild(textNode);
            if(allMessages[i].recipient === "Andres"){
                document.getElementById("msgListAndres").appendChild(node);
            }else{
                document.getElementById("msgListAna").appendChild(node);
            }
            document.getElementById("msgListAndres").appendChild(node);
        }
    }
    console.log("Mensajes de Andres: " + msgAndres[0].content);
    console.log("Mensajes de Ana: " + msgAna[0].content);
    return allMessages;
}

fetchMessagesJSON();

const button = document.getElementById("button");
button.addEventListener("click", sendingMessage);

async function sendingMessage() {
    if(document.getElementById("AndresPanel").style.display === "block"){
        msgAndres[msgAndres.length-1].content = document.getElementById("myMessage").value;
        msgAndres[msgAndres.length-1].sender = "Andres";

        let raw = JSON.stringify({
            "content": msgAndres[msgAndres.length-1].content,
            "sender": msgAndres[msgAndres.length-1].sender
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        console.log(raw);

        const response = await fetch('http://localhost:3000/msg', requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));

        const node = document.createElement("div");
        node.classList.add('singleMessage');
        const textNode = document.createTextNode(msgAndres[msgAndres.length-1].content);
        node.appendChild(textNode);
        document.getElementById("msgListAndres").appendChild(node);
    } else {
        msgAna.push(document.getElementById("myMessage").value);

        const node = document.createElement("div");
        node.classList.add('singleMessage');
        const textNode = document.createTextNode(msgAna[msgAna.length-1]);
        node.appendChild(textNode);
        document.getElementById("msgListAna").appendChild(node);
    }
}

const User1 = document.getElementById("Andres");
User1.addEventListener("click", changeWindow);

function changeWindow() {
    console.log("Change Window to Andres");
    document.getElementById("AndresPanel").style.display = "block";
    document.getElementById("AnaPanel").style.display = "none";
}

const User2 = document.getElementById("Ana");
User2.addEventListener("click", changeWindow2);

function changeWindow2() {
    console.log("Change Window to Ana");
    document.getElementById("AndresPanel").style.display = "none";
    document.getElementById("AnaPanel").style.display = "block";
}

// This is a "Hello world" for JQuery only for testing...
/*
$("button").click(function(){
    $.get("https://jsonplaceholder.typicode.com/users", function(data, status){
        data.map(item => {
            console.log(item.name, item.email, item.phone);
        })
    });
});
*/



