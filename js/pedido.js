// =========================================================
// Grupo 3 · Hacer pedido
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

// R1: Muestra el resumen guardado en CLAVE_RESUMEN: un li "Nombre x cantidad" por producto y
//     el total con formatoPesos(). Si no hay resumen, muestra un aviso en #listaResumen y
//     deshabilita el botón Confirmar.

// R2: Crea validarCampo(nombreCampo) usando el objeto REGLAS: muestra el mensaje en
//     #error-<campo>, alterna las clases incorrecto y correcto en el input, y devuelve true
//     o false.

// R3: Validación en vivo con UN solo listener de input en el formulario (el evento
//     burbujea): usa e.target.name para saber qué campo validar.

// R4: Con el evento change en el formulario: si el método de pago es "tarjeta", muestra
//     #campoTarjeta; con cualquier otro, lo oculta (classList.toggle con condición).

// R5: Al enviar: preventDefault, FormData y validación de TODOS los campos a la vez (también
//     la tarjeta si aplica), el método de pago y los términos. Si hay errores, mensaje con
//     la clase fallo e imprime cuántos errores hay.

// R6: Si todo está bien: crea el pedido { numero, cliente, items, total, metodo, franja,
//     estado: "Confirmado" }. El número sale de un consecutivo guardado en localStorage con
//     padStart ("NT-0001"). Guárdalo en CLAVE_PEDIDO, vacía el carrito con
//     guardarCarrito([]), borra el resumen, oculta el formulario y muestra el mensaje con un
//     enlace a seguimiento.html.
