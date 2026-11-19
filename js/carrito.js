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

async function inicializarCarrito() {
    try{
        productos = await cargarProduto();
        renderizar();
    }catch(error) {
        console.error ("error al cargar los productos:", error);
        renderizar();
    }
    
}

// R2: Crea renderizar(): por cada producto del carrito, un li con la clase tarjeta y
//     data-id, el nombre, el texto "precio x cantidad = subtotal" y tres botones creados con
//     createElement, con data-accion: restar, sumar y eliminar.

function renderizar() {
    const carrito = obtenerCarrito();
    listaCarrito.innerHTML();
}

// R3: UN solo listener en #listaCarrito: lee data-accion y sube al li con parentElement para
//     saber el id. sumar no puede superar el stock (avisa en consola); restar quita el
//     producto si llega a 0; eliminar lo quita. Guarda con guardarCarrito() y vuelve a
//     pintar.

listaCarrito.addEventListener("click", (e) => {
    const boton = e.terget.closest("button[data-accion]");
    if (!boton) return ;
    
    const accion = boton.dataset.accion;
    const li = boton.parentElement;
    const id = li?.dataset.id;
    if (!id) return;
    
    let carrito = obtenerCarrito();
    const indice = carrito.findIndex ((item) => String(item.id) === string(id));
    if (indice === -1) return;

    const itemActual = carrito[indice];
    const prodCatalogo = productos.find((p) => string(p.id) === string(id));
    const stockDisponible = prodCatalogo?.stock !== undefined ? Number(prodCatalogo.stock) : Infinity;

    if (accion === "sumar") {
        const nuevaCantidad = Number(itemActual.cantidad) + 1;
        if (nuevaCantidad > stockDisponible) {
            console.warn (`No se puede agregar más de "${itemActual.nombre ?? prodCatalogo?.nombre ?? id}": stock máximo (${stockDisponible}).`);
            return;
        }
        itemActual.cantidad = nuevaCantidad;
    }   else if (accion === "restar") {
        const nuevaCantidad = Number(itemActual.cantidad) -1;
        if(nuevaCantidad <= 0) {
            carrito.splice(indice, 1);
        } else {
            itemActual.cantidad = nuevaCantidad;
        }
    } else if (accion === "eliminar") {
        carrito.splice(indice, 1);
    }

    guardarCarrito(carrito);
    renderizar(); 
})

// R4: Totales: subtotal con reduce (convierte los precios con Number()), descuento según el
//     cupón (Math.round), envío y total, todo con formatoPesos(). Imprime "Carrito: n
//     unidades | Total: $...".

function calcularTotales(carrito = obtenerCarrito()) {
    const subtotal = carrito.reduce((acc, item) => {
        const precio = Number(item.precio ?? 0);
        const cantidad = Number(item.cantidad ?? 0);
        return acc + precio * cantidad;
    }, 0);

    const unidades = carrito.reduce((acc, item) => acc + Number(item.cantidad ?? 0), 0);

    const descuento =subtotal > 0 ? Math.round((subtotal * porcentajeDescuento) / 100) : 0;
    const baseConDescuento = Math.max(0, subtotal - descuento);
    const envio = baseConDescuento === 0 || baseConDescuento >= ENVIO_GRATIS_DESDE ? 0 : ENVIO;
    const total = baseConDescuento + envio;

    textoSubtotal.textContent = formatoPesos(subtotal);
    textoDescuento.textContent = formatoPesos(descuento);
    textoEnvio.textContent = formatoPesos(envio);
    textoTotal.textContent = formatoPesos(total),

    console.log(`Carrito: ${unidades} unidades | Total: ${formatoPesos(total)}`);
    return{ subtotal, descuento, envio, total};
}

// R5: Cupón con la tecla Enter (keydown y e.key): limpia el texto con trim() y
//     toUpperCase(). Si existe en CUPONES, mensaje con la clase exito; si no, con la clase
//     fallo. Recalcula los totales.

inputCupon.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const codigo = inputCupon.value.trim().toUpperCase();
    mensajeCupon.classList.remove("exito", "fallo");

    if(!codigo) {
        porcentajeDescuento = 0;
        mensajeCupon.textContent = "Ingrese codigo del cupon.";
        mensajeCupon.classList.add = "Fallo";
    } else if (Object.prototype.hasOwnProperty.call(CUPONES, codigo)) {
        porcentajeDescuento = CUPONES[codigo];
        mensajeCupon.textContent = `Cupon ${codigo} aplicado (${porcentajeDescuento}% de descuento).`;
        mensajeCupon.classList.add = "Exito";
    } else {
        porcentajeDescuento = 0;
        mensajeCupon.textContent = `El cupon "${codigo}" no es valido.`;
        mensajeCupon.classList.add("Fallo");
    }
    calcularTotales();
})

// R6: Carrito vacío: muestra #vacio y deshabilita "Hacer pedido" y "Vaciar carrito" con
//     toggleAttribute("disabled", condición). "Vaciar carrito" deja el carrito en [].

btnVaciar.addEventListener("click", () => {
    guardarCarrito([]);
    porcentajeDescuento = 0;
    inputCupon.value = "";
    mensajeCupon.textContent = "";
    mensajeCupon.classList.remove("Exito", "Fallo");
    renderizar();
});

// R7: "Hacer pedido" guarda en CLAVE_RESUMEN un objeto { items: [{ id, nombre, precio,
//     cantidad }], subtotal, descuento, envio, total } y lleva a pedido.html.