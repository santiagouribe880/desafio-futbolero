import express from "express";
import fs from "fs";
import cors from "cors";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// ==============================
// 📁 Rutas de archivos
// ==============================
const DATA_PATH = "./data";
const JORNADAS_FILE = `${DATA_PATH}/jornada.csv`;
const CODIGOS_FILE = `${DATA_PATH}/codigos.csv`;

// ==============================
// 🔹 Utilidades para leer/escribir CSV
// ==============================
function leerCSV(path) {
  if (!fs.existsSync(path)) return [];
  const data = fs.readFileSync(path, "utf8");
  return data
    .split("\n")
    .filter((l) => l.trim() !== "")
    .map((l) => JSON.parse(l));
}

function escribirCSV(path, array) {
  fs.writeFileSync(path, array.map((x) => JSON.stringify(x)).join("\n"));
}

// ==============================
// 🔹 Crear nueva jornada
// ==============================
app.post("/api/jornada", (req, res) => {
  const { nombre, fecha, premio, partidos } = req.body;
  if (!nombre || !fecha || !premio || !partidos)
    return res.status(400).json({ message: "Datos incompletos" });

  const jornadas = leerCSV(JORNADAS_FILE);

  const nueva = {
    id: uuidv4(),
    nombre,
    fecha,
    premio,
    activa: false,
    partidos,
  };

  jornadas.push(nueva);
  escribirCSV(JORNADAS_FILE, jornadas);
  res.json({ message: "Jornada creada correctamente ✅" });
});

// ==============================
// 🔹 Listar jornadas
// ==============================
app.get("/api/jornadas", (req, res) => {
  const jornadas = leerCSV(JORNADAS_FILE);
  res.json(jornadas);
});

// ==============================
// 🔹 Activar jornada
// ==============================
app.post("/api/activar/:id", (req, res) => {
  const { id } = req.params;
  const jornadas = leerCSV(JORNADAS_FILE);

  if (!jornadas.length) return res.status(404).json({ message: "No hay jornadas creadas" });

  jornadas.forEach((j) => (j.activa = j.id === id));
  escribirCSV(JORNADAS_FILE, jornadas);

  res.json({ message: "Jornada activada correctamente ✅" });
});

// ==============================
// 🔹 Obtener jornada activa
// ==============================
app.get("/api/jornada-activa", (req, res) => {
  const jornadas = leerCSV(JORNADAS_FILE);
  const activa = jornadas.find((j) => j.activa);
  if (!activa) return res.json(null);
  res.json(activa);
});

// ==============================
// 🔹 Generar códigos
// ==============================
app.post("/api/codigos", (req, res) => {
  const { cantidad } = req.body;
  if (!cantidad || cantidad <= 0)
    return res.status(400).json({ message: "Cantidad inválida" });

  const codigos = leerCSV(CODIGOS_FILE);
  for (let i = 0; i < cantidad; i++) {
    codigos.push({
      codigo: Math.random().toString(36).substring(2, 8).toUpperCase(),
      usado: false,
    });
  }
  escribirCSV(CODIGOS_FILE, codigos);
  res.json({ message: "Códigos generados correctamente ✅" });
});

// ==============================
// 🔹 Listar códigos
// ==============================
app.get("/api/codigos", (req, res) => {
  const codigos = leerCSV(CODIGOS_FILE);
  res.json(codigos);
});

// ==============================
// 🚀 Iniciar servidor
// ==============================
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
