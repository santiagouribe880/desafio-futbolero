// URL al CSV con las jornadas
const urlJornadas = "https://raw.githubusercontent.com/santiagouribe880/desafio-futbolero/main/data/jornadas.csv";

// Variable para definir la jornada activa (se puede automatizar luego desde admin)
let jornadaActiva = 1;

// Obtener código del participante desde la URL
const params = new URLSearchParams(window.location.search);
const codigo = params.get("codigo");

// Mostrar saludo con el código del participante
document.addEventListener("DOMContentLoaded", () => {
  const saludo = document.getElementById("saludoParticipante");
  if (saludo && codigo) {
    saludo.textContent = `Bienvenido al Desafío Futbolero, código: ${codigo}`;
  }
  cargarPartidos();
});

// Cargar los partidos desde GitHub
async function cargarPartidos() {
  try {
    const response = await fetch(urlJornadas);
    const data = await response.text();

    const lineas = data.trim().split("\n");
    const encabezados = lineas[0].split(",");
    const partidos = lineas.slice(1).map(linea => {
      const valores = linea.split(",");
      let obj = {};
      encabezados.forEach((h, i) => obj[h.trim()] = valores[i]?.trim());
      return obj;
    });

    // Filtrar solo la jornada activa
    const partidosFiltrados = partidos.filter(p => p.jornada == jornadaActiva);

    // Mostrar partidos sin modificar el diseño actual
    const contenedor = document.getElementById("partidosContainer");
    contenedor.innerHTML = "";

    if (partidosFiltrados.length === 0) {
      contenedor.innerHTML = "<p>No hay partidos disponibles para la jornada actual.</p>";
      return;
    }

    partidosFiltrados.forEach(p => {
      contenedor.innerHTML += `
        <div class="partido">
          <span>${p.equipo_local}</span> vs <span>${p.equipo_visitante}</span>
        </div>
      `;
    });
  } catch (error) {
    console.error("Error cargando partidos:", error);
    const contenedor = document.getElementById("partidosContainer");
    contenedor.innerHTML = "<p>Error cargando los partidos. Intenta más tarde.</p>";
  }
}
