// ==============================
// ⚙️ Configuración general
// ==============================
const API_URL = window.location.origin;

// Elementos del DOM
const formJornada = document.getElementById("formJornada");
const partidosContainer = document.getElementById("partidosContainer");
const agregarPartidoBtn = document.getElementById("agregarPartido");
const selectJornada = document.getElementById("selectJornada");
const activarJornadaBtn = document.getElementById("activarJornada");
const cantidadCodigos = document.getElementById("cantidadCodigos");
const generarCodigosBtn = document.getElementById("generarCodigos");
const listaCodigos = document.getElementById("listaCodigos");
const mensaje = document.getElementById("mensaje");

// ==============================
// 🔹 Mostrar mensajes
// ==============================
function mostrarMensaje(texto, tipo = "exito") {
  mensaje.textContent = texto;
  mensaje.className = `mensaje ${tipo}`;
  setTimeout(() => {
    mensaje.textContent = "";
    mensaje.className = "mensaje";
  }, 4000);
}

// ==============================
// 🔹 Agregar partido dinámicamente
// ==============================
agregarPartidoBtn.addEventListener("click", () => {
  const div = document.createElement("div");
  div.classList.add("partido");
  div.innerHTML = `
    <input type="text" class="local" placeholder="Equipo local" required />
    <input type="text" class="visitante" placeholder="Equipo visitante" required />
    <input type="datetime-local" class="fechaPartido" required />
  `;
  partidosContainer.appendChild(div);
});

// ==============================
// 🔹 Crear nueva jornada
// ==============================
formJornada.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const premio = document.getElementById("premio").value.trim();

  const partidos = Array.from(document.querySelectorAll(".partido")).map((p) => ({
    local: p.querySelector(".local").value.trim(),
    visitante: p.querySelector(".visitante").value.trim(),
    fecha: p.querySelector(".fechaPartido").value,
  }));

  if (!nombre || !premio || partidos.length === 0) {
    return mostrarMensaje("Completa todos los campos requeridos.", "error");
  }

  try {
    const res = await fetch(`${API_URL}/api/jornada`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, premio, partidos }),
    });

    if (!res.ok) throw new Error("Error en el servidor");
    const data = await res.json();

    mostrarMensaje(data.message, "exito");
    formJornada.reset();
    cargarJornadas();
  } catch (err) {
    console.error(err);
    mostrarMensaje("❌ Error al conectar con el servidor.", "error");
  }
});

// ==============================
// 🔹 Cargar jornadas existentes
// ==============================
async function cargarJornadas() {
  try {
    const res = await fetch(`${API_URL}/api/jornadas`);
    if (!res.ok) throw new Error("Error al obtener jornadas");
    const jornadas = await res.json();

    selectJornada.innerHTML = "<option value=''>Selecciona una jornada</option>";

    jornadas.forEach((j) => {
      const option = document.createElement("option");
      option.value = j.id;
      option.textContent = `${j.nombre} (${j.activa ? "Activa" : "Inactiva"})`;
      selectJornada.appendChild(option);
    });
  } catch (err) {
    console.error(err);
    mostrarMensaje("Error al cargar jornadas.", "error");
  }
}
cargarJornadas();

// ==============================
// 🔹 Activar jornada
// ==============================
activarJornadaBtn.addEventListener("click", async () => {
  const id = selectJornada.value;
  if (!id) return mostrarMensaje("Selecciona una jornada para activar.", "error");

  try {
    const res = await fetch(`${API_URL}/api/activar/${id}`, { method: "POST" });
    if (!res.ok) throw new Error("Error al activar jornada");
    const data = await res.json();

    mostrarMensaje(data.message, "exito");
    cargarJornadas();
  } catch (err) {
    console.error(err);
    mostrarMensaje("Error al conectar con el servidor.", "error");
  }
});

// ==============================
// 🔹 Generar códigos
// ==============================
generarCodigosBtn.addEventListener("click", async () => {
  const cantidad = parseInt(cantidadCodigos.value);
  if (!cantidad || cantidad <= 0)
    return mostrarMensaje("Cantidad inválida.", "error");

  try {
    const res = await fetch(`${API_URL}/api/codigos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cantidad }),
    });

    if (!res.ok) throw new Error("Error al generar códigos");
    const data = await res.json();

    mostrarMensaje(data.message, "exito");
    mostrarCodigos();
  } catch (err) {
    console.error(err);
    mostrarMensaje("Error al conectar con el servidor.", "error");
  }
});

// ==============================
// 🔹 Mostrar códigos
// ==============================
async function mostrarCodigos() {
  try {
    const res = await fetch(`${API_URL}/api/codigos`);
    if (!res.ok) throw new Error("Error al obtener códigos");
    const codigos = await res.json();

    listaCodigos.innerHTML =
      "<h3>Códigos Generados:</h3>" +
      codigos
        .map((c) => `<div>${c.codigo} ${c.usado ? "(Usado)" : ""}</div>`)
        .join("");
  } catch (err) {
    console.error(err);
    mostrarMensaje("Error al cargar códigos.", "error");
  }
}
mostrarCodigos();
