// =========================================================
// Grupo 1 · Catálogo
// =========================================================

// ===== Código base (no modificar) =====
const estado = document.getElementById("estado");
const buscador = document.getElementById("buscador");
const filtros = document.getElementById("filtros");
const catalogo = document.getElementById("catalogo");
const sinResultados = document.getElementById("sinResultados");
const plantilla = document.getElementById("tpl-producto");

let productos = [];
let categoriaActiva = "todos";

// ===== Tu código (comenta cada requisito con // R1, // R2...) =====

// R1: Al cargar, usa cargarProductos() con async/await y try/catch. Mientras carga, #estado
//     dice "Cargando productos..."; después, "12 productos disponibles" con la clase exito,
//     o un mensaje de error con la clase fallo. Imprime "Productos cargados: 12".

// R2: Crea la función renderizar(lista): vacía #catalogo y clona la plantilla #tpl-producto
//     por cada producto. Llena la imagen (src y alt con setAttribute), el nombre, la
//     categoría y el precio con formatoPesos(). Guarda el id del producto en el botón con el
//     atributo data-id.

// R3: Si el stock es 0: etiqueta "Agotado" (clase agotado) y botón deshabilitado con el
//     texto "Sin unidades". Si es preventa: etiqueta "Preventa" (clase preventa).

// R4: Búsqueda en vivo con el evento input: filtra por nombre sin importar mayúsculas ni
//     espacios al inicio o al final.

// R5: Filtros con UN solo listener en #filtros: ignora los clics que no sean en un botón
//     (nodeName), mueve la clase activo y combina la categoría con la búsqueda. Imprime el
//     filtro y la cantidad de resultados. Si no hay resultados, muestra #sinResultados.

// R6: Agregar al carrito con UN solo listener en #catalogo: reconoce el botón por la clase
//     btn-agregar, convierte data-id a número, suma 1 al producto o lo agrega con cantidad
//     1, sin superar el stock, y guarda con guardarCarrito() (el contador del menú se
//     actualiza solo). El botón muestra "Agregado ✓" y la clase activo durante 1 segundo.
