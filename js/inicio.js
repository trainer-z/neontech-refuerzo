// =========================================================
// Extra · Inicio
// =========================================================

// ===== Código base (no modificar) =====
const MENSAJES = [
  "Preventa de Costa Neón: reserva tu copia",
  "Envío gratis en compras desde $300.000",
  "Usa el cupón NEON10 y ahorra 10 %"
];
const CLAVE_BOLETIN = "neontech:boletin";

const banner = document.getElementById("banner");
const mensajeBanner = document.getElementById("mensajeBanner");
const btnAnterior = document.getElementById("btnAnterior");
const btnSiguiente = document.getElementById("btnSiguiente");
const cuentaRegresiva = document.getElementById("cuentaRegresiva");
const destacado = document.getElementById("destacado");
const correoBoletin = document.getElementById("correoBoletin");
const mensajeBoletin = document.getElementById("mensajeBoletin");

let indiceMensaje = 0;
let intervaloBanner = null;

// ===== Tu código (comenta cada requisito con // R1, // R2...) =====

// R1: Los botones ◀ y ▶ recorren MENSAJES en círculo (después del último vuelve al primero)
//     y lo muestran en #mensajeBanner.

// R2: El banner avanza solo cada 4 segundos con setInterval; se pausa con mouseenter y sigue
//     con mouseleave.

// R3: Cuenta regresiva desde el atributo data-segundos de #cuentaRegresiva (conviértelo a
//     número), con formato mm:ss y padStart. En 0: "¡Ya disponible!", clase lanzado y
//     clearInterval.

// R4: Producto destacado: el producto en preventa más caro (filter y reduce), mostrado con
//     createElement: imagen, nombre, precio y un enlace al catálogo.

// R5: Boletín con Enter: valida el correo con una expresión regular, no permite repetidos
//     (includes) y guarda la lista en localStorage.
