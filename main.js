// === CONFIGURACIÓN ===
const baseURL = "https://raw.githubusercontent.com/santiagouribe880/desafio-futbolero/main/data/jornada.csv";

// === FUNCIÓN PRINCIPAL ===
async function cargarJornadaActiva() {
  try {
    // Agregamos un número aleatorio para evitar cache de GitHub
    const urlCSV = `${baseURL}?v=${Date.now()}`;
    const response = await fetch(urlCSV, { cache: "no-store" });
    if (!response.ok) throw new Error("No se pudo acceder a jornada.csv");

    const csvText = await response.text();
    const filas = csvText.trim().split("\n");
    const encabezados = filas.shift().split(",");

    const jornadas = filas.map(fila => {
      const columnas = fila.split(",");
      return encabezados.reduce((obj, key, i) => {
        obj[key.trim()] = columnas[i] ? columnas[i].trim() : "";
        return obj;
      }, {});
    });

    // Filtrar jornadas activas
    const jornadasActivas = jornadas.filter(j => j.activa?.toLowerCase() === "true");

    if (jornadasActivas.length === 0) {
      mostrarMensaje("⚽ No hay jornada activa actualmente. ¡Vuelve más tarde!");
      return;
    }

    // Tomar la jornada activa más reciente
    const jornadaActual = jornadasActivas[jornadasActivas.length - 1];
    mostrarPartidos(jornadaActual);

  } catch (error) {
    console.error("Error al cargar la jornada:", error);
    mostrarMensaje("⚠️ Error al cargar la jornada. Intenta nuevamente más tarde.");
  }
}

// === FUNCIONES AUXILIARES ===
function mostrarPartidos(jornada) {
  const contenedor = document.getElementById("partidos-container");
  contenedor.innerHTML = "";

  const nombreJornada = jornada.nombre || "Jornada activa";
  const titulo = document.createElement("h3");
  titulo.textContent = nombreJornada;
  contenedor.appendChild(titulo);

  // Supongamos que tus partidos están en columnas partido1, partido2, etc.
  Object.keys(jornada)
    .filter(k => k.startsWith("partido") && jornada[k])
    .forEach((clave, i) => {
      const div = document.createElement("div");
      div.classList.add("partido");
      div.textContent = `${jornada[clave]}`;
      contenedor.appendChild(div);
    });
}

function mostrarMensaje(msg) {
  const contenedor = document.getElementById("partidos-container");
  contenedor.innerHTML = `<p>${msg}</p>`;
}

// === EJECUTAR CUANDO EL PARTICIPANTE ENTRA ===
document.addEventListener("DOMContentLoaded", cargarJornadaActiva);
