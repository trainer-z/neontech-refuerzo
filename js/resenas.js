// =========================================================
// Grupo 5 · Reseñas
// =========================================================

// ===== Código base (no modificar) =====
const MAX_CARACTERES = 200;

const formulario = document.getElementById("formResena");
const selectProducto = document.getElementById("producto");
const inputAutor = document.getElementById("autor");
const estrellas = document.getElementById("estrellas");
const inputTexto = document.getElementById("texto");
const contador = document.getElementById("contador");
const errorResena = document.getElementById("errorResena");
const filtroPuntaje = document.getElementById("filtroPuntaje");
const promedio = document.getElementById("promedio");
const listaResenas = document.getElementById("listaResenas");

let productos = [];
let resenas = [];
let puntajeElegido = 0;
let filtroActivo = 0; // 0 = todas

// ===== Tu código (comenta cada requisito con // R1, // R2...) =====

// R1: Carga en paralelo los productos y json/resenas.json con Promise.all (cargarProductos()
//     y cargarJSON()). Llena el select con un option por producto y une las reseñas
//     guardadas en CLAVE_RESENAS con las iniciales usando spread.
async function inicializar() {
    try {
        const [listaProductos, resenasJSON] = await Promise.all([
            cargarProductos(),
            cargarJSON("resenas.json")
        ]);

        productos = listaProductos;

        productos.forEach(producto => {
            const option = document.createElement("option");
            option.value = producto.id;
            option.textContent = producto.nombre;
            selectProducto.appendChild(option);
        });

        const resenasGuardadas = leerLocal(CLAVE_RESENAS, []);

        resenas = [
            ...resenasGuardadas,
            ...resenasJSON
        ];

        mostrarResenas();
    } catch (error) {
        errorResena.textContent = "No se pudieron cargar las reseñas.";
        console.error(error);
    }
}

inicializar();

// R2: Estrellas con listeners en #estrellas: mouseover enciende las estrellas hasta la que
//     está bajo el mouse (clase encendida), mouseleave vuelve al puntaje elegido y click lo
//     fija. Ojo: data-valor llega como texto.
function pintarEstrellas(puntaje) {
    const botones = estrellas.querySelectorAll("button");

    botones.forEach(estrella => {
        const valor = Number(estrella.dataset.valor);

        if (valor <= puntaje) {
            estrella.classList.add("encendida");
        } else {
            estrella.classList.remove("encendida");
        }
    });
}

// Al pasar el mouse
estrellas.addEventListener("mouseover", (e) => {
    if (e.target.nodeName !== "BUTTON") return;
    const valor = Number(e.target.dataset.valor);
    pintarEstrellas(valor);
});

// Al hacer clic
estrellas.addEventListener("click", (e) => {
    if (e.target.nodeName !== "BUTTON") return;
    puntajeElegido = Number(e.target.dataset.valor);
    pintarEstrellas(puntajeElegido);
    console.log(`Puntaje elegido: ${puntajeElegido}`);
});

// Al retirar el mouse
estrellas.addEventListener("mouseleave", () => {
    pintarEstrellas(puntajeElegido);
});


// R3: Contador de caracteres en vivo (evento input): "n/200", con la clase excedido si se
//     pasa.
function actualizarContadorTexto() {
    const cantidad = inputTexto.value.length;
    contador.textContent = `${cantidad}/${MAX_CARACTERES}`;
    contador.classList.toggle("excedido", cantidad > MAX_CARACTERES);
}
inputTexto.addEventListener("input", actualizarContadorTexto);

// R4: Al enviar: valida producto, nombre (mínimo 2), puntaje y opinión (de 10 a 200
//     caracteres), y muestra el error en #errorResena. Si todo está bien, agrega la reseña
//     al inicio, guárdala en CLAVE_RESENAS, insértala de primera con
//     insertAdjacentElement("afterbegin") y limpia el formulario y las estrellas.
function validarResena(productoId, autor, texto) {
    if (productoId === "") return "Elige un producto.";
    if (autor.length < 2) return "Escribe tu nombre (mínimo 2 letras).";
    if (puntajeElegido === 0) return "Elige una calificación de 1 a 5 estrellas.";
    if (texto.length < 10) return "La opinión debe tener al menos 10 caracteres.";
    if (texto.length > MAX_CARACTERES) return `La opinión no puede pasar de ${MAX_CARACTERES} caracteres.`;
    return "";
}

formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    const productoId = selectProducto.value;
    const autor = inputAutor.value.trim();
    const texto = inputTexto.value.trim();

    const error = validarResena(productoId, autor, texto);
    errorResena.textContent = error;
    if (error !== "") {
        console.log(`Error: ${error}`);
        return;
    }

    const nueva = {
        productoId: Number(productoId),
        autor: autor,
        puntaje: puntajeElegido,
        texto: texto
    };

    resenas = [nueva, ...resenas];

    const resenasGuardadas = leerLocal(CLAVE_RESENAS, []);
    guardarLocal(CLAVE_RESENAS, [nueva, ...resenasGuardadas]);

    if (filtroActivo === 0 || filtroActivo === nueva.puntaje) {
        listaResenas.insertAdjacentElement("afterbegin", crearResena(nueva));
    }
    mostrarPromedio();
    console.log(`Reseña publicada: ${autor} → ${nueva.puntaje} estrellas`);

    formulario.reset();
    puntajeElegido = 0;
    pintarEstrellas(0);
    actualizarContadorTexto();
});

// R5: Seguridad: crea las reseñas solo con createElement y textContent. Una opinión con
//     etiquetas HTML debe verse como texto.
function crearResena(resena) {
    const producto = productos.find(p => p.id === Number(resena.productoId));

    const li = document.createElement("li");
    li.classList.add("tarjeta", "resena");

    const titulo = document.createElement("h3");
    titulo.textContent = producto ? producto.nombre : "Producto desconocido";

    const puntaje = document.createElement("p");
    puntaje.classList.add("resena-estrellas");
    puntaje.textContent = "★".repeat(resena.puntaje) + "☆".repeat(5 - resena.puntaje);

    const opinion = document.createElement("p");
    opinion.classList.add("resena-texto");
    opinion.textContent = resena.texto;

    const autor = document.createElement("p");
    autor.classList.add("resena-autor");
    autor.textContent = `— ${resena.autor}`;

    li.append(titulo, puntaje, opinion, autor);
    return li;
}

// R6: Filtro por puntaje con UN solo listener en #filtroPuntaje y promedio de las reseñas
//     visibles con 1 decimal: "Promedio: 4.3 de 5 (4 reseñas)".
function resenasVisibles() {
    if (filtroActivo === 0) return resenas;
    return resenas.filter(resena => resena.puntaje === filtroActivo);
}

function mostrarPromedio() {
    const visibles = resenasVisibles();

    if (visibles.length === 0) {
        promedio.textContent = "No hay reseñas con ese puntaje.";
        console.log(promedio.textContent);
        return;
    }

    const suma = visibles.reduce((total, resena) => total + resena.puntaje, 0);
    const valor = (suma / visibles.length).toFixed(1);
    promedio.textContent = `Promedio: ${valor} de 5 (${visibles.length} reseñas)`;
    console.log(promedio.textContent);
}

function mostrarResenas() {
    const tarjetas = resenasVisibles().map(crearResena);
    listaResenas.replaceChildren(...tarjetas);
    mostrarPromedio();
}

filtroPuntaje.addEventListener("click", (e) => {
    if (e.target.nodeName !== "BUTTON") return;

    filtroPuntaje.querySelector(".activo").classList.remove("activo");
    e.target.classList.add("activo");

    filtroActivo = Number(e.target.dataset.puntaje);
    mostrarResenas();
});