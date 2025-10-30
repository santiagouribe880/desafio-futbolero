// --- CONFIGURACIÓN --- //
const ADMIN_PASSWORD = "futbol2025"; // Clave del administrador

// Elementos
const loginBox = document.getElementById("loginBox");
const loginBtn = document.getElementById("loginBtn");
const adminKey = document.getElementById("adminKey");
const loginMsg = document.getElementById("loginMsg");

const adminPanel = document.getElementById("adminPanel");
const uploadCsvBtn = document.getElementById("uploadCsvBtn");
const csvFileInput = document.getElementById("csvFile");
const saveAcumuladoBtn = document.getElementById("saveAcumuladoBtn");
const acumuladoInput = document.getElementById("acumuladoInput");
const activarJornadaBtn = document.getElementById("activarJornadaBtn");
const adminMsg = document.getElementById("adminMsg");

// --- LOGIN ADMIN --- //
loginBtn.addEventListener("click", () => {
  const key = adminKey.value.trim();
  if (key === ADMIN_PASSWORD) {
    loginBox.style.display = "none";
    adminPanel.style.display = "block";
    loginMsg.textContent = "";
  } else {
    loginMsg.textContent = "❌ Contraseña incorrecta.";
  }
});

// --- SUBIR ARCHIVO CSV --- //
uploadCsvBtn.addEventListener("click", () => {
  const file = csvFileInput.files[0];
  if (!file) {
    alert("Por favor selecciona un archivo CSV primero.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const csvContent = e.target.result;
    localStorage.setItem("jornadaCSV", csvContent);
    adminMsg.textContent = "✅ Archivo CSV cargado correctamente.";
  };
  reader.readAsText(file);
});

// --- GUARDAR ACUMULADO --- //
saveAcumuladoBtn.addEventListener("click", () => {
  const acumulado = acumuladoInput.value;
  if (!acumulado || acumulado <= 0) {
    alert("Por favor ingresa un valor válido para el acumulado.");
    return;
  }
  localStorage.setItem("acumuladoJornada", acumulado);
  adminMsg.textContent = `💰 Acumulado guardado: $${acumulado}`;
});

// --- ACTIVAR JORNADA --- //
activarJornadaBtn.addEventListener("click", () => {
  const jornadaData = localStorage.getItem("jornadaCSV");
  if (!jornadaData) {
    alert("Primero carga un archivo CSV para activar la jornada.");
    return;
  }

  localStorage.setItem("jornadaActiva", "true");
  adminMsg.textContent = "⚽ Jornada activada con éxito.";
});
