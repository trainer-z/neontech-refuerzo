// =========================================================
// Grupo 3 - Las Bestias 🫦🔥
//   Paz    → lider de integracion + programa R2 y R6
//   Ardila → probador + programa R3 y R4
//   Carlos → documentador + programa R1 y R5
// =========================================================

// ===== Código base (no modificar) =====
const formulario = document.getElementById("formPedido");
const listaResumen = document.getElementById("listaResumen");
const totalResumen = document.getElementById("totalResumen");
const campoTarjeta = document.getElementById("campoTarjeta");
const btnConfirmar = document.getElementById("btnConfirmar");
const mensajeFinal = document.getElementById("mensajeFinal");

const resumen = leerLocal(CLAVE_RESUMEN, null);

// Reglas de validación: cada campo devuelve un mensaje de error o "" si está bien
const REGLAS = {
  nombre: (valor) => valor.length < 3 ? "Escribe tu nombre completo (mínimo 3 letras)." : "",
  telefono: (valor) => /^3\d{9}$/.test(valor) ? "" : "El celular debe tener 10 dígitos y empezar por 3.",
  correo: (valor) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor) ? "" : "Escribe un correo válido.",
  direccion: (valor) => valor.length < 8 ? "La dirección es muy corta." : "",
  tarjeta: (valor) => /^\d{4}$/.test(valor) ? "" : "Escribe los 4 últimos dígitos.",
  franja: (valor) => valor === "" ? "Elige una franja de entrega." : ""
};

// ===== Tu código (comenta cada requisito con // R1, // R2...) =====

// PAZ (R2 y R6)

// (Paz, para R6) Aqui guardamos el contador de pedidos
const CLAVE_CONSECUTIVO = "neontech:consecutivo";

// (Paz, para R2) Pone el mensaje de error debajo del campo 
function mostrarError(nombreCampo, mensaje) {
  const parrafo = document.getElementById("error-" + nombreCampo);
  if (parrafo) {
    parrafo.textContent = mensaje;
  }
}

// R2 (Paz): Revisa un campo con su regla, muestra el error y lo pinta de rojo o verde.
//     Devuelve true si esta bien y false si esta mal
function validarCampo(nombreCampo) {
  const input = formulario.elements[nombreCampo];
  const valor = input.value.trim(); // quitamos espacios de los lados
  const mensaje = REGLAS[nombreCampo](valor);

  mostrarError(nombreCampo, mensaje);

  if (mensaje === "") {
    input.classList.remove("incorrecto");
    input.classList.add("correcto");
    return true;
  } else {
    input.classList.remove("correcto");
    input.classList.add("incorrecto");
    return false;
  }
}

// R6 (Paz): Si todo esta bien creamos el pedido con su numero
//     lo guardamos, vaciamos el carrito y mandamos al cliente a seguimiento.html
function crearPedido(datos) {
  // Sacamos el ultimo numero, le sumamos 1 y lo guardamos para el proximo pedido
  let consecutivo = Number(leerLocal(CLAVE_CONSECUTIVO, 0));
  consecutivo = consecutivo + 1;
  guardarLocal(CLAVE_CONSECUTIVO, consecutivo);

  // Le ponemos ceros adelante hasta que tenga 4 cifras: 1 → 0001
  let numeroTexto = String(consecutivo);
  while (numeroTexto.length < 4) {
    numeroTexto = "0" + numeroTexto;
  }

  const pedido = {
    numero: "NT-" + numeroTexto,
    cliente: datos.get("nombre").trim(),
    items: resumen.items,
    total: Number(resumen.total),
    metodo: datos.get("metodo"),
    franja: datos.get("franja"),
    estado: "Confirmado"
  };

  guardarLocal(CLAVE_PEDIDO, pedido);       
  guardarCarrito([]);                       
  localStorage.removeItem(CLAVE_RESUMEN);   
  formulario.classList.add("oculto");

  // Usamos textContent (y no innerHTML) porque el nombre lo escribe el usuario
  const texto = document.createElement("p");
  texto.textContent = "¡Gracias, " + pedido.cliente + "! Tu pedido " + pedido.numero +
    " por " + formatoPesos(pedido.total) + " fue confirmado.";

  const enlace = document.createElement("a");
  enlace.href = "seguimiento.html";
  enlace.textContent = "Ver el seguimiento del pedido →";

  mensajeFinal.className = "mensaje exito";
  mensajeFinal.innerHTML = "";
  mensajeFinal.appendChild(texto);
  mensajeFinal.appendChild(enlace);

  console.log("Pedido creado:", pedido);
}