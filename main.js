const url = "https://raw.githubusercontent.com/santiagouribe880/desafio-futbolero/main/data/jornadas.csv";

async function cargarPartidos(jornadaActual) {
    const response = await fetch(url);
    const data = await response.text();

    const lines = data.trim().split("\n");
    const headers = lines[0].split(",");
    const partidos = lines.slice(1).map(line => {
        const values = line.split(",");
        let obj = {};
        headers.forEach((header, index) => obj[header] = values[index]);
        return obj;
    });

    // Filtra los partidos según la jornada
    return partidos.filter(p => p.jornada == jornadaActual);
}

// Ejemplo de uso:
cargarPartidos(1).then(partidos => {
    console.log(partidos);
    // Aquí renderizas los partidos en la sección de pronósticos
});
