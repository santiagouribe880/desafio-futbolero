// ==============================
// ⚽ DESAFÍO FUTBOLERO - PANEL ADMIN
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

  const nombre = document.getElementById("nombre").value.trim();
  const premio = document.getElementById("premio").value.trim();

  const partidos = Array.from(document.querySelectorAll(".partido"))
    .map((p) => ({
      local: p.querySelector(".local").value,
      visitante: p.querySelector(".visitante").value,
      fecha: p.querySelector(".fechaPartido").value || null,
    }))
    .filter((p) => p.local && p.visitante);

  try {
    const res = await fetch(`${API_URL}/api/jornada`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, premio, partidos }),
    });

    const data = await res.json();

    if (res.ok) {
      mostrarMensaje(data.message, "exito");
      formJornada.reset();
      partidosContainer.innerHTML = "";
      cargarJornadas();
    } else {
      mostrarMensaje(data.message || "Error al crear la jornada", "error");
    }
  } catch (err) {
    mostrarMensaje("Error al conectar con el servidor", "error");
    console.error(err);
  }
});

// ==============================
// 🔹 Cargar jornadas existentes
// ==============================
async function cargarJornadas() {
  try {
    const res = await fetch(`${API_URL}/api/jornadas`);
    const jornadas = await res.json();

    selectJornada.innerHTML = "<option value=''>Seleccione una jornada</option>";
    jornadas.forEach((j) => {
      const option = document.createElement("option");
      option.value = j.id;
      option.textContent = `${j.nombre} ${j.activa ? "✅ (Activa)" : ""}`;
      selectJornada.appendChild(option);
    });
  } catch (err) {
    console.error(err);
    mostrarMensaje("No se pudieron cargar las jornadas", "error");
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

    if (!res.ok) return mostrarMensaje(data.message || "Error al activar jornada", "error");

    mostrarMensaje("Jornada activada correctamente ✅");
    await cargarJornadas();
  } catch (err) {
    console.error(err);
    mostrarMensaje("Error al activar la jornada", "error");
  }
});

// ==============================
// 🔹 Generar códigos
// ==============================
generarCodigosBtn.addEventListener("click", async () => {
  const cantidad = parseInt(cantidadCodigos.value);
  if (!cantidad || cantidad <= 0)
    return mostrarMensaje("Cantidad inválida", "error");

  try {
    const res = await fetch(`${API_URL}/api/codigos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cantidad }),
    });

    const data = await res.json();
    if (!res.ok) return mostrarMensaje(data.message || "Error al generar códigos", "error");

    mostrarMensaje(data.message);
    mostrarCodigos();
  } catch (err) {
    console.error(err);
    mostrarMensaje("Error al generar los códigos", "error");
  }
});

// ==============================
// 🔹 Mostrar códigos generados
// ==============================
async function mostrarCodigos() {
  try {
    const res = await fetch(`${API_URL}/api/codigos`);
    const codigos = await res.json();
    listaCodigos.innerHTML =
      "<h3>Códigos Generados:</h3>" +
      codigos
        .map((c) => `<div>${c.codigo} ${c.usado ? "(Usado)" : ""}</div>`)
        .join("");
  } catch (err) {
    console.error(err);
    mostrarMensaje("Error al mostrar códigos", "error");
  }
}
mostrarCodigos();
