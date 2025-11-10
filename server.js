// ==============================
// 🌐 Configuración de API
// ==============================
// Detectar si estamos en Render o en local
const API_URL = window.location.origin.includes("render.com")
  ? "https://desafio-futbolero2-0.onrender.com/api"
  : "http://localhost:3000/api";

// ==============================
// 🔹 Elementos del DOM
// ==============================
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
// 🔹 Agregar partido
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
    return mostrarMensaje("Completa todos los campos y agrega al menos un partido", "error");
  }

  try {
    const res = await fetch(`${API_URL}/jornada`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, premio, partidos }),
    });

    if (!res.ok) throw new Error("Fallo en la conexión con el servidor");

    const data = await res.json();
    mostrarMensaje("✅ Jornada creada correctamente");
    formJornada.reset();
    partidosContainer.innerHTML = ""; // limpia partidos creados
    cargarJornadas();
  } catch (err) {
    console.error("❌ Error:", err);
    mostrarMensaje("Error al conectar con el servidor", "error");
  }
});

// ==============================
// 🔹 Cargar jornadas existentes
// ==============================
async function cargarJornadas() {
  try {
    const res = await fetch(`${API_URL}/jornadas`);
    if (!res.ok) throw new Error("Error al obtener jornadas");

    const jornadas = await res.json();
    selectJornada.innerHTML = "";

    if (jornadas.length === 0) {
      const option = document.createElement("option");
      option.textContent = "No hay jornadas registradas";
      selectJornada.appendChild(option);
      return;
    }

    jornadas.forEach((j) => {
      const option = document.createElement("option");
      option.value = j.id;
      option.textContent = `${j.nombre} (${j.activa ? "Activa" : "Inactiva"})`;
      selectJornada.appendChild(option);
    });
  } catch (err) {
    console.error("❌ Error cargando jornadas:", err);
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
    const res = await fetch(`${API_URL}/activar/${id}`, { method: "POST" });
    if (!res.ok) throw new Error("Error al activar jornada");

    const data = await res.json();
    mostrarMensaje("✅ Jornada activada correctamente");
    cargarJornadas();
  } catch (err) {
    console.error("❌ Error al activar jornada:", err);
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

  try {
    const res = await fetch(`${API_URL}/codigos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cantidad }),
    });

    if (!res.ok) throw new Error("Error generando códigos");

    const data = await res.json();
    mostrarMensaje(data.message || "Códigos generados correctamente");
    mostrarCodigos();
  } catch (err) {
    console.error("❌ Error generando códigos:", err);
    mostrarMensaje("Error al conectar con el servidor", "error");
  }
});

// ==============================
// 🔹 Mostrar códigos
// ==============================
async function mostrarCodigos() {
  try {
    const res = await fetch(`${API_URL}/codigos`);
    if (!res.ok) throw new Error("Error obteniendo códigos");

    const codigos = await res.json();
    listaCodigos.innerHTML =
      "<h3>Códigos Generados:</h3>" +
      codigos.map((c) => `<div>${c.codigo} ${c.usado ? "(Usado)" : ""}</div>`).join("");
  } catch (err) {
    console.error("❌ Error mostrando códigos:", err);
    mostrarMensaje("Error al mostrar códigos", "error");
  }
}
mostrarCodigos();
