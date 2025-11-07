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
app.use(express.static(path.join(__dirname, "public"))); // ✅ sirve los archivos desde /public

// ==============================
// 🗂️ Archivos de datos
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
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
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
  if (!nombre || !premio || !partidos?.length)
    return res.status(400).json({ message: "Datos incompletos" });

  const jornadas = readJSON(jornadasPath);
  const nueva = {
    id: uuidv4(),
    nombre,
    premio,
    activa: false,
    partidos: partidos.map((p) => ({
      local: p.local,
      visitante: p.visitante,
      fecha: p.fecha,
      resultado: null,
    })),
  };

  jornadas.push(nueva);
  writeJSON(jornadasPath, jornadas);
  res.json({ message: "✅ Jornada creada con éxito", jornada: nueva });
});

// ==============================
// 🔹 Obtener todas las jornadas
// ==============================
app.get("/api/jornadas", (req, res) => res.json(readJSON(jornadasPath)));

// ==============================
// 🔹 Activar jornada
// ==============================
app.post("/api/activar/:id", (req, res) => {
  const { id } = req.params;
  const jornadas = readJSON(jornadasPath);

  jornadas.forEach((j) => (j.activa = false));
  const jornada = jornadas.find((j) => j.id === id);
  if (!jornada) return res.status(404).json({ message: "No encontrada" });

  jornada.activa = true;
  writeJSON(jornadasPath, jornadas);
  res.json({ message: "✅ Jornada activada", jornada });
});

// ==============================
// 🔹 Obtener jornada activa
// ==============================
app.get("/api/jornada-activa", (req, res) => {
  const j = readJSON(jornadasPath).find((x) => x.activa);
  res.json(j || null);
});

// ==============================
// 🔹 Generar códigos
// ==============================
app.post("/api/codigos", (req, res) => {
  const { cantidad } = req.body;
  if (!cantidad || cantidad <= 0)
    return res.status(400).json({ message: "Cantidad inválida" });

  const codigos = readJSON(codigosPath);
  const nuevos = Array.from({ length: cantidad }).map(() => ({
    codigo: Math.random().toString(36).substring(2, 8).toUpperCase(),
    usado: false,
  }));

  writeJSON(codigosPath, [...codigos, ...nuevos]);
  res.json({ message: "🎟️ Códigos generados", nuevos });
});

app.get("/api/codigos", (req, res) => res.json(readJSON(codigosPath)));

// ==============================
// 🔹 Rutas de interfaz (Frontend)
// ==============================

// Panel del administrador
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

// Página principal de los jugadores
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ==============================
// 🚀 Iniciar servidor
// ==============================
app.listen(PORT, () =>
  console.log(`✅ Servidor activo en puerto ${PORT}`)
);
