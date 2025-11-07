import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// ==============================
// 🧠 Almacenamiento en memoria
// ==============================
let jornadas = [];
let codigos = [];

// ==============================
// 🔹 Crear nueva jornada
// ==============================
app.post("/api/jornada", (req, res) => {
  const { nombre, premio, partidos } = req.body;

  if (!nombre || !premio || !partidos?.length) {
    return res.status(400).json({ message: "Datos incompletos" });
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
  res.json({ message: "✅ Jornada creada con éxito", jornada: nuevaJornada });
});

// ==============================
// 🔹 Obtener todas las jornadas
// ==============================
app.get("/api/jornadas", (req, res) => res.json(jornadas));

// ==============================
// 🔹 Activar jornada
// ==============================
app.post("/api/activar/:id", (req, res) => {
  const { id } = req.params;
  jornadas.forEach((j) => (j.activa = false));
  const jornada = jornadas.find((j) => j.id === id);
  if (!jornada) return res.status(404).json({ message: "No encontrada" });
  jornada.activa = true;
  res.json({ message: "✅ Jornada activada", jornada });
});

// ==============================
// 🔹 Obtener jornada activa
// ==============================
app.get("/api/jornada-activa", (req, res) => {
  const activa = jornadas.find((j) => j.activa);
  res.json(activa || null);
});

// ==============================
// 🔹 Generar códigos
// ==============================
app.post("/api/codigos", (req, res) => {
  const { cantidad } = req.body;
  if (!cantidad || cantidad <= 0)
    return res.status(400).json({ message: "Cantidad inválida" });

  const nuevos = Array.from({ length: cantidad }).map(() => ({
    codigo: Math.random().toString(36).substring(2, 8).toUpperCase(),
    usado: false,
  }));

  codigos.push(...nuevos);
  res.json({ message: "🎟️ Códigos generados", nuevos });
});

app.get("/api/codigos", (req, res) => res.json(codigos));

// ==============================
// 🚀 Servidor
// ==============================
app.listen(PORT, () => console.log(`✅ Servidor activo en puerto ${PORT}`));
