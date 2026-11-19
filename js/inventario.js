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

function crearFila(producto) {
  const tr = document.createElement("tr");
  tr.setAttribute("data-id", producto.id);

  const tdCodigo = document.createElement("td");
  tdCodigo.textContent = producto.id;

  const tdNombre = document.createElement("td");
  tdNombre.textContent = producto.nombre;

  const tdCategoria = document.createElement("td");
  tdCategoria.textContent = producto.categoria;

  const tdPrecio = document.createElement("td");
  tdPrecio.textContent = formatoPesos(producto.precio);

  const tdStock = document.createElement("td");

  const btnRestar = document.createElement("button");
  btnRestar.setAttribute("data-accion", "restar");
  btnRestar.textContent = "−";

  const spanCantidad = document.createElement("span");
  spanCantidad.classList.add("cantidad");
  spanCantidad.textContent = producto.stock;

  const btnSumar = document.createElement("button");
  btnSumar.setAttribute("data-accion", "sumar");
  btnSumar.textContent = "+";

  tdStock.append(btnRestar, " ", spanCantidad, " ", btnSumar);

  const tdAcciones = document.createElement("td");
  const btnEliminar = document.createElement("button");
  btnEliminar.setAttribute("data-accion", "eliminar");
  btnEliminar.textContent = "Eliminar";
  tdAcciones.append(btnEliminar);

  tr.append(tdCodigo, tdNombre, tdCategoria, tdPrecio, tdStock, tdAcciones);
  return tr;
}

function pintarInventario(lista) {
  tabla.replaceChildren();
  for (const producto of lista) {
    const fila = crearFila(producto);
    tabla.append(fila);
  }
}

async function iniciarInventario() {
  try {
    const datos = await cargarProductos();
    inventario = datos.map((producto) => ({
      ...producto,
      id: Number(producto.id),
      precio: Number(producto.precio),
      stock: Number(producto.stock),
    }));

    pintarInventario(inventario);
    console.log(`Productos cargados: ${inventario.length}`);
  } catch (error) {
    console.error("Error al cargar el inventario:", error);
    resumenInventario.classList.remove("exito");
    resumenInventario.classList.add("fallo");
    resumenInventario.textContent = "Error al cargar los productos del inventario.";
  }
}

iniciarInventario();

// R2: UN solo listener en #tablaInventario: sube del botón a la fila con parentElement
//     (botón → td → tr). sumar y restar cambian el stock (nunca negativo); eliminar quita la
//     fila con remove().

tabla.addEventListener("click", (e) => {
  const boton = e.target;

  // R2: se ignoran los clics que no son en un botón (burbujeo)
  if (boton.nodeName !== "BUTTON") return;

  // R2: botón → td → tr
  const fila = boton.parentElement.parentElement;
  const id = Number(fila.getAttribute("data-id"));
  const producto = inventario.find((p) => p.id === id);
  const accion = boton.getAttribute("data-accion");

  if (producto === undefined) {
    console.error(`No se encontró el producto con código ${id}`);
    return;
  }

  if (accion === "sumar") {
    producto.stock += 1;
  } else if (accion === "restar") {
    // R2: el stock nunca queda negativo
    producto.stock = Math.max(0, producto.stock - 1);
  } else if (accion === "eliminar") {
    // R2: se quita de los datos y de la pantalla
    inventario = inventario.filter((p) => p.id !== id);
    fila.remove();
    console.log(`Eliminado: ${producto.nombre}`);
    return;
  } else {
    return; // botón sin una acción conocida
  }

  actualizarFila(fila, producto);
});

// R3: Cuando el stock es 0, la fila lleva la clase agotado y muestra "Agotado"
//     (classList.toggle con condición).

function actualizarFila(fila, producto) {
  const agotado = producto.stock === 0;
  const cantidad = fila.querySelector(".cantidad");
  cantidad.textContent = producto.stock;

  let estado = fila.querySelector(".estado-stock");
  if (estado === null) {
    estado = document.createElement("span");
    estado.classList.add("estado-stock");
    cantidad.parentElement.append(" ", estado);
  }

  estado.textContent = agotado ? "Agotado" : "";
  fila.classList.toggle("agotado", agotado);
}

// R4: Formulario de producto nuevo: valida nombre (mínimo 3), precio (número mayor que 0) y
//     stock (entero desde 0). El código nuevo es el mayor actual + 1. Inserta la fila de
//     primera con insertBefore(fila, tabla.firstElementChild).

// R5: Ordenar con el select (evento change): ordena una COPIA del arreglo con sort y repinta
//     con replaceChildren.

// R6: Después de cada cambio, guarda en CLAVE_INVENTARIO y muestra "Productos: 12 |
//     Unidades: 77 | Agotados: 2". El botón "Restaurar" borra esa clave y vuelve a cargar el
//     JSON original.
