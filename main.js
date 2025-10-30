/*
  main.js - Desafío Futbolero
  Muestra formulario de pronósticos dinámicamente según la jornada activa.
*/

// Elementos
const codeInput = document.getElementById("codeInput");
const validateBtn = document.getElementById("validateBtn");
const jornadaCard = document.getElementById("jornadaCard");
const pronForm = document.getElementById("pronForm");
const matchesContainer = document.getElementById("matchesContainer");
const accessMsg = document.getElementById("accessMsg");

// Validación de código
validateBtn.addEventListener("click", () => {
  const code = codeInput.value.trim();
  if (code === "") {
    accessMsg.textContent = "❌ Ingresa un código válido.";
    return;
  }

  // Validar que haya jornada activa
  const jornadaActiva = localStorage.getItem("jornadaActiva");
  if (!jornadaActiva) {
    accessMsg.textContent = "⚠️ No hay una jornada activa actualmente.";
    return;
  }

  accessMsg.textContent = "✅ Código aceptado. Cargando jornada...";
  setTimeout(() => {
    mostrarJornada(code);
  }, 800);
});

// Mostrar jornada
function mostrarJornada(code) {
  document.querySelector(".login-box").style.display = "none";
  jornadaCard.style.display = "block";

  const csvData = localStorage.getItem("jornadaCSV");
  const acumulado = localStorage.getItem("acumuladoJornada") || "No definido";

  if (!csvData) {
    matchesContainer.innerHTML = "<p>No hay datos de jornada cargados.</p>";
    return;
  }

  // Convertir CSV a lista de partidos
  const lines = csvData.split("\n").filter((l) => l.trim() !== "");
  const partidos = lines.slice(1).map((line) => {
    const [id, equipo1, equipo2] = line.split(",");
    return { id, equipo1, equipo2 };
  });

  // Mostrar acumulado
  document.getElementById("acumuladoText").textContent = `💰 Premio: $${acumulado}`;

  // Crear inputs para cada partido
  matchesContainer.innerHTML = "";
  partidos.forEach((p, index) => {
    const div = document.createElement("div");
    div.classList.add("match-row");
    div.innerHTML = `
      <p><b>${p.equipo1}</b> vs <b>${p.equipo2}</b></p>
      <input type="number" id="eq1_${index}" placeholder="Goles ${p.equipo1}" min="0">
      <input type="number" id="eq2_${index}" placeholder="Goles ${p.equipo2}" min="0">
    `;
    matchesContainer.appendChild(div);
  });

  // Guardar código del jugador
  document.getElementById("playerCodeHidden").value = code;
}

// Enviar pronóstico (solo demostrativo)
pronForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const code = document.getElementById("playerCodeHidden").value;
  localStorage.removeItem("jornadaActiva"); // Desactiva el código una vez enviado

  alert(`✅ Pronóstico del código ${code} enviado correctamente.`);
  window.location.href = "/";
});
