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
$("#currentUser").text(currentUser.nombre);

// Contenedor de amigos
const contenedor = $("#listaAmigos");

// Crear un div por cada amigo
amigos.forEach(amigo => {
  const divAmigo = $("<div></div>")
    .text(amigo.nombre)
    .addClass("amigo");

  // Resaltar si es el receptor activo
  if (amigo.receptor) divAmigo.addClass("activo");

  // Evento al hacer clic sobre un amigo
  divAmigo.on("click", function () {
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
    $(".amigo").removeClass("activo");
    $(this).addClass("activo");

    console.log(`Nuevo receptor: ${amigoActual.nombre}`);

    mostrarMensajes(); // 👈 actualizar la conversación visible
  });

  contenedor.append(divAmigo);
});

/////////////////////////////////////// MENSAJES //////////////////////////////////////////

// 🔹 Si no hay mensajes en localStorage, se cargan los iniciales
let todosLosMensajes = JSON.parse(localStorage.getItem("todosLosMensajes")) || mensajesIniciales;

// Función para guardar mensajes de manera persistente
function guardarMensajes() {
  localStorage.setItem("todosLosMensajes", JSON.stringify(todosLosMensajes));
}

// Referencias al DOM
const input = $("#inputMessage");
const boton = $("#button");
const contenedorMensajes = $("#mensaje");

// Mostrar los mensajes entre el currentUser y el receptor activo
function mostrarMensajes() {
  contenedorMensajes.empty(); // limpiar el área

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
    const hora = new Date(msg.fechaHora).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    const divMsg = $("<div></div>")
      .addClass(msg.emisor === emisor.nombre ? "myMessages" : "singleMessage")
      .html(`
        <div>${msg.mensaje}</div>
        <div class="timeNode">${hora}</div>
      `);

    contenedorMensajes.append(divMsg);
  });

  // Scroll al final
  contenedorMensajes.scrollTop(contenedorMensajes[0].scrollHeight);
}

// Evento al presionar el botón "Enviar"
boton.on("click", function () {
  const mensajeTexto = input.val().trim();
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

  input.val("");
  mostrarMensajes(); // 👈 actualizar vista
});

// Mostrar mensajes iniciales al cargar
mostrarMensajes();
