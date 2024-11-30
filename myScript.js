let allMessages = [];
const msgAndres = [];
const msgAna = [];

localStorage.setItem("currentUser", "Carlos");
document.getElementById("currentUser").textContent = localStorage.getItem("currentUser");

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

document.getElementById("AndresPanel").style.display = "block";
document.getElementById("AnaPanel").style.display = "none";

// Al arrancar, rellenar las conversaciones con la data del backend
async function fetchMessagesJSON() {
    const response = await fetch('http://localhost:3000/msg');
    allMessages = await response.json();
    console.log(allMessages);
    for (let i = 0; i < allMessages.length; i++) {
        if(allMessages[i].sender === "Andres"){
            msgAndres.push(allMessages[i]);
            // Crear los nodos necesarios
            const node = document.createElement("div");
            const timeDivNode = document.createElement("div");
            const timeTextNode = document.createTextNode(msgAndres[msgAndres.length-1].dateTime);
            const timeTextNodeData = new Date(timeTextNode.data);
            timeTextNode.data = timeTextNodeData.getHours() + ":" + timeTextNodeData.getMinutes();
            const textNode = document.createTextNode(msgAndres[msgAndres.length-1].content);
            // Darle las clases para los estilos CSS
            node.classList.add('singleMessage');
            timeDivNode.classList.add('timeNode');
            // .appendChild en orden jerárquico
            node.appendChild(textNode);
            node.appendChild(timeDivNode);
            timeDivNode.appendChild(timeTextNode);
            // Agregar el nuevo nodo a la lista de mensajes
            document.getElementById("msgListAndres").appendChild(node);
        }else if(allMessages[i].sender === "Ana"){
            msgAna.push(allMessages[i]);
            const node = document.createElement("div");
            const timeDivNode = document.createElement("div");
            const timeTextNode = document.createTextNode(msgAna[msgAna.length-1].dateTime);
            const timeTextNodeData = new Date(timeTextNode.data);
            timeTextNode.data = timeTextNodeData.getHours() + ":" + timeTextNodeData.getMinutes();
            const textNode = document.createTextNode(msgAna[msgAna.length-1].content);
            node.classList.add('singleMessage');
            timeDivNode.classList.add('timeNode');
            node.appendChild(textNode);
            node.appendChild(timeDivNode);
            timeDivNode.appendChild(timeTextNode);
            document.getElementById("msgListAna").appendChild(node);
        }
        if(allMessages[i].sender === "Carlos"){
            if(allMessages[i].recipient === "Andres"){
                msgAndres.push(allMessages[i]);
                const node = document.createElement("div");
                const timeDivNode2 = document.createElement("div");
                const timeTextNode2 = document.createTextNode(msgAndres[msgAndres.length-1].dateTime);
                const timeTextNodeData = new Date(timeTextNode2.data);
                timeTextNode2.data = timeTextNodeData.getHours() + ":" + timeTextNodeData.getMinutes();
                const textNode = document.createTextNode(msgAndres[msgAndres.length-1].content);
                node.classList.add('myMessages');
                timeDivNode2.classList.add('timeNode');
                node.appendChild(textNode);
                node.appendChild(timeDivNode2);
                timeDivNode2.appendChild(timeTextNode2);
                document.getElementById("msgListAndres").appendChild(node);
            }else if(allMessages[i].recipient === "Ana"){
                msgAna.push(allMessages[i]);
                const node = document.createElement("div");
                const timeDivNode2 = document.createElement("div");
                const timeTextNode2 = document.createTextNode(msgAna[msgAna.length-1].dateTime);
                const timeTextNodeData = new Date(timeTextNode2.data);
                timeTextNode2.data = timeTextNodeData.getHours() + ":" + timeTextNodeData.getMinutes();
                const textNode = document.createTextNode(msgAna[msgAna.length-1].content);
                node.classList.add('myMessages');
                timeDivNode2.classList.add('timeNode');
                node.appendChild(textNode);
                node.appendChild(timeDivNode2);
                timeDivNode2.appendChild(timeTextNode2);
                document.getElementById("msgListAna").appendChild(node);
            }

        }
    }
    console.log("Mensajes de Andres: " + msgAndres[msgAndres.length-1].content);
    console.log("Mensajes de Ana: " + msgAna[msgAna.length-1].content);
    return allMessages;
}

fetchMessagesJSON();

const button = document.getElementById("button");
button.addEventListener("click", sendingMessage);

async function sendingMessage() {

    // Si la conversación con Andrés está como "Activa"...
    if(document.getElementById("AndresPanel").style.display === "block"){
        msgAndres[msgAndres.length-1].content = document.getElementById("inputMessage").value;
        msgAndres[msgAndres.length-1].sender = localStorage.getItem("currentUser");

        let raw = JSON.stringify({
            "content": msgAndres[msgAndres.length-1].content,
            "sender": msgAndres[msgAndres.length-1].sender,
            "recipient": "Andres"
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
        const timeDivNode = document.createElement("div");
        const timeTextNode = document.createTextNode(msgAndres[msgAndres.length-1].dateTime);
        const textNode = document.createTextNode(msgAndres[msgAndres.length-1].content);
        node.classList.add('myMessages');
        timeDivNode.classList.add('timeNode');
        node.appendChild(textNode);
        node.appendChild(timeDivNode);
        timeDivNode.appendChild(timeTextNode);
        document.getElementById("msgListAndres").appendChild(node);
    } else if(document.getElementById("AnaPanel").style.display === "block") {

        // Si la conversación con Ana está como "Activa"...
        msgAna[msgAna.length-1].content = document.getElementById("inputMessage").value;
        msgAna[msgAna.length-1].sender = localStorage.getItem("currentUser");

        let raw = JSON.stringify({
            "content": msgAndres[msgAndres.length-1].content,
            "sender": msgAndres[msgAndres.length-1].sender,
            "recipient": "Ana"
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
        const timeDivNode = document.createElement("div");
        const timeTextNode = document.createTextNode(msgAndres[msgAndres.length-1].dateTime);
        const textNode = document.createTextNode(msgAna[msgAna.length-1].content);
        node.classList.add('myMessages');
        timeDivNode.classList.add('timeNode');
        node.appendChild(textNode);
        node.appendChild(timeDivNode);
        timeDivNode.appendChild(timeTextNode);
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

