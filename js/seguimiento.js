// =========================================================
// Grupo 4 · Seguimiento del pedido
// =========================================================

// ===== Código base (no modificar) =====
const ESTADOS = ["Confirmado", "Empacando", "Despachado", "En camino", "Entregado"];
const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const sinPedido = document.getElementById("sinPedido");
const infoPedido = document.getElementById("infoPedido");
const numeroPedido = document.getElementById("numeroPedido");
const datosPedido = document.getElementById("datosPedido");
const pasos = document.getElementById("pasos");
const progreso = document.getElementById("progreso");
const estadoActual = document.getElementById("estadoActual");
const btnIniciar = document.getElementById("btnIniciar");
const btnCancelar = document.getElementById("btnCancelar");
const linkResenas = document.getElementById("linkResenas");

const pedido = leerLocal(CLAVE_PEDIDO, null);
let cancelado = false;
let pasoActual = 0;


// R1: Lee el pedido de CLAVE_PEDIDO. Si no hay, muestra #sinPedido y oculta #infoPedido. Si
//     hay, muestra el número y los datos: "Laura Pérez · 2 productos · $1.286.370 · Entrega
//     en la tarde".
if (pedido === null) {
  sinPedido.classList.remove("oculto");
  infoPedido.classList.add("oculto");
} else {
  sinPedido.classList.add("oculto");
  infoPedido.classList.remove("oculto");

  const cantidadProductos = Array.isArray(pedido.items) ? pedido.items.length : 0;
  const etiquetaProductos = cantidadProductos === 1 ? "1 producto" : `${cantidadProductos} productos`;

  numeroPedido.textContent = `Pedido ${pedido.numero}`;
  datosPedido.textContent = `${pedido.cliente} · ${etiquetaProductos} · ${formatoPesos(pedido.total)} · Entrega en la ${pedido.franja}`;

  // R2: Pinta un li con la clase paso por cada estado de ESTADOS.
  ESTADOS.forEach((nombreEstado, indice) => {
    const itemPaso = document.createElement("li");
    itemPaso.classList.add("paso");
    itemPaso.textContent = `${indice + 1}. ${nombreEstado}`;
    pasos.append(itemPaso);
  });

  // R4: Un listener con nombre (actualizarEstado) marca los pasos con las clases completado y
  //     actual, anima #progreso con animate() desde el ancho anterior hasta el nuevo (fill:
  //     "forwards"), muestra el estado, lo guarda en el pedido e imprime "[2/5] Empacando".
  let anchoAnterior = 0;

  function actualizarEstado(evento) {
    if (cancelado) return;

    const { estado, paso, total } = evento.detail;
    pasoActual = Number(paso);

    const listaPasos = pasos.children;
    for (let i = 0; i < listaPasos.length; i += 1) {
      const li = listaPasos[i];
      li.classList.toggle("completado", i < pasoActual - 1);
      li.classList.toggle("actual", i === pasoActual - 1);
    }

    const nuevoAncho = Math.round((pasoActual / Number(total)) * 100);
    progreso.animate(
      [
        { width: `${anchoAnterior}%` },
        { width: `${nuevoAncho}%` }
      ],
      {
        duration: 400,
        fill: "forwards"
      }
    );
    anchoAnterior = nuevoAncho;

    estadoActual.className = "mensaje";
    estadoActual.textContent = `Estado actual: ${estado} (${pasoActual} de ${total})`;

    pedido.estado = estado;
    guardarLocal(CLAVE_PEDIDO, pedido);

    console.log(`[${pasoActual}/${total}] ${estado}`);

    // R5: Cancelar: el botón se deshabilita desde el paso 3 (Despachado).
    if (pasoActual >= 3) {
      btnCancelar.disabled = true;
    }

    // R6: Al llegar a "Entregado": quita el listener, muestra un mensaje con la clase exito y el
    //     enlace a reseñas (quítale la clase oculto).
    if (estado === "Entregado" || pasoActual === Number(total)) {
      document.removeEventListener("pedido:estado", actualizarEstado);
      btnCancelar.disabled = true;
      estadoActual.classList.add("exito");
      estadoActual.textContent = `¡Pedido ${pedido.numero} entregado con éxito!`;
      linkResenas.classList.remove("oculto");
      console.log("Seguimiento finalizado");
    }
  }

  document.addEventListener("pedido:estado", actualizarEstado);

  // R3: El botón "Ver avance" con { once: true } llama a la función async simularEnvio(): por
  //     cada estado espera 1,5 s con esperar() y emite en document el CustomEvent
  //     "pedido:estado" con detail { estado, paso, total }.
  async function simularEnvio() {
    btnIniciar.disabled = true;
    console.log("Simulación iniciada");

    for (let i = 0; i < ESTADOS.length; i += 1) {
      await esperar(1500);
      if (cancelado) return;

      const estado = ESTADOS[i];
      const paso = i + 1;
      const total = ESTADOS.length;

      document.dispatchEvent(new CustomEvent("pedido:estado", {
        detail: { estado, paso, total }
      }));
    }
  }

  btnIniciar.addEventListener("click", simularEnvio, { once: true });

  // R5: Al cancelar: cambia la variable cancelado, quita el listener, marca el paso con la clase
  //     cancelado, muestra el mensaje con la clase fallo y guarda el estado "Cancelado". La
  //     simulación no debe seguir.
  btnCancelar.addEventListener("click", () => {
    if (cancelado || pasoActual >= 3) return;

    cancelado = true;
    document.removeEventListener("pedido:estado", actualizarEstado);
    btnIniciar.disabled = true;
    btnCancelar.disabled = true;

    const indicePaso = pasoActual > 0 ? pasoActual - 1 : 0;
    const liActual = pasos.children[indicePaso];
    if (liActual) {
      liActual.classList.remove("actual");
      liActual.classList.add("cancelado");
    }

    estadoActual.className = "mensaje fallo";
    estadoActual.textContent = `Pedido ${pedido.numero} cancelado en el paso ${pasoActual || 1}.`;

    pedido.estado = "Cancelado";
    guardarLocal(CLAVE_PEDIDO, pedido);

    console.log(`Pedido ${pedido.numero} cancelado en el paso ${pasoActual || 1}`);
  });

  // Si el pedido ya estaba cancelado o entregado al recargar la página, reflejar su estado inicial
  if (pedido.estado === "Cancelado") {
    cancelado = true;
    document.removeEventListener("pedido:estado", actualizarEstado);
    btnIniciar.disabled = true;
    btnCancelar.disabled = true;
    estadoActual.className = "mensaje fallo";
    estadoActual.textContent = `El pedido ${pedido.numero} fue cancelado.`;
  } else if (pedido.estado === "Entregado") {
    document.removeEventListener("pedido:estado", actualizarEstado);
    btnIniciar.disabled = true;
    btnCancelar.disabled = true;
    const listaPasos = pasos.children;
    for (let i = 0; i < listaPasos.length; i += 1) {
      listaPasos[i].classList.add("completado");
    }
    progreso.style.width = "100%";
    estadoActual.className = "mensaje exito";
    estadoActual.textContent = `¡Pedido ${pedido.numero} entregado con éxito!`;
    linkResenas.classList.remove("oculto");
  }
}
