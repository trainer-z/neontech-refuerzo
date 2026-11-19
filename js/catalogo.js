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

cargarProductos();
// ===== Tu código (comenta cada requisito con // R1, // R2...) =====

// R1: Al cargar, usa cargarProductos() con async/await y try/catch. Mientras carga, #estado
//     dice "Cargando productos..."; después, "12 productos disponibles" con la clase exito,
//     o un mensaje de error con la clase fallo. Imprime "Productos cargados: 12".

async function cargarProductos() {

    estado.textContent = "Cargando productos...";

    try {

        const respuesta = await fetch("../json/productos.json");

        if (!respuesta.ok) {
            throw new Error("Error al cargar productos");
        }

        productos = await respuesta.json();

        render(productos);

        estado.textContent = `${productos.length} productos disponibles`;

        estado.classList.add("exito");

        console.log(`Productos cargados: ${productos.length}`);

    } catch (error) {

        estado.textContent = error.message;
        estado.classList.add("fallo");

        console.error(error);
    }
}

// R2: Crea la función renderizar(lista): vacía #catalogo y clona la plantilla #tpl-producto
//     por cada producto. Llena la imagen (src y alt con setAttribute), el nombre, la
//     categoría y el precio con formatoPesos(). Guarda el id del producto en el botón con el
//     atributo data-id.

function render(lista) {

    catalogo.textContent = "";

    lista.forEach(producto => {

        const clon =plantilla.content.cloneNode(true);
        const img = clon.querySelector("img");
        const etiqueta = clon.querySelector(".etiqueta");
        const nombre = clon.querySelector(".nombre");
        const categoria = clon.querySelector(".categoria");
        const precio = clon.querySelector(".precio");
        const boton = clon.querySelector(".btn-agregar");

        img.setAttribute("src",`../imagenes/${producto.imagen}`);
        img.setAttribute("alt",producto.nombre);

        nombre.textContent = producto.nombre;
        categoria.textContent = producto.categoria;
        precio.textContent =formatoPesos(Number(producto.precio));
        boton.setAttribute("data-id",producto.id);

        // R3: Si el stock es 0: etiqueta "Agotado" (clase agotado) y botón deshabilitado con el 
        // texto "Sin unidades". Si es preventa: etiqueta "Preventa" (clase preventa).
        if (Number(producto.stock) === 0) {

            etiqueta.textContent = "Agotado";
            etiqueta.classList.add("agotado");

            boton.disabled = true;
            boton.textContent = "Sin unidades";

        } else if (producto.preventa) {

            etiqueta.textContent = "Preventa";
            etiqueta.classList.add("preventa");
        }

        catalogo.appendChild(clon);
    });
}



// R4: Búsqueda en vivo con el evento input: filtra por nombre sin importar mayúsculas ni
//     espacios al inicio o al final.

function aplicarFiltros() {

    const texto = buscador.value.trim().toLowerCase();

    const resultado = productos.filter(producto => {

        const coincideNombre = producto.nombre.toLowerCase().includes(texto);

        const coincideCategoria = categoriaActiva === "todos" || producto.categoria === categoriaActiva;

        return coincideNombre && coincideCategoria;
    });

    render(resultado);

    console.log(`Filtro: ${categoriaActiva} | Búsqueda: "${texto}" → ${resultado.length} resultados`);

    if (resultado.length === 0) {
        sinResultados.classList.remove("oculto");
    } else {
        sinResultados.classList.add("oculto");
    }
}

buscador.addEventListener("input", aplicarFiltros);


// R5: Filtros con UN solo listener en #filtros: ignora los clics que no sean en un botón
//     (nodeName), mueve la clase activo y combina la categoría con la búsqueda. Imprime el
//     filtro y la cantidad de resultados. Si no hay resultados, muestra #sinResultados.

filtros.addEventListener("click", (e) => {

    if (e.target.nodeName !== "BUTTON") {
        return;
    }

    filtros.querySelector(".activo")?.classList.remove("activo");
    e.target.classList.add("activo");
    categoriaActiva = e.target.dataset.categoria;
    aplicarFiltros();
});

// R6: Agregar al carrito con UN solo listener en #catalogo: reconoce el botón por la clase
//     btn-agregar, convierte data-id a número, suma 1 al producto o lo agrega con cantidad
//     1, sin superar el stock, y guarda con guardarCarrito() (el contador del menú se
//     actualiza solo). El botón muestra "Agregado ✓" y la clase activo durante 1 segundo.

catalogo.addEventListener("click", (e) => {

    if (!e.target.classList.contains("btn-agregar")) {
        return;
    }
    const id = Number(e.target.dataset.id);
    const producto = productos.find(p => p.id === id);
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const existe = carrito.find(p => p.id === id);

    if (existe) {

        if (existe.cantidad >= Number(producto.stock)) {

            console.log(`No hay más unidades de ${producto.nombre}`);
            return;
        }

        existe.cantidad++;

    } else {

        carrito.push({ id: producto.id, nombre: producto.nombre, cantidad: 1 });
    }

    guardarCarrito(carrito);

    const cantidad = carrito.find(p => p.id === id).cantidad;

    console.log(`Agregado: ${producto.nombre} (cantidad: ${cantidad})`);
    e.target.textContent = "Agregado ✓";
    e.target.classList.add("activo");

    setTimeout(() => {
        e.target.textContent = "Agregar al carrito";

        e.target.classList.remove("activo");

    }, 1000);
});