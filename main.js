// ==============================
// ⚽ DESAFÍO FUTBOLERO - PARTICIPANTE
// ==============================
const API_URL = window.location.origin;

const codigoInput = document.getElementById("codigoAcceso");
const btnAcceder = document.getElementById("btnAcceder");
const jornadaActiva = document.getElementById("jornadaActiva");
const nombreJornada = document.getElementById("nombreJornada");
const premioJornada = document.getElementById("premioJornada");
const listaPartidos = document.getElementById("listaPartidos");
const btnEnviar = document.getElementById("btnEnviar");
const mensaje = document.getElementById("mensaje");

let jornada = null;
let codigoValido = false;

// ==============================
// 🔹 Mostrar mensajes
// ==============================
function mostrarMensaje(texto, tipo = "exito") {
  mensaje.textContent = texto;
  mensaje.className = `mensaje ${tipo}`;
  setTimeout(() => (mensaje.textContent = ""), 4000);
}

// ==============================
// 🔹 Cargar jornada activa
// ==============================
async function cargarJornadaActiva() {
  try {
    const res = await fetch(`${API_URL}/api/jornada-activa`);
    jornada = await res.json();

    if (!jornada) {
      mostrarMensaje("No hay ninguna jornada activa actualmente.", "error");
      return;
    }

    // Mostrar datos
    nombreJornada.textContent = jornada.nombre;
    premioJornada.textContent = `🏆 Premio: ${jornada.premio}`;
    listaPartidos.innerHTML = jornada.partidos
      .map(
        (p, i) => `
        <div class="partido">
          <div class="info">
            <strong>${p.local}</strong> vs <strong>${p.visitante}</strong>
            <div class="fecha">${new Date(p.fecha).toLocaleString("es-CO")}</div>
          </div>
          <div class="pronostico">
            <input type="number" min="0" class="goles-local" id="local-${i}" placeholder="Goles local" />
            <span> - </span>
            <input type="number" min="0" class="goles-visitante" id="visitante-${i}" placeholder="Goles visitante" />
          </div>
        </div>`
      )
      .join("");
  } catch (err) {
    console.error(err);
    mostrarMensaje("Error al cargar la jornada activa.", "error");
  }
}

// ==============================
// 🔹 Validar código de acceso
// ==============================
btnAcceder.addEventListener("click", async () => {
  const codigo = codigoInput.value.trim().toUpperCase();
  if (!codigo) return mostrarMensaje("Por favor ingresa un código.", "error");

  try {
    const res = await fetch(`${API_URL}/api/codigos`);
    const codigos = await res.json();

    const codigoExiste = codigos.find((c) => c.codigo === codigo && !c.usado);
    if (!codigoExiste) {
      mostrarMensaje("Código inválido o ya usado.", "error");
      return;
    }

    codigoValido = true;
    mostrarMensaje("✅ Código válido, puedes participar.");
    jornadaActiva.classList.remove("oculto");
    cargarJornadaActiva();
  } catch (err) {
    console.error(err);
    mostrarMensaje("Error al verificar el código.", "error");
  }
});

// ==============================
// 🔹 Enviar pronósticos
// ==============================
btnEnviar.addEventListener("click", () => {
  if (!codigoValido) return mostrarMensaje("Debes ingresar un código válido.", "error");
  if (!jornada) return mostrarMensaje("No hay jornada activa.", "error");

  const pronosticos = jornada.partidos.map((p, i) => ({
    local: p.local,
    visitante: p.visitante,
    golesLocal: document.getElementById(`local-${i}`).value || "0",
    golesVisitante: document.getElementById(`visitante-${i}`).value || "0",
  }));

  console.log("Pronósticos enviados:", pronosticos);

  // Simulación de guardado (luego se puede guardar en JSON o DB)
  localStorage.setItem(`pronosticos_${codigoInput.value}`, JSON.stringify(pronosticos));

  mostrarMensaje("Pronósticos enviados correctamente ✅");
});
