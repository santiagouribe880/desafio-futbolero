let jornadaActiva = false;
let partidos = [];
let codigosValidos = [];
let codigoIngresado = "";

// Cargar jornada activa
async function cargarJornada() {
    try {
        const response = await fetch('jornadas/jornada_actual.csv');
        const data = await response.text();
        const filas = data.trim().split('\n').slice(1);

        partidos = filas.map(f => {
            const [partido, local, visitante] = f.split(',');
            return { partido, local, visitante };
        });
        jornadaActiva = true;
        document.getElementById('estadoJornada').innerText = "Jornada activa — ingresa tu código.";
    } catch (error) {
        document.getElementById('estadoJornada').innerText = "No hay jornada activa actualmente.";
    }
}

// Cargar códigos válidos
async function cargarCodigos() {
    try {
        const response = await fetch('data/codigos.csv');
        const data = await response.text();
        const filas = data.trim().split('\n').slice(1);
        codigosValidos = filas.map(f => f.trim());
    } catch (error) {
        console.error("No se pudieron cargar los códigos.");
    }
}

// Validar código ingresado
function validarCodigo() {
    codigoIngresado = document.getElementById("codigoInput").value.trim();

    if (!jornadaActiva) {
        alert("No hay jornada activa actualmente.");
        return;
    }

    if (!codigosValidos.includes(codigoIngresado)) {
        alert("Código inválido. Verifica tu código de participación.");
        return;
    }

    mostrarPronostico();
}

// Mostrar formulario de pronóstico
function mostrarPronostico() {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("pronostico-section").style.display = "block";

    const form = document.getElementById("formPronostico");
    form.innerHTML = "";

    partidos.forEach(p => {
        const div = document.createElement("div");
        div.className = "partido";
        div.innerHTML = `
            <p><strong>${p.partido}</strong>: ${p.local} vs ${p.visitante}</p>
            <label>${p.local} <input type="radio" name="${p.partido}" value="${p.local}" required></label>
            <label>Empate <input type="radio" name="${p.partido}" value="Empate" required></label>
            <label>${p.visitante} <input type="radio" name="${p.partido}" value="${p.visitante}" required></label>
        `;
        form.appendChild(div);
    });
}

// Guardar pronóstico (simulado)
function enviarPronostico() {
    alert(`Pronóstico enviado correctamente para el código: ${codigoIngresado}`);
    document.getElementById("pronostico-section").style.display = "none";
    document.getElementById("login-section").style.display = "block";
    document.getElementById("codigoInput").value = "";
}

cargarJornada();
cargarCodigos();
