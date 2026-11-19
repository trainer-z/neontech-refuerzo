// =========================================================
// Extra · Contacto
// =========================================================

// ===== Código base (no modificar) =====
const URL_API = "https://jsonplaceholder.typicode.com/posts";

const buscarFaq = document.getElementById("buscarFaq");
const listaFaq = document.getElementById("listaFaq");
const formContacto = document.getElementById("formContacto");
const contactoNombre = document.getElementById("contactoNombre");
const contactoCorreo = document.getElementById("contactoCorreo");
const contactoMensaje = document.getElementById("contactoMensaje");
const errorContacto = document.getElementById("errorContacto");
const btnEnviar = document.getElementById("btnEnviar");
const respuestaContacto = document.getElementById("respuestaContacto");

// ===== Tu código (comenta cada requisito con // R1, // R2...) =====

// R1: Carga json/faq.json con cargarJSON() y crea por cada pregunta un div.faq-item con un
//     button.faq-pregunta y un p.faq-respuesta.

// R2: Acordeón con UN solo listener en #listaFaq: al tocar una pregunta, se abre (clase
//     abierta) y se cierran las demás; si ya estaba abierta, se cierra.

// R3: Buscador de preguntas (input): oculta las que no contienen el texto (clase oculto) e
//     imprime cuántas quedan visibles.

// R4: Valida el formulario: nombre (mínimo 3), correo con expresión regular y mensaje
//     (mínimo 15 caracteres). Muestra el error en #errorContacto.

// R5: Envía con fetch y method POST a URL_API (cabecera Content-Type JSON y body con
//     JSON.stringify). Revisa response.ok y usa try/catch/finally. Mientras envía, el botón
//     queda deshabilitado con el texto "Enviando...". Muestra el número de radicado (el id
//     que responde el servidor).
