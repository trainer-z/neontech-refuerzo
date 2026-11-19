// =========================================================
// Grupo 6 · Inventario (administrador)
// =========================================================

// ===== Código base (no modificar) =====
const tabla = document.getElementById("tablaInventario");
const resumenInventario = document.getElementById("resumenInventario");
const formNuevo = document.getElementById("formNuevo");
const nuevoNombre = document.getElementById("nuevoNombre");
const nuevaCategoria = document.getElementById("nuevaCategoria");
const nuevoPrecio = document.getElementById("nuevoPrecio");
const nuevoStock = document.getElementById("nuevoStock");
const errorNuevo = document.getElementById("errorNuevo");
const selectOrden = document.getElementById("orden");
const btnRestaurar = document.getElementById("btnRestaurar");

let inventario = [];

// ===== Tu código (comenta cada requisito con // R1, // R2...) =====

// R1: Carga con cargarProductos() (async/await y try/catch), convierte todos los precios a
//     número y pinta un tr por producto con createElement: código, nombre, categoría,
//     precio, stock con botones − y + (data-accion restar y sumar) y botón Eliminar
//     (data-accion eliminar). Cada fila lleva data-id.

// R2: UN solo listener en #tablaInventario: sube del botón a la fila con parentElement
//     (botón → td → tr). sumar y restar cambian el stock (nunca negativo); eliminar quita la
//     fila con remove().

// R3: Cuando el stock es 0, la fila lleva la clase agotado y muestra "Agotado"
//     (classList.toggle con condición).

// R4: Formulario de producto nuevo: valida nombre (mínimo 3), precio (número mayor que 0) y
//     stock (entero desde 0). El código nuevo es el mayor actual + 1. Inserta la fila de
//     primera con insertBefore(fila, tabla.firstElementChild).

// R5: Ordenar con el select (evento change): ordena una COPIA del arreglo con sort y repinta
//     con replaceChildren.

// R6: Después de cada cambio, guarda en CLAVE_INVENTARIO y muestra "Productos: 12 |
//     Unidades: 77 | Agotados: 2". El botón "Restaurar" borra esa clave y vuelve a cargar el
//     JSON original.
