// ==============================
// 🌐 Configuración base
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
// 🔹 Mostrar mensajes en pantalla
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
    local: p.querySelector(".local").value.trim(),
    visitante: p.querySelector(".visitante").value.trim(),
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
    console.error("❌ Error al crear jornada:", err);
    mostrarMensaje("Error al conectar con el servidor", "error");
  }
});

// ==============================
// 🔹 Cargar jornadas existentes
// ==============================
async function cargarJornadas() {
  try {
    const res = await fetch(`${API_URL}/api/jornadas`);
    if (!res.ok) throw new Error("No se pudieron cargar las jornadas");
    const jornadas = await res.json();

    selectJornada.innerHTML = "";
    if (jornadas.length === 0) {
      const opt = document.createElement("option");
      opt.textContent = "No hay jornadas disponibles";
      selectJornada.appendChild(opt);
      return;
    }

    jornadas.forEach((j) => {
      const option = document.createElement("option");
      option.value = j.id;
      option.textContent = `${j.nombre} (${j.activa ? "Activa" : "Inactiva"})`;
      selectJornada.appendChild(option);
    });
  } catch (error) {
    console.error(error);
    mostrarMensaje("Error al cargar jornadas", "error");
  }
}

cargarJornadas();

// ==============================
// 🔹 Activar jornada seleccionada
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
    const res = await fetch(`${API_URL}/api/codigos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cantidad }),
    });

    const data = await res.json();
    if (res.ok) {
      mostrarMensaje("🎟️ Códigos generados correctamente");
      mostrarCodigos();
    } else {
      mostrarMensaje(data.message || "Error al generar códigos", "error");
    }
  } catch (err) {
    console.error("❌ Error al generar códigos:", err);
    mostrarMensaje("Error al conectar con el servidor", "error");
  }
});

// ==============================
// 🔹 Mostrar lista de códigos
// ==============================
async function mostrarCodigos() {
  try {
    const res = await fetch(`${API_URL}/api/codigos`);
    if (!res.ok) throw new Error("Error al cargar los códigos");
    const codigos = await res.json();

    listaCodigos.innerHTML =
      "<h3>Códigos Generados:</h3>" +
      codigos
        .map(
          (c) =>
            `<div>${c.codigo} ${c.usado ? "<span>(Usado)</span>" : "<span>(Disponible)</span>"}</div>`
        )
        .join("");
  } catch (err) {
    console.error("❌ Error al mostrar códigos:", err);
    mostrarMensaje("Error al cargar los códigos", "error");
  }
}

mostrarCodigos();
