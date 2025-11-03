// admin.js

const API_URL = window.location.origin;

// Elementos
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
// 🔹 Función para mostrar mensaje
// ==============================
function mostrarMensaje(texto, tipo = "exito") {
  mensaje.textContent = texto;
  mensaje.className = `mensaje ${tipo}`;
  setTimeout(() => (mensaje.textContent = ""), 4000);
}

// ==============================
// 🔹 Agregar nuevo partido
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

  const nombre = document.getElementById("nombre").value;
  const fecha = document.getElementById("fecha").value;
  const premio = document.getElementById("premio").value;

  const partidos = Array.from(document.querySelectorAll(".partido")).map((p) => ({
    local: p.querySelector(".local").value,
    visitante: p.querySelector(".visitante").value,
    fecha: p.querySelector(".fechaPartido").value,
  }));

  try {
    const res = await fetch(`${API_URL}/api/jornada`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, fecha, premio, partidos }),
    });

    const data = await res.json();
    mostrarMensaje(data.message);
    cargarJornadas();
    formJornada.reset();
  } catch (err) {
    mostrarMensaje("Error al crear la jornada", "error");
  }
});

// ==============================
// 🔹 Cargar jornadas existentes
// ==============================
async function cargarJornadas() {
  const res = await fetch(`${API_URL}/api/jornadas`);
  const jornadas = await res.json();

  selectJornada.innerHTML = "";
  jornadas.forEach((j) => {
    const option = document.createElement("option");
    option.value = j.id;
    option.textContent = `${j.nombre} (${j.activa ? "Activa" : "Inactiva"})`;
    selectJornada.appendChild(option);
  });
}
cargarJornadas();

// ==============================
// 🔹 Activar jornada
// ==============================
activarJornadaBtn.addEventListener("click", async () => {
  const id = selectJornada.value;
  if (!id) return mostrarMensaje("Selecciona una jornada", "error");

  await fetch(`${API_URL}/api/activar/${id}`, { method: "POST" });
  mostrarMensaje("Jornada activada correctamente");
  cargarJornadas();
});

// ==============================
// 🔹 Generar códigos
// ==============================
generarCodigosBtn.addEventListener("click", async () => {
  const cantidad = parseInt(cantidadCodigos.value);
  if (!cantidad || cantidad <= 0)
    return mostrarMensaje("Cantidad inválida", "error");

  const res = await fetch(`${API_URL}/api/codigos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cantidad }),
  });

  const data = await res.json();
  mostrarMensaje(data.message);
  mostrarCodigos();
});

// ==============================
// 🔹 Mostrar códigos
// ==============================
async function mostrarCodigos() {
  const res = await fetch(`${API_URL}/api/codigos`);
  const codigos = await res.json();
  listaCodigos.innerHTML =
    "<h3>Códigos Generados:</h3>" +
    codigos.map((c) => `<div>${c.codigo} ${c.usado ? "(Usado)" : ""}</div>`).join("");
}
mostrarCodigos();
