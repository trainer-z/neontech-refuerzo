// =========================================================
// Grupo 5 · Reseñas
// =========================================================

// ===== Código base (no modificar) =====
const MAX_CARACTERES = 200;

const formulario = document.getElementById("formResena");
const selectProducto = document.getElementById("producto");
const inputAutor = document.getElementById("autor");
const estrellas = document.getElementById("estrellas");
const inputTexto = document.getElementById("texto");
const contador = document.getElementById("contador");
const errorResena = document.getElementById("errorResena");
const filtroPuntaje = document.getElementById("filtroPuntaje");
const promedio = document.getElementById("promedio");
const listaResenas = document.getElementById("listaResenas");

let productos = [];
let resenas = [];
let puntajeElegido = 0;
let filtroActivo = 0; // 0 = todas

// ===== Tu código (comenta cada requisito con // R1, // R2...) =====

// R1: Carga en paralelo los productos y json/resenas.json con Promise.all (cargarProductos()
//     y cargarJSON()). Llena el select con un option por producto y une las reseñas
//     guardadas en CLAVE_RESENAS con las iniciales usando spread.

// R2: Estrellas con listeners en #estrellas: mouseover enciende las estrellas hasta la que
//     está bajo el mouse (clase encendida), mouseleave vuelve al puntaje elegido y click lo
//     fija. Ojo: data-valor llega como texto.

// R3: Contador de caracteres en vivo (evento input): "n/200", con la clase excedido si se
//     pasa.

// R4: Al enviar: valida producto, nombre (mínimo 2), puntaje y opinión (de 10 a 200
//     caracteres), y muestra el error en #errorResena. Si todo está bien, agrega la reseña
//     al inicio, guárdala en CLAVE_RESENAS, insértala de primera con
//     insertAdjacentElement("afterbegin") y limpia el formulario y las estrellas.

// R5: Seguridad: crea las reseñas solo con createElement y textContent. Una opinión con
//     etiquetas HTML debe verse como texto.

// R6: Filtro por puntaje con UN solo listener en #filtroPuntaje y promedio de las reseñas
//     visibles con 1 decimal: "Promedio: 4.3 de 5 (4 reseñas)".
