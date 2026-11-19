// =========================================================
// Grupo 4 · Seguimiento del pedido
// =========================================================

// ===== Código base (no modificar) =====
const ESTADOS = ["Confirmado", "Empacando", "Despachado", "En camino", "Entregado"];
const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const sinPedido = document.getElementById("sinPedido");
const infoPedido = document.getElementById("infoPedido");
const numeroPedido = document.getElementById("numeroPedido");
const datosPedido = document.getElementById("datosPedido");
const pasos = document.getElementById("pasos");
const progreso = document.getElementById("progreso");
const estadoActual = document.getElementById("estadoActual");
const btnIniciar = document.getElementById("btnIniciar");
const btnCancelar = document.getElementById("btnCancelar");
const linkResenas = document.getElementById("linkResenas");

const pedido = leerLocal(CLAVE_PEDIDO, null);
let cancelado = false;
let pasoActual = 0;

// ===== Tu código (comenta cada requisito con // R1, // R2...) =====

// R1: Lee el pedido de CLAVE_PEDIDO. Si no hay, muestra #sinPedido y oculta #infoPedido. Si
//     hay, muestra el número y los datos: "Laura Pérez · 2 productos · $1.286.370 · Entrega
//     en la tarde".

// R2: Pinta un li con la clase paso por cada estado de ESTADOS.

// R3: El botón "Ver avance" con { once: true } llama a la función async simularEnvio(): por
//     cada estado espera 1,5 s con esperar() y emite en document el CustomEvent
//     "pedido:estado" con detail { estado, paso, total }.

// R4: Un listener con nombre (actualizarEstado) marca los pasos con las clases completado y
//     actual, anima #progreso con animate() desde el ancho anterior hasta el nuevo (fill:
//     "forwards"), muestra el estado, lo guarda en el pedido e imprime "[2/5] Empacando".

// R5: Cancelar: el botón se deshabilita desde el paso 3 (Despachado). Al cancelar: cambia la
//     variable cancelado, quita el listener, marca el paso con la clase cancelado, muestra
//     el mensaje con la clase fallo y guarda el estado "Cancelado". La simulación no debe
//     seguir.

// R6: Al llegar a "Entregado": quita el listener, muestra un mensaje con la clase exito y el
//     enlace a reseñas (quítale la clase oculto).
