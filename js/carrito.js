// =========================================================
// Grupo 2 · Carrito
// =========================================================

// ===== Código base (no modificar) =====
const CUPONES = { NEON10: 10, PREVENTA5: 5 }; // porcentaje de descuento
const ENVIO = 12000;
const ENVIO_GRATIS_DESDE = 300000;

const listaCarrito = document.getElementById("listaCarrito");
const vacio = document.getElementById("vacio");
const inputCupon = document.getElementById("cupon");
const mensajeCupon = document.getElementById("mensajeCupon");
const textoSubtotal = document.getElementById("subtotal");
const textoDescuento = document.getElementById("descuento");
const textoEnvio = document.getElementById("envio");
const textoTotal = document.getElementById("total");
const btnVaciar = document.getElementById("btnVaciar");
const btnPedido = document.getElementById("btnPedido");

let productos = [];
let porcentajeDescuento = 0;

// ===== Tu código (comenta cada requisito con // R1, // R2...) =====

// R1: Al cargar, obtén los productos con cargarProductos() (async/await y try/catch) y pinta
//     el carrito que devuelve obtenerCarrito().

// R2: Crea renderizar(): por cada producto del carrito, un li con la clase tarjeta y
//     data-id, el nombre, el texto "precio x cantidad = subtotal" y tres botones creados con
//     createElement, con data-accion: restar, sumar y eliminar.

// R3: UN solo listener en #listaCarrito: lee data-accion y sube al li con parentElement para
//     saber el id. sumar no puede superar el stock (avisa en consola); restar quita el
//     producto si llega a 0; eliminar lo quita. Guarda con guardarCarrito() y vuelve a
//     pintar.

// R4: Totales: subtotal con reduce (convierte los precios con Number()), descuento según el
//     cupón (Math.round), envío y total, todo con formatoPesos(). Imprime "Carrito: n
//     unidades | Total: $...".

// R5: Cupón con la tecla Enter (keydown y e.key): limpia el texto con trim() y
//     toUpperCase(). Si existe en CUPONES, mensaje con la clase exito; si no, con la clase
//     fallo. Recalcula los totales.

// R6: Carrito vacío: muestra #vacio y deshabilita "Hacer pedido" y "Vaciar carrito" con
//     toggleAttribute("disabled", condición). "Vaciar carrito" deja el carrito en [].

// R7: "Hacer pedido" guarda en CLAVE_RESUMEN un objeto { items: [{ id, nombre, precio,
//     cantidad }], subtotal, descuento, envio, total } y lleva a pedido.html.
