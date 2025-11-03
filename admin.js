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
// 🔹 Mostrar mensaje
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

  const nombre = document.getElementById("nombre").value.trim();
  const premio = document.getElementById("premio").value.trim();

  const partidos = Array.from(document.querySelectorAll(".partido")).map((p) => ({
    local: p.querySelector(".local").value,
    visitante: p.querySelector(".visitante").value,
    fecha: p.querySelector(".fechaPartido").value,
  }));

  if (!nombre || !premio || partidos.length === 0) {
    return mostrarMensaje("Completa todos los campos y agrega al menos un partido", "error");
  }

  try {
    const res = await fetch(`${API_URL}/api/jornada`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, premio, partidos }),
    });

    const data = await res.json();
    if (res.ok) {
      mostrarMensaje("✅ Jornada creada correctamente");
      formJornada.reset();
      cargarJornadas();
    } else {
      mostrarMensaje(data.message || "Error al crear la jornada", "error");
    }
  } catch (err) {
    mostrarMensaje("Error al conectar con el servidor", "error");
  }
});

// ==============================
// 🔹 Cargar jornadas
// ==============================
async function cargarJornadas() {
  try {
    const res = await fetch(`${API_URL}/api/jornadas`);
    const jornadas = await res.json();

    selectJornada.innerHTML = "";
    jornadas.forEach((j) => {
      const option = document.createElement("option");
      option.value = j.id;
      option.textContent = `${j.nombre} (${j.activa ? "Activa" : "Inactiva"})`;
      selectJornada.appendChild(option);
    });
  } catch (error) {
    mostrarMensaje("Error al cargar jornadas", "error");
  }
}
cargarJornadas();

// ==============================
// 🔹 Activar jornada
// ==============================
activarJornadaBtn.addEventListener("click", async () => {
  const id = selectJornada.value;
  if (!id) return mostrarMensaje("Selecciona una jornada", "error");

  try {
    const res = await fetch(`${API_URL}/api/activar/${id}`, { method: "POST" });
    const data = await res.json();

    if (res.ok) {
      mostrarMensaje("✅ Jornada activada correctamente");
      cargarJornadas();
    } else {
      mostrarMensaje(data.message || "Error al activar jornada", "error");
    }
  } catch {
    mostrarMensaje("Error al conectar con el servidor", "error");
  }
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
  mostrarMensaje(data.message || "Códigos generados correctamente");
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
