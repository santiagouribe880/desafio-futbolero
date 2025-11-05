import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

// ==============================
// 📁 Configuración inicial
// ==============================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// ==============================
// 🗂️ Rutas de datos
// ==============================
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

const jornadasPath = path.join(dataDir, "jornadas.json");
const codigosPath = path.join(dataDir, "codigos.json");

// ==============================
// ⚙️ Funciones auxiliares
// ==============================
function readJSON(file) {
  if (!fs.existsSync(file)) return [];
  const data = fs.readFileSync(file, "utf-8");
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ==============================
// 🔹 Crear nueva jornada
// ==============================
app.post("/api/jornada", (req, res) => {
  const { nombre, premio, partidos } = req.body;

  if (!nombre || !premio || !partidos || partidos.length === 0) {
    return res
      .status(400)
      .json({ message: "Datos incompletos para crear la jornada." });
  }

  const jornadas = readJSON(jornadasPath);

  const nuevaJornada = {
    id: uuidv4(),
    nombre,
    premio,
    activa: false,
    partidos: partidos.map((p) => ({
      local: p.local.trim(),
      visitante: p.visitante.trim(),
      fecha: p.fecha ? new Date(p.fecha).toISOString() : null,
      resultado: null,
    })),
  };

  jornadas.push(nuevaJornada);
  writeJSON(jornadasPath, jornadas);

  res.json({ message: "✅ Jornada creada con éxito", jornada: nuevaJornada });
});

// ==============================
// 🔹 Obtener todas las jornadas
// ==============================
app.get("/api/jornadas", (req, res) => {
  const jornadas = readJSON(jornadasPath);
  res.json(jornadas);
});

// ==============================
// 🔹 Activar jornada
// ==============================
app.post("/api/activar/:id", (req, res) => {
  const { id } = req.params;
  const jornadas = readJSON(jornadasPath);

  if (!jornadas.length) {
    return res.status(400).json({ message: "No hay jornadas creadas." });
  }

  // Desactivar todas
  jornadas.forEach((j) => (j.activa = false));

  // Activar la jornada seleccionada
  const jornada = jornadas.find((j) => j.id === id);
  if (!jornada) {
    return res.status(404).json({ message: "Jornada no encontrada." });
  }

  jornada.activa = true;
  writeJSON(jornadasPath, jornadas);

  res.json({ message: "✅ Jornada activada correctamente", jornada });
});

// ==============================
// 🔹 Obtener jornada activa
// ==============================
app.get("/api/jornada-activa", (req, res) => {
  const jornadas = readJSON(jornadasPath);
  const activa = jornadas.find((j) => j.activa);
  res.json(activa || null);
});

// ==============================
// 🔹 Generar códigos
// ==============================
app.post("/api/codigos", (req, res) => {
  const { cantidad } = req.body;
  if (!cantidad || cantidad <= 0)
    return res.status(400).json({ message: "Cantidad inválida." });

  const codigos = readJSON(codigosPath);
  const nuevos = Array.from({ length: cantidad }).map(() => ({
    codigo: Math.random().toString(36).substring(2, 8).toUpperCase(),
    usado: false,
  }));

  const actualizados = [...codigos, ...nuevos];
  writeJSON(codigosPath, actualizados);

  res.json({ message: "🎟️ Códigos generados correctamente", nuevos });
});

// ==============================
// 🔹 Listar códigos
// ==============================
app.get("/api/codigos", (req, res) => {
  const codigos = readJSON(codigosPath);
  res.json(codigos);
});

// ==============================
// 🚀 Servidor
// ==============================
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});
