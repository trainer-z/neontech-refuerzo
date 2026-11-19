// =========================================================
// NeónTech · script.js (código común, NO modificar)
// Se carga en TODAS las páginas antes del script de cada grupo.
// =========================================================

// Claves de localStorage (el "contrato" del proyecto)
const CLAVE_CARRITO = "neontech:carrito";       // [{ id, cantidad }]
const CLAVE_RESUMEN = "neontech:resumen";       // { items, subtotal, descuento, envio, total }
const CLAVE_PEDIDO = "neontech:pedido";         // { numero, cliente, items, total, metodo, franja, estado }
const CLAVE_RESENAS = "neontech:resenas";       // [{ productoId, autor, puntaje, texto }]
const CLAVE_INVENTARIO = "neontech:inventario"; // copia editable de los productos

// Las páginas de la carpeta html/ deben subir un nivel para llegar a json/
const RUTA_BASE = location.pathname.includes("/html/") ? "../" : "";

// Lee un valor de localStorage y lo convierte de JSON. Si no existe, devuelve el valor por defecto.
function leerLocal(clave, porDefecto) {
  const texto = localStorage.getItem(clave);
  if (texto === null) return porDefecto;
  try {
    return JSON.parse(texto);
  } catch (error) {
    console.error(`El valor de ${clave} no es un JSON válido`);
    return porDefecto;
  }
}

// Guarda cualquier valor como JSON en localStorage
function guardarLocal(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

// Carga los productos. Si el administrador ya editó el inventario, usa esa copia.
async function cargarProductos() {
  const inventario = leerLocal(CLAVE_INVENTARIO, null);
  if (inventario !== null) return inventario;

  const respuesta = await fetch(`${RUTA_BASE}json/productos.json`);
  if (!respuesta.ok) {
    throw new Error(`No se pudieron cargar los productos (${respuesta.status})`);
  }
  return respuesta.json();
}

// Carga cualquier archivo de la carpeta json/
async function cargarJSON(nombreArchivo) {
  const respuesta = await fetch(`${RUTA_BASE}json/${nombreArchivo}`);
  if (!respuesta.ok) {
    throw new Error(`No se pudo cargar ${nombreArchivo} (${respuesta.status})`);
  }
  return respuesta.json();
}

// Formato de pesos colombianos: 289900 → "$289.900"
function formatoPesos(valor) {
  return "$" + Number(valor).toLocaleString("es-CO");
}

// ---------- Carrito ----------
function obtenerCarrito() {
  return leerLocal(CLAVE_CARRITO, []);
}

function contarUnidades(carrito) {
  return carrito.reduce((total, item) => total + item.cantidad, 0);
}

// Guarda el carrito y avisa a toda la página con un evento personalizado
function guardarCarrito(carrito) {
  guardarLocal(CLAVE_CARRITO, carrito);
  document.dispatchEvent(new CustomEvent("carrito:actualizado", {
    detail: { unidades: contarUnidades(carrito) }
  }));
}

// Contador del menú (está en todas las páginas)
function actualizarContador() {
  const contador = document.getElementById("contadorCarrito");
  if (contador !== null) {
    contador.textContent = contarUnidades(obtenerCarrito());
  }
}

document.addEventListener("carrito:actualizado", actualizarContador);
actualizarContador();
