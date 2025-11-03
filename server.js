// server.js
import express from "express";
import fs from "fs";
import path from "path";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(express.static("./")); // sirve tus HTML directamente

// Ruta de los archivos JSON
const dataDir = path.join(process.cwd(), "data");
const jornadasPath = path.join(dataDir, "jornadas.json");
const codigosPath = path.join(dataDir, "codigos.json");
const resultadosPath = path.join(dataDir, "resultados.json");

// ✅ Función para leer y escribir JSON
function readJSON(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, "utf-8");
  return data ? JSON.parse(data) : [];
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// =========================
// 🔹 RUTAS DE JORNADAS
// =========================

// Obtener todas las jornadas
app.get("/api/jornadas", (req, res) => {
  const jornadas = readJSON(jornadasPath);
  res.json(jornadas);
});

// Crear nueva jornada
app.post("/api/jornada", (req, res) => {
  const { nombre, premio, partidos } = req.body;

  // Validaciones mínimas
  if (!nombre || !premio || !partidos || partidos.length === 0) {
    return res.status(400).json({ message: "Datos incompletos para crear la jornada." });
  }

  const jornadas = readJSON(jornadasPath);

  // Nueva jornada
  const nuevaJornada = {
    id: Date.now(),
    nombre,
    premio,
    partidos,
    activa: false,
  };

  jornadas.push(nuevaJornada);
  writeJSON(jornadasPath, jornadas);

  res.json({ message: "Jornada creada con éxito 🎉", jornada: nuevaJornada });
});

// Activar jornada (solo una activa a la vez)
app.post("/api/activar/:id", (req, res) => {
  const { id } = req.params;
  let jornadas = readJSON(jornadasPath);

  if (!jornadas || jornadas.length === 0) {
    return res.status(400).json({ message: "No hay jornadas disponibles para activar." });
  }

  jornadas = jornadas.map((j) => ({
    ...j,
    activa: j.id.toString() === id,
  }));

  writeJSON(jornadasPath, jornadas);
  res.json({ message: "Jornada activada correctamente ✅" });
});

// Obtener la jornada activa
app.get("/api/jornada-activa", (req, res) => {
  const jornadas = readJSON(jornadasPath);
  const activa = jornadas.find((j) => j.activa);
  res.json(activa || null);
});

// =========================
// 🔹 RUTAS DE CÓDIGOS
// =========================

// Generar nuevos códigos
app.post("/api/codigos", (req, res) => {
  const { cantidad } = req.body;
  if (!cantidad || cantidad <= 0)
    return res.status(400).json({ message: "Cantidad inválida" });

  const codigos = readJSON(codigosPath);
  const nuevos = Array.from({ length: cantidad }).map(() => {
    return {
      codigo: Math.random().toString(36).substring(2, 8).toUpperCase(),
      usado: false,
    };
  });

  const actualizados = [...codigos, ...nuevos];
  writeJSON(codigosPath, actualizados);

  res.json({ message: "Códigos generados", nuevos });
});

// Listar todos los códigos
app.get("/api/codigos", (req, res) => {
  const codigos = readJSON(codigosPath);
  res.json(codigos);
});

// =========================
// 🔹 RESULTADOS (opcional futuro)
// =========================
app.post("/api/resultados", (req, res) => {
  const resultados = req.body;
  writeJSON(resultadosPath, resultados);
  res.json({ message: "Resultados guardados" });
});

// =========================
app.listen(PORT, () => {
  console.log(`✅ Servidor activo en http://localhost:${PORT}`);
});
