import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const app = express();
const PORT = process.env.PORT || 3000;

// ==============================
// 📁 Configuración inicial
// ==============================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // sirve los archivos del frontend

// ==============================
// 📦 Datos en memoria (sin archivos JSON)
// ==============================
let jornadas = [];
let codigos = [];

// ==============================
// 🔹 Crear nueva jornada
// ==============================
app.post("/api/jornada", (req, res) => {
  const { nombre, premio, partidos } = req.body;

  if (!nombre || !premio || !partidos?.length) {
    return res.status(400).json({ message: "Datos incompletos para crear la jornada." });
  }

  const nuevaJornada = {
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

  jornadas.push(nuevaJornada);
  console.log("✅ Nueva jornada creada:", nuevaJornada);

  res.json({ message: "✅ Jornada creada con éxito", jornada: nuevaJornada });
});

// ==============================
// 🔹 Obtener todas las jornadas
// ==============================
app.get("/api/jornadas", (req, res) => {
  res.json(jornadas);
});

// ==============================
// 🔹 Activar jornada
// ==============================
app.post("/api/activar/:id", (req, res) => {
  const { id } = req.params;
  jornadas.forEach((j) => (j.activa = false));

  const jornada = jornadas.find((j) => j.id === id);
  if (!jornada) return res.status(404).json({ message: "Jornada no encontrada." });

  jornada.activa = true;
  console.log(`⚡ Jornada activada: ${jornada.nombre}`);
  res.json({ message: "✅ Jornada activada correctamente", jornada });
});

// ==============================
// 🔹 Obtener jornada activa
// ==============================
app.get("/api/jornada-activa", (req, res) => {
  const activa = jornadas.find((j) => j.activa);
  res.json(activa || null);
});

// ==============================
// 🔹 Generar códigos de acceso
// ==============================
app.post("/api/codigos", (req, res) => {
  const { cantidad } = req.body;
  if (!cantidad || cantidad <= 0)
    return res.status(400).json({ message: "Cantidad inválida." });

  const nuevos = Array.from({ length: cantidad }).map(() => ({
    codigo: Math.random().toString(36).substring(2, 8).toUpperCase(),
    usado: false,
  }));

  codigos = [...codigos, ...nuevos];
  console.log(`🎟️ Generados ${cantidad} códigos nuevos.`);
  res.json({ message: "🎟️ Códigos generados correctamente", nuevos });
});

// ==============================
// 🔹 Obtener lista de códigos
// ==============================
app.get("/api/codigos", (req, res) => {
  res.json(codigos);
});

// ==============================
// 🔹 Rutas del frontend
// ==============================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

// ==============================
// 🚀 Iniciar servidor
// ==============================
app.listen(PORT, () => {
  console.log(`✅ Servidor activo en puerto ${PORT}`);
});
