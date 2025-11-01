// ===============================
// CONFIGURACIÓN PRINCIPAL
// ===============================
const GITHUB_TOKEN = "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";
const REPO = "santiagouribe880/desafio-futbolero";
const FILE_PATH = "data/jornada.csv";
const BRANCH = "main";

// ===============================
// FUNCIÓN: ACTUALIZAR ARCHIVO EN GITHUB
// ===============================
async function actualizarJornadaEnGitHub(nuevaDataCSV) {
  try {
    const getUrl = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;
    const getResp = await fetch(getUrl);
    const fileData = await getResp.json();
    const sha = fileData.sha; // se necesita para reemplazar el archivo

    const content = btoa(unescape(encodeURIComponent(nuevaDataCSV)));

    const putResp = await fetch(getUrl, {
      method: "PUT",
      headers: {
        "Authorization": `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "Actualizar jornada desde panel admin",
        content: content,
        sha: sha,
        branch: BRANCH
      })
    });

    if (putResp.ok) {
      alert("✅ Jornada actualizada correctamente en GitHub.");
    } else {
      const errorData = await putResp.json();
      console.error("Error:", errorData);
      alert("⚠️ Error al subir la jornada a GitHub.");
    }
  } catch (err) {
    console.error("Error general:", err);
    alert("❌ No se pudo conectar con GitHub.");
  }
}

// ===============================
// FUNCIÓN: GENERAR NUEVO CSV
// ===============================
function generarCSV() {
  // Aquí podrías reemplazar los datos con lo que definas dinámicamente
  const csvData = `
jornada,partido,equipo_local,equipo_visitante,fecha,activa
2,Partido 1,Nacional,Medellín,2025-11-05,true
2,Partido 2,Millonarios,Santafe,2025-11-05,true
2,Partido 3,Cali,Tolima,2025-11-05,true
2,Partido 4,América,Bucaramanga,2025-11-05,true
  `.trim();

  document.getElementById("csv-preview").value = csvData;
  return csvData;
}

// ===============================
// EVENTOS DE BOTONES
// ===============================
document.getElementById("generar-btn").addEventListener("click", () => {
  const nuevaData = generarCSV();
  document.getElementById("csv-preview").value = nuevaData;
});

document.getElementById("activar-btn").addEventListener("click", async () => {
  const premio = document.getElementById("premio").value.trim();
  const fecha = document.getElementById("fecha_limite").value;

  if (!premio || !fecha) {
    alert("Por favor completa el premio y la fecha límite antes de activar.");
    return;
  }

  const nuevaData = document.getElementById("csv-preview").value.trim();
  if (!nuevaData) {
    alert("Debes generar la jornada antes de activarla.");
    return;
  }

  await actualizarJornadaEnGitHub(nuevaData);
});
