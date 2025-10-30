/*
  main.js - Desafío Futbolero
  Lee CSV con columnas: codigo, partido, equipo_local, equipo_visitante
  Genera formulario de pronósticos y permite enviar resultados.
*/

// Elementos
const codeInput = document.getElementById("codeInput");
const validateBtn = document.getElementById("validateBtn");
const jornadaCard = document.getElementById("jornadaCard");
const pronForm = document.getElementById("pronForm");
const matchesContainer = document.getElementById("matchesContainer");
const accessMsg = document.getElementById("accessMsg");

// Validar código
validateBtn.addEventListener("click", () => {
  const code = codeInput.value.trim().toUpperCase();
  if (code === "") {
    accessMsg.textContent = "❌ Ingresa un código válido.";
    return;
  }

  const jornadaActiva = localStorage.getItem("jornadaActiva");
  const csvData = localStorage.getItem("jornadaCSV");

  if (!jornadaActiva || !csvData) {
    accessMsg.textContent = "⚠️ No hay una jornada activa actualmente.";
    return;
  }

  // Convertir CSV a lista de partidos
  const lines = csvData.split("\n").filter((l) => l.trim() !== "");
  const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
  const data = lines.slice(1).map(line => {
    const values = line.split(",");
    const obj = {};
    headers.forEach((h, i) => (obj[h] = values[i]?.trim()));
    return obj;
  });

  // Buscar si el código existe en la primera columna
  const participante = data.find(d => d.codigo?.toUpperCase() === code);
  if (!participante) {
    accessMsg.textContent = "🚫 Código no encontrado. Verifica con el administrador.";
    return;
  }

  accessMsg.textContent = "✅ Código válido. Cargando jornada...";
  setTimeout(() => mostrarJornada(code, data), 800);
});

// Mostrar jornada
function mostrarJornada(code, data) {
  document.querySelector(".login-box").style.display = "none";
  jornadaCard.style.display = "block";

  const acumulado = localStorage.getItem("acumuladoJornada") || "No definido";
  document.getElementById("acumuladoText").textContent = `💰 Premio: $${acumulado}`;

  // Crear inputs de pronóstico
  matchesContainer.innerHTML = "";
  data.forEach((p, index) => {
    const div = document.createElement("div");
    div.classList.add("match-row");
    div.innerHTML = `
      <p><b>${p.equipo_local}</b> vs <b>${p.equipo_visitante}</b></p>
      <input type="number" id="eq1_${index}" placeholder="Goles ${p.equipo_local}" min="0">
      <input type="number" id="eq2_${index_

