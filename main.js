(() => {
  const URL_CODIGOS = "https://raw.githubusercontent.com/santiagouribe880/desafio-futbolero/main/data/codigos.csv";
  const URL_PARTIDOS = "https://raw.githubusercontent.com/santiagouribe880/desafio-futbolero/main/data/jornada.csv";

  const codigoInput = document.getElementById("codigoInput");
  const validarCodigoBtn = document.getElementById("validarCodigoBtn");
  const codigoMsg = document.getElementById("codigoMsg");
  const zonaPronosticos = document.getElementById("zonaPronosticos");
  const infoJornada = document.getElementById("infoJornada");
  const partidosContainer = document.getElementById("partidos");
  const enviarPronosticosBtn = document.getElementById("enviarPronosticosBtn");

  let participanteCodigo = "";
  let codigosValidos = [];
  let partidos = [];

  // 🔹 Cargar lista de códigos válidos
  async function cargarCodigos() {
    try {
      const res = await fetch(URL_CODIGOS + "?t=" + Date.now());
      const texto = await res.text();
      const lineas = texto.trim().split("\n").slice(1);
      codigosValidos = lineas.map(l => l.split(",")[0].trim());
    } catch (err) {
      console.error("Error cargando códigos:", err);
    }
  }

  // 🔹 Validar código
  validarCodigoBtn.addEventListener("click", async () => {
    if (codigosValidos.length === 0) await cargarCodigos();
    const codigo = (codigoInput.value || "").trim();
    if (!codigo) {
      codigoMsg.textContent = "❌ Ingresa tu código.";
      return;
    }

    if (!codigosValidos.includes(codigo)) {
      codigoMsg.textContent = "🚫 Código no válido. Verifica con el administrador.";
      return;
    }

    participanteCodigo = codigo;
    document.getElementById("ingresoCodigo").style.display = "none";
    zonaPronosticos.style.display = "block";
    cargarJornada();
  });

  // 🔹 Cargar jornada activa
  function cargarJornada() {
    const acumulado = localStorage.getItem("acumuladoJornada") || "No definido";
    const horaLimite = localStorage.getItem("horaLimiteJornada");
    const jornadaActiva = localStorage.getItem("jornadaActiva") === "true";

    if (!jornadaActiva) {
      infoJornada.innerHTML = "<p>🚫 No hay jornada activa actualmente.</p>";
      enviarPronosticosBtn.style.display = "none";
      return;
    }

    let horaTexto = horaLimite
      ? new Date(horaLimite).toLocaleString("es-CO")
      : "Sin hora límite";

    infoJornada.innerHTML = `
      <p><strong>💰 Premio acumulado:</strong> ${acumulado}</p>
      <p><strong>🕒 Hora límite:</strong> ${horaTexto}</p>
    `;

    cargarPartidos();
  }

  // 🔹 Cargar partidos desde GitHub CSV
  async function cargarPartidos() {
    try {
      const res = await fetch(URL_PARTIDOS + "?t=" + Date.now());
      const texto = await res.text();
      const lineas = texto.trim().split("\n").slice(1);
      partidos = lineas.map(l => {
        const [id, local, visitante, fecha] = l.split(",");
        return { id, local, visitante, fecha };
      });
      mostrarPartidos();
    } catch (err) {
      console.error(err);
      partidosContainer.innerHTML = "<p>⚠️ No se pudieron cargar los partidos.</p>";
    }
  }

  // 🔹 Mostrar partidos
  function mostrarPartidos() {
    partidosContainer.innerHTML = "";
    partidos.forEach((p) => {
      const div = document.createElement("div");
      div.classList.add("partido");
      div.innerHTML = `
        <span>${p.local} vs ${p.visitante}</span>
        <div>
          <input type="number" min="0" id="golesLocal-${p.id}" placeholder="0">
          <input type="number" min="0" id="golesVisita-${p.id}" placeholder="0">
        </div>
      `;
      partidosContainer.appendChild(div);
    });
  }

  // 🔹 Guardar pronósticos
  enviarPronosticosBtn.addEventListener("click", () => {
    const pronosticos = partidos.map(p => ({
      id: p.id,
      local: p.local,
      visitante: p.visitante,
      golesLocal: document.getElementById(`golesLocal-${p.id}`).value,
      golesVisita: document.getElementById(`golesVisita-${p.id}`).value
    }));

    localStorage.setItem(`pronosticos_${participanteCodigo}`, JSON.stringify(pronosticos));
    alert("✅ Tus pronósticos se han guardado correctamente.");
  });
})();
