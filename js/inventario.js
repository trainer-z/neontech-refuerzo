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

// R1: Cargar los productos, normalizar sus datos y construir cada fila con createElement.
function crearFila(producto) {
  const fila = document.createElement("tr");
  fila.setAttribute("data-id", producto.id);

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
  btnRestar.type = "button";
  btnRestar.setAttribute("data-accion", "restar");
  btnRestar.textContent = "−";

  const cantidad = document.createElement("span");
  cantidad.classList.add("cantidad");
  cantidad.textContent = producto.stock;

  const btnSumar = document.createElement("button");
  btnSumar.type = "button";
  btnSumar.setAttribute("data-accion", "sumar");
  btnSumar.textContent = "+";
  tdStock.append(btnRestar, " ", cantidad, " ", btnSumar);

  const tdAcciones = document.createElement("td");
  const btnEliminar = document.createElement("button");
  btnEliminar.type = "button";
  btnEliminar.setAttribute("data-accion", "eliminar");
  btnEliminar.textContent = "Eliminar";
  tdAcciones.append(btnEliminar);

  fila.append(tdCodigo, tdNombre, tdCategoria, tdPrecio, tdStock, tdAcciones);
  actualizarFila(fila, producto);
  return fila;
}

function pintarInventario(lista) {
  tabla.replaceChildren();
  for (const producto of lista) {
    tabla.append(crearFila(producto));
  }
}

function actualizarResumen() {
  const unidades = inventario.reduce((total, producto) => total + producto.stock, 0);
  const agotados = inventario.filter((producto) => producto.stock === 0).length;

  resumenInventario.classList.remove("fallo");
  resumenInventario.classList.add("exito");
  resumenInventario.textContent =
    `Productos: ${inventario.length} | Unidades: ${unidades} | Agotados: ${agotados}`;
}

function mostrarError(mensaje) {
  resumenInventario.classList.remove("exito");
  resumenInventario.classList.add("fallo");
  resumenInventario.textContent = mensaje;
}

function guardarCambios() {
  try {
    guardarLocal(CLAVE_INVENTARIO, inventario);
    actualizarResumen();
  } catch (error) {
    console.error("No se pudo guardar el inventario:", error);
    mostrarError("No se pudieron guardar los cambios del inventario.");
  }
}

async function iniciarInventario() {
  try {
    const datos = await cargarProductos();
    if (!Array.isArray(datos)) {
      throw new TypeError("Los datos del inventario no tienen un formato válido.");
    }

    inventario = datos.map((producto) => ({
      ...producto,
      id: Number(producto.id),
      precio: Number(producto.precio),
      stock: Number(producto.stock),
    }));

    pintarInventario(inventario);
    actualizarResumen();
  } catch (error) {
    console.error("Error al cargar el inventario:", error);
    inventario = [];
    tabla.replaceChildren();
    mostrarError("Error al cargar los productos del inventario.");
  }
}

iniciarInventario();

// R2: Un solo listener delegado sube del botón a la fila con parentElement.
tabla.addEventListener("click", (e) => {
  const boton = e.target;
  if (boton.nodeName !== "BUTTON") return;

  const fila = boton.parentElement.parentElement;
  const id = Number(fila.getAttribute("data-id"));
  const producto = inventario.find((item) => item.id === id);
  const accion = boton.getAttribute("data-accion");

  if (producto === undefined) {
    console.error(`No se encontró el producto con código ${id}`);
    return;
  }

  if (accion === "sumar") {
    producto.stock += 1;
  } else if (accion === "restar") {
    producto.stock = Math.max(0, producto.stock - 1);
  } else if (accion === "eliminar") {
    inventario = inventario.filter((item) => item.id !== id);
    fila.remove();
    guardarCambios();
    return;
  } else {
    return;
  }

  actualizarFila(fila, producto);
  guardarCambios();
});

// R3: Mostrar el estado agotado tanto al cargar como al cambiar el stock.
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

// R4: Validar el formulario y añadir el nuevo producto al inicio de la tabla.
formNuevo.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = nuevoNombre.value.trim();
  const precioTexto = nuevoPrecio.value.trim();
  const stockTexto = nuevoStock.value.trim();
  const precio = Number(precioTexto);
  const stock = Number(stockTexto);

  if (nombre.length < 3) {
    errorNuevo.textContent = "Error: El nombre debe tener al menos 3 caracteres.";
    return;
  }

  if (precioTexto === "" || !Number.isFinite(precio) || precio <= 0) {
    errorNuevo.textContent = "Error: El precio debe ser un número mayor que 0.";
    return;
  }

  if (stockTexto === "" || !Number.isInteger(stock) || stock < 0) {
    errorNuevo.textContent = "Error: El stock debe ser un número entero desde 0.";
    return;
  }

  const nuevoId = inventario.length === 0
    ? 1
    : Math.max(...inventario.map((producto) => Number(producto.id))) + 1;
  const productoNuevo = {
    id: nuevoId,
    nombre,
    categoria: nuevaCategoria.value,
    precio,
    stock,
  };

  inventario.push(productoNuevo);
  const fila = crearFila(productoNuevo);
  tabla.insertBefore(fila, tabla.firstElementChild);
  errorNuevo.textContent = "";
  formNuevo.reset();
  guardarCambios();
});

// R5: Ordenar una copia para no alterar el orden almacenado en el inventario.
selectOrden.addEventListener("change", () => {
  const copia = [...inventario];

  switch (selectOrden.value) {
    case "id":
      copia.sort((a, b) => a.id - b.id);
      break;
    case "nombre":
      copia.sort((a, b) => a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" }));
      break;
    case "precio-asc":
      copia.sort((a, b) => a.precio - b.precio);
      break;
    case "precio-desc":
      copia.sort((a, b) => b.precio - a.precio);
      break;
    case "stock":
      copia.sort((a, b) => a.stock - b.stock);
      break;
    default:
      return;
  }

  pintarInventario(copia);
});

// R6: Persistir cambios, mostrar el resumen y restaurar el JSON original.
btnRestaurar.addEventListener("click", async () => {
  try {
    localStorage.removeItem(CLAVE_INVENTARIO);
    await iniciarInventario();
  } catch (error) {
    console.error("Error al restaurar el inventario:", error);
    mostrarError("No se pudo restaurar el inventario original.");
  }
});
