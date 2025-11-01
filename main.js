async function cargarJornadaActiva() {
  const csvUrl = "https://raw.githubusercontent.com/santiagouribe880/desafio-futbolero/main/data/jornada.csv";
  const resp = await fetch(csvUrl);
  const csvText = await resp.text();

  const lineas = csvText.split("\n").slice(1);
  const activos = lineas.filter(l => l.includes("true"));
  
  const contenedor = document.getElementById("jornada");
  contenedor.innerHTML = "";

  if (activos.length === 0) {
    contenedor.innerHTML = "<p>No hay jornada activa en este momento ⚽</p>";
    return;
  }

  activos.forEach(linea => {
    const [jornada, partido, local, visitante, fecha] = linea.split(",");
    const card = document.createElement("div");
    card.classList.add("partido");
    card.innerHTML = `
      <h4>${partido}</h4>
      <p><strong>${local}</strong> vs <strong>${visitante}</strong></p>
      <p>📅 ${fecha}</p>
    `;
    contenedor.appendChild(card);
  });
}

document.getElementById("ver-jornada").addEventListener("click", async () => {
  const codigo = document.getElementById("codigo").value.trim();
  if (!codigo) {
    alert("Por favor ingresa tu código de participante.");
    return;
  }

  await cargarJornadaActiva();
});
