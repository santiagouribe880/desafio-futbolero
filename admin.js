(() => {
  const ADMIN_PASSWORD = "futbol2025";

  // elementos
  const loginBox = document.getElementById("loginBox");
  const loginBtn = document.getElementById("loginBtn");
  const adminKey = document.getElementById("adminKey");
  const loginMsg = document.getElementById("loginMsg");
  const adminPanel = document.getElementById("adminPanel");
  const acumuladoInput = document.getElementById("acumuladoInput");
  const horaLimiteInput = document.getElementById("horaLimiteInput");
  const saveAcumuladoBtn = document.getElementById("saveAcumuladoBtn");
  const activarJornadaBtn = document.getElementById("activarJornadaBtn");
  const adminMsg = document.getElementById("adminMsg");

  // Login simple
  loginBtn.addEventListener("click", () => {
    if ((adminKey.value || "").trim() === ADMIN_PASSWORD) {
      loginBox.style.display = "none";
      adminPanel.style.display = "block";
      loginMsg.textContent = "";
    } else {
      loginMsg.textContent = "❌ Contraseña incorrecta";
    }
  });

  // Guardar acumulado y hora límite
  saveAcumuladoBtn.addEventListener("click", () => {
    const premio = (acumuladoInput.value || "").trim();
    const hora = horaLimiteInput.value;
    if (!premio || !hora) {
      alert("Completa el monto y la hora límite.");
      return;
    }

    localStorage.setItem("acumuladoJornada", premio);
    localStorage.setItem("horaLimiteJornada", hora);
    adminMsg.textContent = `💰 Acumulado: ${premio} - 🕒 Límite: ${new Date(hora).toLocaleString("es-CO")}`;
  });

  // Activar jornada
  activarJornadaBtn.addEventListener("click", () => {
    localStorage.setItem("jornadaActiva", "true");
    adminMsg.textContent = "⚽ Jornada activada con éxito.";
  });
})();
