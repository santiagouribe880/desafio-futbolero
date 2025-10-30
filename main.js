/* =====================================================
   Desafío Futbolero - Lógica Principal (versión 2.0)
   =====================================================
   ✅ Lee la jornada activa guardada por el administrador
   ✅ Permite ingresar un código único y registrar pronósticos
   ✅ Envía datos a Google Sheets
   ✅ Inhabilita el código tras enviar
===================================================== */

(() => {
  // --- Configuración ---
  const SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfycbwvCgDNc9zRmaREnv1L6uZKZH8Y2nvX3cvQSL-ihc1DdOWN_Iu3mjX7CjxfuhUJx-AV/exec";

  // --- Elementos del DOM ---
  const codeInput = document.getElementById('codeInput');
  const validateBtn = document.getElementById('validateBtn');
  const jornadaCard = document.getElementById('jornadaCard');
  const matchesContainer = document.getElementById('matchesContainer');
  const pronForm = document.getElementById('pronForm');
  const accessMsg = document.getElementById('accessMsg');
  const acumuladoDiv = document.getElementById('acumuladoDiv');
  const countdown = document.getElementById('countdown');
  
  // --- Variables de control ---
  let jornadaActiva = [];
  let userCode = null;

  // --- Cargar jornada activa desde localStorage ---
  function cargarJornada() {
    const jornadaData = localStorage.getItem("jornadaActiva");
    if (!jornadaData) {
      accessMsg.textContent = "⚠️ No hay jornada activa por el momento.";
      accessMsg.style.color = "orange";
      validateBtn.disabled = true;
      return false;
    }
    jornadaActiva = JSON.parse(jornadaData);
    return true;
  }

  // --- Validar código ingresado ---
  validateBtn.addEventListener("click", () => {
    userCode = codeInput.value.trim();

    if (!userCode) {
      accessMsg.textContent = "Por favor ingresa tu código.";
      accessMsg.style.color = "red";
      return;
    }

    const valido = jornadaActiva.some(j => j.codigo === userCode);

    if (!valido) {
      accessMsg.textContent = "Código inválido o no registrado.";
      accessMsg.style.color = "red";
      return;
    }

    // Verificar si ya usó el código
    if (localStorage.getItem(`codigo_${userCode}_usado`)) {
      accessMsg.textContent = "Este código ya fue utilizado.";
      accessMsg.style.color = "red";
      return;
    }

    mostrarFormulario();
  });

  // --- Mostrar formulario con partidos dinámicos ---
  function mostrarFormulario() {
    jornadaCard.style.display = "block";
    matchesContainer.innerHTML = "";

    jornadaActiva.forEach((partido, index) => {
      const matchDiv = document.createElement("div");
      matchDiv.classList.add("ma

