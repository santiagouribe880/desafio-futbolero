// main.js

// Cargar jornada activa desde el servidor
async function cargarJornadaActiva() {
  try {
    const res = await fetch("/api/jornada-activa");
    const jornada = await res.json();

    const nombreJornada = document.getElementById("nombreJornada");
    const premioJornada = document.getElementById("premioJornada");
    const contenedor = document.getElementById("contenedorPartidos");

    if (!jornada) {
      nombreJornada.textContent = "No hay jornada activa actualmente ⚠️";
      premioJornada.textContent = "-";
      contenedor.innerHTML = "<p>Vuelve pronto para participar en la próxima jornada.</p>";
      return;
    }

    nombreJornada.textContent = jornada.nombre;
    premioJornada.textContent = jornada.premio;

    const html = jornada.partidos
      .map(
        (p) => `
        <div class="partido">
          <div class="equipos">
            <span class="equipo local">${p.local}</span>
            <span class="vs">vs</span>
            <span class="equipo visitante">${p.visitante}</span>
          </div>
          <div class="detalles">
            <span class="fecha">${new Date(p.fecha).toLocaleString()}</span>
            <input type="text" class="pronostico" placeholder="Tu pronóstico (ej: 2-1)" />
          </div>
        </div>
      `
      )
      .join("");

    contenedor.innerHTML = html;
  } catch (error) {
    document.getElementById("contenedorPartidos").innerHTML =
      "<p>Error al cargar la jornada. Intenta más tarde.</p>";
    console.error("Error al cargar jornada activa:", error);
  }
}

// Inicializar
cargarJornadaActiva();
