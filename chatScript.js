/////////////////////////////////////// IMPORTACIÓN ///////////////////////////////////////

import { todosLosMensajes as mensajesIniciales } from './todosLosMensajes.js';

/////////////////////////////////////// USUARIOS //////////////////////////////////////////

// 🔹 Si no hay usuarios en localStorage, se crean los iniciales
if (!localStorage.getItem("usuarios")) {
  const usuarios = [
    { id: 1, nombre: "Paul", emisor: true, receptor: false },
    { id: 2, nombre: "Lucía", emisor: false, receptor: true },
    { id: 3, nombre: "Carlos", emisor: false, receptor: false }
  ];
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

// Cargar usuarios desde localStorage
let usuariosGuardados = JSON.parse(localStorage.getItem("usuarios"));

// Separar el currentUser (emisor) y los amigos (no emisores)
const currentUser = usuariosGuardados.find(u => u.emisor === true);
const amigos = usuariosGuardados.filter(u => u.emisor === false);

// Mostrar el nombre del usuario actual
document.getElementById("currentUser").textContent = currentUser.nombre;

// Contenedor de amigos
const contenedor = document.getElementById("listaAmigos");

// Crear un div por cada amigo
amigos.forEach(amigo => {
  const divAmigo = document.createElement("div");
  divAmigo.textContent = amigo.nombre;
  divAmigo.classList.add("amigo");

  // Resaltar si es el receptor activo
  if (amigo.receptor) divAmigo.classList.add("activo");

  // Evento al hacer clic sobre un amigo
  divAmigo.addEventListener("click", () => {
    usuariosGuardados = JSON.parse(localStorage.getItem("usuarios"));
    const amigoActual = usuariosGuardados.find(u => u.id === amigo.id);

    if (amigoActual.receptor) {
      console.log(`${amigoActual.nombre} ya es el receptor activo.`);
      return;
    }

    // Cambiar receptor activo
    usuariosGuardados = usuariosGuardados.map(u => ({
      ...u,
      receptor: u.id === amigoActual.id
    }));

    localStorage.setItem("usuarios", JSON.stringify(usuariosGuardados));

    // Actualizar clases visuales
    document.querySelectorAll(".amigo").forEach(div => div.classList.remove("activo"));
    divAmigo.classList.add("activo");

    console.log(`Nuevo receptor: ${amigoActual.nombre}`);

    mostrarMensajes(); // 👈 actualizar la conversación visible
  });

  contenedor.appendChild(divAmigo);
});

/////////////////////////////////////// MENSAJES //////////////////////////////////////////

// 🔹 Si no hay mensajes en localStorage, se cargan los iniciales
let todosLosMensajes = JSON.parse(localStorage.getItem("todosLosMensajes")) || mensajesIniciales;

// Función para guardar mensajes de manera persistente
function guardarMensajes() {
  localStorage.setItem("todosLosMensajes", JSON.stringify(todosLosMensajes));
}

// Referencias al DOM
const input = document.getElementById("inputMessage");
const boton = document.getElementById("button");
const contenedorMensajes = document.getElementById("mensaje");

// Mostrar los mensajes entre el currentUser y el receptor activo
function mostrarMensajes() {
  contenedorMensajes.innerHTML = ""; // limpiar el área

  const usuariosActualizados = JSON.parse(localStorage.getItem("usuarios"));
  const emisor = usuariosActualizados.find(u => u.emisor === true);
  const receptor = usuariosActualizados.find(u => u.receptor === true);

  if (!receptor) return; // aún no se selecciona un amigo

  // Filtrar mensajes entre emisor y receptor actuales
  const mensajesFiltrados = todosLosMensajes.filter(
    m =>
      (m.emisor === emisor.nombre && m.receptor === receptor.nombre) ||
      (m.emisor === receptor.nombre && m.receptor === emisor.nombre)
  );

  // Renderizar cada mensaje
  mensajesFiltrados.forEach(msg => {
    const divMsg = document.createElement("div");
    const hora = new Date(msg.fechaHora).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    // Asignar estilo según quién envía
    if (msg.emisor === emisor.nombre) {
      divMsg.classList.add("myMessages");
    } else {
      divMsg.classList.add("singleMessage");
    }

    divMsg.innerHTML = `
      <div>${msg.mensaje}</div>
      <div class="timeNode">${hora}</div>
    `;

    contenedorMensajes.appendChild(divMsg);
  });

  // Scroll al final
  contenedorMensajes.scrollTop = contenedorMensajes.scrollHeight;
}

// Evento al presionar el botón "Enviar"
boton.addEventListener("click", () => {
  const mensajeTexto = input.value.trim();
  if (!mensajeTexto) return;

  const usuariosActualizados = JSON.parse(localStorage.getItem("usuarios"));
  const emisor = usuariosActualizados.find(u => u.emisor === true);
  const receptor = usuariosActualizados.find(u => u.receptor === true);

  if (!receptor) {
    alert("Selecciona un amigo antes de enviar un mensaje.");
    return;
  }

  const nuevoMensaje = {
    id: todosLosMensajes.length + 1,
    emisor: emisor.nombre,
    receptor: receptor.nombre,
    mensaje: mensajeTexto,
    fechaHora: new Date().toISOString()
  };

  // Agregar y guardar el mensaje
  todosLosMensajes.push(nuevoMensaje);
  guardarMensajes();

  input.value = "";
  mostrarMensajes(); // 👈 actualizar vista
});

// Mostrar mensajes iniciales al cargar
mostrarMensajes();
