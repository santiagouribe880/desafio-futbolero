// --- Desafío Futbolero Básico ---
// admin: clave = "admin2025"

document.addEventListener("DOMContentLoaded", () => {
  const adminSection = document.getElementById("adminSection");
  const codeInput = document.getElementById("codeInput");
  const validateBtn = document.getElementById("validateBtn");
  const accessMsg = document.getElementById("accessMsg");
  const csvInput = document.getElementById("csvInput");
  const loadCSVBtn = document.getElementById("loadCSVBtn");
  const adminMsg = document.getElementById("adminMsg");
  const jornadaCard = document.getElementById("jornadaCard");
  const pronForm = document.getElementById("pronForm");
  const sendBtn = document.getElementById("sendBtn");
  const acumuladoInput = document.getElementById("acumuladoInput");
  const acumuladoDisplay = document.getElementById("acumuladoDisplay");

  let partidos = [];
  let acumulado = 0;

  validateBtn.addEventListener("click", () => {
    const code = codeInput.value.trim();

    if (code === "admin2025") {
      adminSection.classList.remove("hidden");
      accessMsg.textContent = "Bienvenido administrador ⚙️";
      return;
    }

    if (partidos.length === 0) {
      accessMsg.textContent = "No hay jornada activa por ahora ⚠️";
      return;
    }

    jornadaCard.classList.remove("hidden");
    acumuladoDisplay.textContent = `🏆 Acumulado: $${acumulado}`;
    pronForm.innerHTML = "";
    partidos.forEach((p, i) => {
      const [local, visitante] = p;
      pronForm.innerHTML += `
        <div>
          <label>${local} vs ${visitante}</label><br>
          <input type="number" placeholder="Goles ${local}" />
          <input type="number" placeholder="Goles ${visitante}" /><br>
        </div>
      `;
    });
    sendBtn.classList.remove("hidden");
  });

  loadCSVBtn.addEventListener("click", () => {
    const file = csvInput.files[0];
    if (!file) {
      adminMsg.textContent = "Por favor selecciona un archivo CSV.";
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      const lines = e.target.result.split("\n").map(l => l.split(","));
      partidos = lines;
      acumulado = acumuladoInput.value || 0;
      adminMsg.textContent = `✅ Jornada cargada con ${partidos.length} partidos.`;
    };
    reader.readAsText(file);
  });
});
