// URLs de los archivos CSV en GitHub (todo en minúscula)
const JORNADA_CSV_URL = "https://raw.githubusercontent.com/santiagouribe880/desafio-futbolero/main/jornada.csv";
const CODIGOS_CSV_URL = "https://raw.githubusercontent.com/santiagouribe880/desafio-futbolero/main/codigos.csv";

// Variables globales
let jornadaActiva = false;
let partidos = [];
let codigosValidos = [];
let premioJornada = 0;
let horaLimite = null;

// Función para cargar CSV desde GitHub
async function cargarCSV(url) {
    const response = await fetch(url);
    const data = await response.text();
    const filas = data.trim().split("\n").map(linea => linea.split(","));
    const encabezados = filas[0].map(h => h.trim());
    return filas.slice(1).map(fila => {
        let obj = {};
        encabezados.forEach((key, i) => obj[key] = fila[i]?.trim());
        return obj;
    });
}

// Función para iniciar la aplicación
async function iniciarApp() {
    try {
        // Cargar datos desde GitHub
        partidos = await cargarCSV(JORNADA_CSV_URL);
        codigosValidos = (await cargarCSV(CODIGOS_CSV_URL)).map(c => c.codigo);

        // Verificar si hay jornada activa
        const estado = localStorage.getItem("jornadaActiva");
        jornadaActiva = estado === "true";
        premioJornada = localStorage.getItem("premioJornada") || 0;
        horaLimite = localStorage.getItem("horaLimite");

        if (jornadaActiva) {
            document.getElementById("estadoJornada").textContent = 
                `Jornada activa — ingresa tu código.`;
        } else {
            document.getElementById("estadoJornada").textContent = 
                `No hay jornada activa actualmente.`;
        }

        // Mostrar temporizador si hay hora límite
        if (horaLimite) {
            iniciarCuentaRegresiva();
        }

    } catch (error) {
        console.error("Error al cargar los archivos CSV:", error);
    }
}

// Función para validar código del participante
function ingresarCodigo() {
    const codigoIngresado = document.getElementById("codigoInput").value.trim();
    const seccionPronostico = document.getElementById("seccionPronostico");
    const listaPartidos = document.getElementById("listaPartidos");

    if (!jornadaActiva) {
        alert("No hay una jornada activa en este momento.");
        return;
    }

    if (codigosValidos.includes(c
