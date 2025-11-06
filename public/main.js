const API_BASE = window.location.origin.includes("render.com")
  ? window.location.origin
  : "http://localhost:3000";

// ==============================
// 💾 CREAR NUEVA JORNADA
// ==============================
const formJornada = document.getElementById("formJornada");
const agregarPartidoBtn = document.getElementById("agregarPartido");
const partidosContainer = document.getElementById("partidosContainer");
const mensajeDiv = document.getElementById("mensaje");

agregarPartidoBtn.addEventListener("click", () => {
  const div = document.createElement("div");
  div.classList.add("partido");
  div.innerHTML = `
    <input type="text" class="local" placeholder="Equipo local" required />
    <input type="text" class="visitante" placeholder="Equipo visitante" required />
    <input type="datetime-local" class="fechaPartido" required />
    <button type="button" class="eliminarPartido">❌</button>
  `;
  div.querySelector(".eliminarPartido").addEventListener("click", () => div.remove());
  partidosContainer.appendChild(div);
});

formJornada.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const premio = document.getElementById("premio").value.trim();
  const partidos = Array.from(document.querySelectorAll(".partido")).map((p) => ({
    local: p.querySelector(".local").value.trim(),
    visitante: p.querySelector(".visitante").value.trim(),
    fecha: p.querySelector(".fechaPartido").value,
  }));

  if (!nombre || !premio || partidos.some(p => !p.local || !p.visitante)) {
    mostrarMensaje("❌ Completa todos los campos antes de guardar.", true);
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/jornada`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, premio, partidos }),
    });

    if (!res.ok) throw new Error(`Error del servidor (${res.status})`);

    const data = await res.json();
    mostrarMensaje(data.message || "✅ Jornada creada con éxito");
    formJornada.reset();
    cargarJornadas();
  } catch (err) {
    mostrarMensaje("⚠️ Error al guardar la jornada: " + err.message, true);
  }
});

// ==============================
// ⚙️ CARGAR JORNADAS EXISTENTES
// ==============================
const selectJornada = document.getElementById("selectJornada");
const activarBtn = document.getElementById("activarJornada");

async function cargarJornadas() {
  try {
    const res = await fetch(`${API_BASE}/api/jornadas`);
    if (!res.ok) throw new Error("Error al obtener jornadas");
    const jornadas = await res.json();

    selectJornada.innerHTML = "";
    if (!jornadas.length) {
      selectJornada.innerHTML = `<option value="">No hay jornadas</option>`;
      return;
    }

    jornadas.forEach((j) => {
      const opt = document.createElement("option");
      opt.value = j.id;
      opt.textContent = `${j.nombre} ${j.activa ? "(Activa)" : ""}`;
      selectJornada.appendChild(opt);
    });
  } catch (err) {
    console.error("Error cargando jornadas:", err);
    mostrarMensaje("⚠️ Error al obtener jornadas", true);
  }
}

// ==============================
// 🔓 ACTIVAR JORNADA
// ==============================
activarBtn.addEventListener("click", async () => {
  const id = selectJornada.value;
  if (!id) {
    mostrarMensaje("Selecciona una jornada para activar", true);
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/activar/${id}`, { method: "POST" });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    const data = await res.json();
    mostrarMensaje(data.message || "✅ Jornada activada correctamente");
    cargarJornadas();
  } catch (err) {
    mostrarMensaje("⚠️ Error al activar jornada: " + err.message, true);
  }
});

// ==============================
// 🎟️ GENERAR CÓDIGOS
// ==============================
const generarBtn = document.getElementById("generarCodigos");
const listaCodigos = document.getElementById("listaCodigos");

generarBtn.addEventListener("click", async () => {
  const cantidad = document.getElementById("cantidadCodigos").value;
  if (!cantidad || cantidad <= 0) {
    mostrarMensaje("⚠️ Ingresa una cantidad válida.", true);
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/codigos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cantidad: parseInt(cantidad) }),
    });

    if (!res.ok) throw new Error(`Error ${res.status}`);

    const data = await res.json();
    mostrarMensaje(data.message || "🎟️ Códigos generados correctamente");
    mostrarCodigos(data.nuevos);
  } catch (err) {
    mostrarMensaje("⚠️ Error generando códigos: " + err.message, true);
  }
});

async function mostrarCodigos() {
  try {
    const res = await fetch(`${API_BASE}/api/codigos`);
    if (!res.ok) throw new Error("Error obteniendo códigos");
    const codigos = await res.json();

    listaCodigos.innerHTML = codigos
      .map((c) => `<div class="codigo">${c.codigo}</div>`)
      .join("");
  } catch (err) {
    console.error("Error mostrando códigos:", err);
  }
}

// ==============================
// 🧩 UTILIDAD: MENSAJES
// ==============================
function mostrarMensaje(texto, error = false) {
  mensajeDiv.textContent = texto;
  mensajeDiv.className = "mensaje " + (error ? "error" : "exito");
  setTimeout(() => (mensajeDiv.textContent = ""), 4000);
}

// ==============================
// 🚀 INICIALIZAR
// ==============================
cargarJornadas();
mostrarCodigos();
